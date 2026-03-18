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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <input
        type="text"
        value={movie}
        onChange={(e) => setMovie(e.target.value)}
        placeholder="e.g. Inception"
        className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Continue"}
      </button>
    </form>
    );
}