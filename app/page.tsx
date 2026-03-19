import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Divider from "@/components/Divider";
import FilmStrip from "@/components/FilmStrip";
import SignInButton from "@/components/SignInButton";


export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect ("/dashboard");
  }
  return (
  <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0805] text-white">
    {/* Film grain overlay */}
    <div
    className="pointer-events-none fixed inset-0 z-50 opacity-[0.035]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "128px 128px",
    }}
    />
 
    {/* Radial vignette */}
    <div
    className="pointer-events-none fixed inset-0 z-40"
    style={{
      background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 100%)",
    }}
    />
 
    {/* Ambient warm glow */}
    <div
    className="pointer-events-none absolute inset-0 z-0"
    style={{
    background: "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(180,120,40,0.08) 0%, transparent 70%)",
    }}
    />
 
    {/* Film strip top */}
    <div className="absolute top-0 left-0 right-0 h-10 flex items-center overflow-hidden z-10 opacity-20">
        <FilmStrip />
    </div>
 
    {/* Film strip bottom */}
    <div className="absolute bottom-0 left-0 right-0 h-10 flex items-center overflow-hidden z-10 opacity-20">
      <FilmStrip />
    </div>
 
    {/* Main content */}
    <div className="relative z-10 flex flex-col items-center text-center px-6">
      {/* Eyebrow */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c8922a]" />
        <span
        className="text-[10px] tracking-[0.4em] uppercase text-[#c8922a] font-medium"
        style={{ fontFamily: "'Georgia', serif" }}
        >
          WELCOME TO
        </span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c8922a]" />
      </div>
 
      {/* Title */}
      <h1
        className="text-[clamp(3.5rem,12vw,8rem)] font-black leading-none tracking-tight mb-1 relative"
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          letterSpacing: "-0.02em",
        }}
      >
        <span
        className="block"
        style={{
          background: "linear-gradient(180deg, #f5e6c8 0%, #c8922a 60%, #7a4f10 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "none",
        }}
        >
          MOVIE
        </span>
        <span
        className="block -mt-2 italic pb-2"
        style={{
          background: "linear-gradient(180deg, #e8d5aa 0%, #a87520 70%, #5c3a08 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        >
          Memory
        </span>
      </h1>
 
      {/* Divider ornament */}
      <Divider />
 
      {/* Tagline */}
      <p
      className="text-[#9a8060] text-sm tracking-[0.25em] uppercase mb-12 max-w-xs leading-relaxed"
      style={{ fontFamily: "'Georgia', serif" }}
      >
        Your favorite films,<br />
        <em className="text-[#b89050] not-italic tracking-[0.35em]">
          remembered forever
        </em>
      </p>
 
      {/* CTA */}
      <div className="flex flex-col items-center gap-4">
        <SignInButton />
        <p
        className="text-[11px] text-[#4a3f30] tracking-widest uppercase mt-2"
        style={{ fontFamily: "'Georgia', serif" }}
        >
          No account needed &mdash; sign in instantly
        </p>
      </div>
      </div>
    </main>
  );
}

