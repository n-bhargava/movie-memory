import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
});

const CACHE_WINDOW = 60 * 1000; // 60 seconds

export async function GET() {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const movie = await prisma.movie.findUnique({
        where: { userId: session.user.id },
    });

    if (!movie) {
        return NextResponse.json({ error: "No favorite movie found" }, { status: 404 });
    }

    const recentFact = await prisma.fact.findFirst({
        where: {
            userId: session.user.id,
            movieId: movie.id,
            generatedAt: {
                gte: new Date(Date.now() - CACHE_WINDOW),
            },
        },
        orderBy: { generatedAt: "desc" },
    })

    if (recentFact) {
        return NextResponse.json({ fact: recentFact.content, cached: true });
    }

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "user",
                    content: `Tell me one short, interesting, and surprising fun fact about the movie "${movie.title}". Keep it to 2-3 sentences maximum. Just give the fact, do not start with phrases like "Here's a fun fact" or "Did you know".`,
                },
            ],
        });

        const factContent = completion.choices[0]?.message?.content;

        if (!factContent) {
            throw new Error("No content returned from Groq");
        }

        const fact = await prisma.fact.create({
            data: {
                content: factContent,
                userId: session.user.id,
                movieId: movie.id,
            },
        });

        return NextResponse.json({ fact: fact.content, cached: false });
    } catch (error) {
        const fallbackFact = await prisma.fact.findFirst({
            where: {
                userId: session.user.id,
                movieId: movie.id,
            },
            orderBy: { generatedAt: "desc" },
        });

        if (fallbackFact) {
            return NextResponse.json({ fact: fallbackFact.content, cached: true });
        }

        return NextResponse.json(
            { error: "Failed to generate fact. Please try again later." },
            { status: 500 }
        );
    }
} 