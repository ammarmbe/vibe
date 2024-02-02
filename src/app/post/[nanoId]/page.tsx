import React from "react";
import { Metadata } from "next/types";
import sanitize from "sanitize-html";
import Header from "@/components/Header/Header";
import getQueryClient from "@/lib/utils";
import Post from "@/components/PostPage/Post";

interface Props {
	params: {
		nanoId: string;
	};
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { decode } = await import("he");

	const res = await fetch(
		`${process.env.URL}/api/post?nanoId=${params.nanoId}`,
	);
	const post = await res.json();

	return {
		title: post.name ? `${post.name} on Vibe` : "Vibe",
		description:
			"Vibe is a social media web app all about connecting with people who share your interests, and it's the perfect place to share your thoughts, photos, and videos.",
		metadataBase: new URL("https://vibe.ambe.dev"),
		openGraph: {
			description: post.content
				? decode(sanitize(post.content, { allowedTags: [] }))
				: "Vibe is a social media web app all about connecting with people who share your interests, and it's the perfect place to share your thoughts, photos, and videos.",
		},
	};
}

export default async function Page({ params }: Props) {
	const queryClient = getQueryClient();

	queryClient.prefetchQuery({
		queryKey: ["postPage", params.nanoId],
		queryFn: async () => {
			const res = await fetch(
				`${process.env.URL}/api/post?nanoId=${params.nanoId}`,
			);
			return res.json();
		},
	});

	queryClient.prefetchInfiniteQuery({
		queryKey: ["comments", params.nanoId],
		queryFn: async ({ pageParam = 4294967295 }) => {
			const res = await fetch(
				`${process.env.URL}/api/posts/parentNanoId?postId=${pageParam}&parentNanoId=${params.nanoId}`,
			);
			return res.json();
		},
	});

	return (
		<main className="max-w-2xl h-full flex flex-col w-full mx-auto px-2.5">
			<Header />
			<Post nanoId={params.nanoId} />
		</main>
	);
}
