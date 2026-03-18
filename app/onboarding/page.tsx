import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OnboardingForm from "@/components/OnboardingForm";

export default async function OnboardingPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const movie = await prisma.movie.findUnique({
        where: { userId: session.user.id },
    });

    if (movie) {
        redirect("/dashboard");
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome to Movie Memory</h1>
            <p className="text-gray-400 mb-8">What's your favorite movie?</p>
            <OnboardingForm />
        </main>
    );

}