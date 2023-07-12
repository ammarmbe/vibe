import React from "react";
import { jetBrains } from "@/app/layout";
import { SignInButton, SignUpButton, currentUser } from "@clerk/nextjs";
import AccountButton from "./AccountButton";

export default async function Header() {
  const user = await currentUser();

  return (
    <header className="py-3 flex items-center justify-between">
      <h1
        className={`${jetBrains.className} text-main select-none italic font-extrabold text-3xl tracking-tighter`}
      >
        <a href="/">Vibe</a>
      </h1>
      <nav className="flex gap-2.5 items-center">
        {!user ? (
          <>
            <SignInButton>
              <button className="border rounded-md hover:border-ring hover:bg-accent transition-colors px-2.5 py-1">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="border rounded-md border-main/20 hover:bg-main/5 hover:border-main/50 text-main transition-colors px-2.5 py-1">
                Sign up
              </button>
            </SignUpButton>
          </>
        ) : (
          <AccountButton />
        )}
      </nav>
    </header>
  );
}
