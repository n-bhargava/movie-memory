"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut()}
            className="outline w-full text-white"
        >
            Sign Out
        </button>
    )
}