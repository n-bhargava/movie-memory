import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/SignOutButton";
import MovieFact from "@/components/MovieFact";

export default async function DashboardPageg() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const movie = await prisma.movie.findUnique({
        where: { userId: session.user.id },
    });

    if (!movie) {
        redirect("/onboarding");
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 flex flex-col gap-6">
                {/* User Info */}
                <div className="flex items-center gap-4">
                {session.user.image && (
                    <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-14 h-14 rounded-full"
                    />
                )}
                    <div>
                        <p className="font-semibold text-lg">{session.user.name ?? "Anonymous"}</p>
                        <p className="text-gray-400 text-sm">{session.user.email}</p>
                    </div>
                </div>

                {/* Favorite Movie */}
                <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Favorite Movie</p>
                    <p className="text-white font-semibold text-lg">{movie.title}</p>
                </div>

                {/* Movie Fact */}
                <MovieFact movieTitle={movie.title} />

                {/* Sign Out */}
                <SignOutButton />
            </div>
        </main>
    );
}