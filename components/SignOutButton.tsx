"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function SignOutButton() {
    const [isLoading, setIsLoading] = useState(false);

    function handleClick() {
        setIsLoading(true);
        signOut();
    }

    return (
    <button
    onClick={handleClick}
    disabled={isLoading}
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
        Sign Out
    </button>
    );
}