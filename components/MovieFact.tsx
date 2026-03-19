"use client";

import { useState, useEffect } from "react";

export default function MovieFact({ movieTitle }: { movieTitle: string }) {
    const [fact, setFact] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchFact() {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/api/fact")
        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Failed to fetch fact");
        } else {
            setFact(data.fact);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        fetchFact();
    }, []);

    return (
    <div>
        <p
        className="text-[9px] tracking-[0.35em] uppercase text-[#c8922a]/70 mb-2 text-center"
        style={{ fontFamily: "'Georgia', serif" }}
        >
            Did You Know
        </p>
        
        <div
        className="text-sm leading-relaxed min-h-[3rem]"
        style={{ fontFamily: "'Georgia', serif" }}
        >
            {isLoading && (
                <p className="text-[#4a3f30] italic tracking-wide animate-pulse">
                    Consulting the archives...
                </p>
            )}
            
            {error && (
                <p className="text-red-400/70 text-xs tracking-wide">{error}</p>
            )}
            
            {fact && !isLoading && (
                <p className="text-[#9a8060]">{fact}</p>
            )}
        </div>
        
        <div className="flex justify-center mt-3">
            <button
            onClick={fetchFact}
            disabled={isLoading}
            className="mt-3 text-[10px] tracking-[0.3em] uppercase transition-colors disabled:opacity-30 cursor-pointer"
            style={{
                fontFamily: "'Georgia', serif",
                color: isLoading ? "#4a3f30" : "#c8922a",
            }}
            >
                {isLoading ? "Loading..." : "↻ Another Fact"}
            </button>
        </div>
    </div>
  );

}