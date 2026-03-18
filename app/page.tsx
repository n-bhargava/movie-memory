import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignInButton from "@/components/SignInButton";


export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect ("/dashboard");
  }
  return (
      <main className="min-h-screen flex flex-col items-center items-center justify-center bg-gray-950 text-white">
        <h1 className="text-4xl font-bold mb-2">Movie Memory</h1>
          <p className="text-gray-400 mb-8">Your favorite films, remembered</p>
          <SignInButton/>
      </main>
  );
}

