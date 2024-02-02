import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import LoadingBar from "@/components/LoadingBar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Vibe",
	description:
		"Vibe is a social media web app all about connecting with people who share your interests, and it's the perfect place to share your thoughts, photos, and videos.",
	metadataBase: new URL("https://vibe.ambe.dev"),
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<Providers>
				<body className={inter.className}>
					<LoadingBar />
					{children}
					<Analytics />
					<SpeedInsights />
				</body>
			</Providers>
		</html>
	);
}
