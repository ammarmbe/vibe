import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vibe",
  description:
    "Introducing Vibe, a new social media web app built with Next.js 13. Vibe is all about connecting with people who share your interests, and it's the perfect place to share your thoughts, photos, and videos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ReactQueryProvider>
        <ClerkProvider
          appearance={{ variables: { colorPrimary: "#cd002b" } }}
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <body className={inter.className}>{children}</body>
        </ClerkProvider>
      </ReactQueryProvider>
    </html>
  );
}
