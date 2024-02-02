"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useRef } from "react";
import type { Post, Repost } from "@/lib/types";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "./PostCard/PostCard";
import Spinner from "./Spinner";
import { useRouter, useSearchParams } from "next/navigation";

export default function Feed() {
	const searchParams = useSearchParams();
	const feed = useRef(searchParams.get("feed"));

	const { push } = useRouter();

	if (
		feed.current !== "Home" &&
		feed.current !== "Following" &&
		feed.current !== null
	) {
		push("/?feed=Home");
		return null;
	}

	const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
		queryKey: ["homeFeed", feed],
		queryFn: async ({ pageParam = 4294967295 }) => {
			const res = await fetch(
				`/api/posts?postId=${pageParam}&feed=${feed.current || "Home"}`,
			);
			return res.json();
		},
		getNextPageParam: (lastPage, _pages) => {
			if (lastPage?.length >= 11) {
				return lastPage[lastPage.length - 1].postId;
			}
			return undefined;
		},
		enabled: Boolean(feed),
	});

	if (isLoading)
		return (
			<div className="w-full flex h-full items-center justify-center">
				<Spinner size="xl" />
			</div>
		);

	if (data?.pages[0] && data?.pages[0].length > 0)
		return (
			<>
				<InfiniteScroll
					dataLength={data.pages.flatMap((page) => page).length}
					hasMore={hasNextPage || false}
					loader={
						<div className="flex w-full justify-center">
							<Spinner size="md" />
						</div>
					}
					endMessage={
						<p className="text-foreground/30 text-center">No more posts</p>
					}
					next={fetchNextPage}
					className="flex flex-col gap-2.5 pb-2.5"
				>
					{data.pages.map((page) => {
						return page
							.sort((a: Post | Repost, b: Post | Repost) => {
								let acreatedAt: string;
								let bcreatedAt: string;

								if ("reposterName" in a) {
									acreatedAt = a.repostCreatedAt;
								} else {
									acreatedAt = a.createdAt;
								}

								if ("reposterName" in b) {
									bcreatedAt = b.repostCreatedAt;
								} else {
									bcreatedAt = b.createdAt;
								}

								return parseInt(bcreatedAt) - parseInt(acreatedAt);
							})
							.map((post: Post | Repost) => {
								return (
									<PostCard
										key={
											post.postId + ("repostCreatedAt" in post ? "repost" : "")
										}
										post={post}
									/>
								);
							});
					})}
				</InfiniteScroll>
			</>
		);
	return <p className="text-foreground/30 text-center">No posts yet...</p>;
}
