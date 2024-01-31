import { useQuery } from "@tanstack/react-query";
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
	const { data: mainPost } = useQuery({
		queryKey: ["post", params.nanoId],
		queryFn: async () =>
			(await (await fetch(`/api/post?nanoId=${params.nanoId}`)).json()) as Post,
	});

	return {
		title: `${mainPost?.name} on Vibe`,
		description: mainPost?.content
			? sanitize(mainPost?.content, { allowedTags: [] })
			: "Vibe is a social media web app all about connecting with people who share your interests, and it's the perfect place to share your thoughts, photos, and videos.",
		metadataBase: new URL("https://vibe.ambe.dev"),
	};
}

export default function Page({ params }: Props) {
	return <PostPage nanoId={params.nanoId} />;
}
