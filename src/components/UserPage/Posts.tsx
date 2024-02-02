"use client";
import { Post, Repost } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "../PostCard/PostCard";
import Spinner from "../Spinner";

export default function Page({ userId }: { userId: string }) {
	const {
		data: userPosts,
		hasNextPage,
		fetchNextPage,
		isLoading: postsLoading,
	} = useInfiniteQuery({
		queryKey: ["userPosts", userId],
		queryFn: async ({ pageParam = 4294967295 }) => {
			const res = await fetch(
				`/api/posts/userId?userId=${userId}&postId=${pageParam}`,
			);
			return res.json();
		},
		getNextPageParam: (lastPage, _pages) => {
			if (lastPage?.length >= 11) {
				return lastPage[lastPage.length - 1].postId;
			}
			return undefined;
		},
	});

	return postsLoading ? (
		<div className="w-full flex items-center justify-center">
			<Spinner size="xl" />
		</div>
	) : userPosts && userPosts.pages[0].length > 0 ? (
		<InfiniteScroll
			dataLength={userPosts.pages.flatMap((page) => page).length}
			hasMore={hasNextPage || false}
			loader={
				<div className="w-full flex items-center justify-center">
					<Spinner size="xl" />
				</div>
			}
			endMessage={<p className="text-ring/70 text-center">No more posts</p>}
			next={fetchNextPage}
			className="flex flex-col gap-2.5 pb-2.5"
		>
			{userPosts.pages.map((page) => {
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
								key={post.postId + ("repostCreatedAt" in post ? "repost" : "")}
								post={post}
							/>
						);
					});
			})}
		</InfiniteScroll>
	) : (
		<p className="text-ring/70 text-center">This user hasn&apos;t posted yet</p>
	);
}
