import Feed from "@/components/Feed";
import Header from "@/components/Header/Header";
import NewPost from "@/components/NewPost";
import getQueryClient from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { Suspense } from "react";

export default async function Home() {
	const { userId } = auth();
	const queryClient = getQueryClient();

	queryClient.prefetchInfiniteQuery(
		["homeFeed", "Home"],
		async ({ pageParam = 4294967295 }) => {
			const res = await fetch(
				`${process.env.URL}/api/posts?postId=${pageParam}&feed=Home`,
			);
			return res.json();
		},
	);

	return (
		<main className="max-w-2xl h-full flex flex-col w-full mx-auto px-2.5">
			<Header />
			{userId && <NewPost />}
			<Suspense fallback={<div />}>
				<Feed />
			</Suspense>
		</main>
	);
}
