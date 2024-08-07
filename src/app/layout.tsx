import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import LoadingBar from "@/components/LoadingBar";
import { ClerkProvider } from "@clerk/nextjs";
import ReactQueryProvider from "../lib/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Vibe",
	description:
		"Vibe is a social media web app all about connecting with people who share your interests, and it's the perfect place to share your thoughts, photos, and videos.",
	metadataBase: new URL("https://vibe.ambe.dev"),
	appleWebApp: {
		title: "Vibe",
		capable: true,
		statusBarStyle: "default",
	},
};

export const viewport: Viewport = {
	themeColor: "#0f0f0f",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<ClerkProvider
				appearance={{ variables: { colorPrimary: "#cf202f" } }}
				publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
			>
				<ReactQueryProvider>
					<body className={inter.className}>
						<LoadingBar />
						{children}
						<Analytics />
					</body>
				</ReactQueryProvider>
			</ClerkProvider>
		</html>
	);
}
