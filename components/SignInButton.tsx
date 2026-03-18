"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {

    return (
        <button 
            onClick={() => signIn("google")}
            className="outline pt-2 pb-2 pl-2 pr-2 text-white"
        >
            Sign in with Google
        </button>
    );
}