import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Post } from "@/lib/types";
import { Metadata } from "next/types";
import PostPage from "@/components/PostPage";

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
		description: mainPost?.content,
		metadataBase: new URL("https://vibe.ambe.dev"),
	};
}

export default function Page({ params }: Props) {
	return <PostPage nanoId={params.nanoId} />;
}
