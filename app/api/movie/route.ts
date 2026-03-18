import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();

    const trimmed = title?.trim();

    if (!trimmed || trimmed.length < 1) {
        return NextResponse.json({ error: "Movie title is required" }, { status: 400 });
    }
    if (trimmed.length > 100) {
        return NextResponse.json({ error: "Movie title must be under 100 characters" }, { status: 400 });
    }

    const movie = await prisma.movie.upsert({
        where: { userId: session.user.id },
        update: { title: trimmed },
        create: { title: trimmed, userId: session.user.id },
    });
    
    return NextResponse.json(movie);
}