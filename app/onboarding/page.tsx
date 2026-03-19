import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FilmStrip from "@/components/FilmStrip";
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
        className="relative z-10 w-full max-w-sm mx-6 px-8 py-8 flex flex-col items-center text-center"
        style={{
            background: "linear-gradient(160deg, rgba(30,22,12,0.95) 0%, rgba(15,10,5,0.98) 100%)",
            border: "1px solid rgba(200,146,42,0.2)",
            boxShadow: "0 0 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(200,146,42,0.1)",
        }}
        >
        
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6 w-full">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c8922a]" />
            <span
            className="text-[9px] tracking-[0.4em] uppercase text-[#c8922a] whitespace-nowrap"
            style={{ fontFamily: "'Georgia', serif" }}
            >
                First things first
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c8922a]" />
        </div>
 
        {/* Title */}
        <h1
        className="text-4xl font-black leading-none mb-1"
        style={{ fontFamily: "'Georgia', serif" }}
        >
            <span
            style={{
                background: "linear-gradient(180deg, #f5e6c8 0%, #c8922a 60%, #7a4f10 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
            }}
            >
                Welcome
            </span>
        </h1>
        
        <p
        className="text-lg italic pb-1"
        style={{
            fontFamily: "'Georgia', serif",
            background: "linear-gradient(180deg, #e8d5aa 0%, #a87520 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
        }}
        >
            {session.user.name?.split(" ")[0] ?? "friend"}
        </p>
 
        {/* Ornament */}
        <div className="flex items-center gap-3 my-5 w-full">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c8922a]/40" />
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-[#c8922a]/70">
                <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z" fill="currentColor" />
            </svg>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c8922a]/40" />
        </div>
 
        {/* Prompt */}
        <p
        className="text-[#9a8060] text-sm tracking-wide leading-relaxed mb-6"
        style={{ fontFamily: "'Georgia', serif" }}
        >
            Every great journey begins with a single film.
            <br />
            <span className="text-[#6a5840] text-xs tracking-widest uppercase mt-1 block">
            What's yours?
            </span>
        </p>
 
        {/* Form */}
        <div className="w-full">
            <OnboardingForm />
        </div>
        </div>
    </main>
    );

}