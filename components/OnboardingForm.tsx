"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingForm() {
    const router = useRouter();
    const [movie, setMovie] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const res = await fetch("/api/movie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: movie }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Something went wrong");
            setIsLoading(false);
            return;
        }

        router.push("/dashboard");
    }

    return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <input
        type="text"
        value={movie}
        onChange={(e) => setMovie(e.target.value)}
        placeholder="e.g. Inception"
        className="w-full px-4 py-3 bg-transparent text-[#f5e6c8] placeholder-[#4a3f30] text-sm tracking-wide focus:outline-none"
        style={{
            fontFamily: "'Georgia', serif",
            borderBottom: "1px solid rgba(200,146,42,0.4)",
        }}
        />
        
        {error && (
            <p
            className="text-red-400/70 text-xs tracking-wide"
            style={{ fontFamily: "'Georgia', serif" }}
            >
                {error}
            </p>
        )}
        
        <button
        type="submit"
        disabled={isLoading || !movie.trim()}
        className="mt-2 w-full py-3 text-[11px] tracking-[0.4em] uppercase transition-all disabled:opacity-30 cursor-pointer"
        style={{
            fontFamily: "'Georgia', serif",
            color: "#0a0805",
            background: isLoading
            ? "rgba(200,146,42,0.5)"
            : "linear-gradient(135deg, #c8922a 0%, #e8b84b 50%, #c8922a 100%)",
            boxShadow: isLoading ? "none" : "0 0 20px rgba(200,146,42,0.2)",
        }}
        >
            {isLoading ? "Saving..." : "Continue →"}
        </button>
    </form>
  );
}