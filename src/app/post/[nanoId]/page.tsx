import React from "react";
import { Post } from "@/lib/types";
import { Metadata } from "next/types";
import PostPage from "@/components/PostPage";
import sanitize from "sanitize-html";

interface Props {
	params: {
		nanoId: string;
	};
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const mainPost = (await (
		await fetch(`https://vibe.ambe.dev/api/post?nanoId=${params.nanoId}`)
	).json()) as Post;

	return {
		title: mainPost?.name ? `${mainPost?.name} on Vibe` : "Vibe",
		description:
			"Vibe is a social media web app all about connecting with people who share your interests, and it's the perfect place to share your thoughts, photos, and videos.",
		metadataBase: new URL("https://vibe.ambe.dev"),
		openGraph: {
			description: mainPost?.content
				? sanitize(mainPost?.content, { allowedTags: [] })
				: "Vibe is a social media web app all about connecting with people who share your interests, and it's the perfect place to share your thoughts, photos, and videos.",
		},
	};
}

export default function Page({ params }: Props) {
	return <PostPage nanoId={params.nanoId} />;
}
