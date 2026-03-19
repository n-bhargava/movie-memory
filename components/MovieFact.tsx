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
        <div className="bg-gray-800 rounded-xl p-4 flex flex-col gap-3">
            <p className="text-gray-400 text-sm">Fun Fact about {movieTitle}</p>
            {isLoading && <p className="text-gray-400 text-sm">Generating fact...</p>}
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {fact && <p className="text-white text-sm leading-relaxed">{fact}</p>}
            <button
                onClick={fetchFact}
                disabled={isLoading}
                className="outline text-white"
            >
                {isLoading ? "Loading..." : "Get New Fact"}
            </button>
        </div>
  );
}