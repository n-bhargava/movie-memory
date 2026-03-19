import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Avatar from "@/components/Avatar";
import Divider from "@/components/Divider";
import FilmStrip from "@/components/FilmStrip";
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
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0805] text-white">
        {/* Film grain */}
        <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035]"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
        }}
        />
        {/* Vignette */}
        
        <div
        className="pointer-events-none fixed inset-0 z-40"
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 100%)" }}
        />
        
        {/* Ambient glow */}
        <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(180,120,40,0.08) 0%, transparent 70%)" }}
        />
 
        {/* Film strips */}
        <div className="absolute top-0 left-0 right-0 h-10 flex items-center overflow-hidden z-10 opacity-20">
            <FilmStrip />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 flex items-center overflow-hidden z-10 opacity-20">
            <FilmStrip />
        </div>
 
        {/* Card */}
        <div
        className="relative z-10 w-full max-w-sm mx-6 px-8 py-8"
        style={{
            background: "linear-gradient(160deg, rgba(30,22,12,0.95) 0%, rgba(15,10,5,0.98) 100%)",
            border: "1px solid rgba(200,146,42,0.2)",
            boxShadow: "0 0 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(200,146,42,0.1)",
        }}
        >
        
        {/* Header label */}
        <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#c8922a]" />
            <span
            className="text-[9px] tracking-[0.4em] uppercase text-[#c8922a]"
            style={{ fontFamily: "'Georgia', serif" }}
            >
                Your Profile
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c8922a]/30" />
        </div>
 
        {/* User info */}
        <div className="flex items-center gap-4 mb-2">
            {session.user.image && (
                <Avatar name={session.user.name} image={session.user.image} />

            )}
            <div>
                <p
                className="font-semibold text-lg leading-tight"
                style={{
                    fontFamily: "'Georgia', serif",
                    background: "linear-gradient(180deg, #f5e6c8 0%, #c8922a 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                }}
                >
                    {session.user.name ?? "Anonymous"}
                </p>
                
                <p
                className="text-[#6a5840] text-xs tracking-wider mt-0.5"
                style={{ fontFamily: "'Georgia', serif" }}
                >
                    {session.user.email}
                </p>
            </div>
        </div>
        
        <Divider />
 
        {/* Favorite Movie */}
        <div className="mb-1 text-center">
            <p
            className="text-[9px] tracking-[0.35em] uppercase text-[#c8922a]/70 mb-2"
            style={{ fontFamily: "'Georgia', serif" }}
            >
                Favorite Film
            </p>

            <p
            className="text-xl font-semibold italic"
            style={{
                fontFamily: "'Georgia', serif",
                background: "linear-gradient(180deg, #f5e6c8 0%, #d4a84b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
            }}
            >
                {movie.title}
            </p>
        </div>
 
        <Divider />
 
        {/* Movie Fact */}
        <div className="mb-1">
            <div className="text-[#9a8060] text-sm leading-relaxed" style={{ fontFamily: "'Georgia', serif" }}>
                <MovieFact movieTitle={movie.title} />
            </div>
        </div>
 
        <Divider />
 
        {/* Sign out */}
        <div className="flex justify-center mt-2">
            <SignOutButton />
        </div>
    </div>
    </main>
  );    
}