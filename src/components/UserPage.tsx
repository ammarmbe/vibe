"use client";
import { Post, Repost, User } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import EditProfile from "./EditProfile";
import FollowButton from "./FollowButton";
import Spinner from "./Spinner";
import Header from "./header/Header";
import PostCard from "./post/PostCard";
import Image from "next/image";
import { PencilIcon } from "lucide-react";

export default function Page({ username }: { username: string }) {
	const { userId: currentUserId } = useAuth();

	const { data: user, isLoading: userLoading } = useQuery({
		queryKey: ["user", username],
		queryFn: async () =>
			(await (await fetch(`/api/user?username=${username}`)).json()) as User,
	});

	const {
		data: userPosts,
		hasNextPage,
		fetchNextPage,
		isLoading: postsLoading,
	} = useInfiniteQuery({
		queryKey: ["userPosts", user?.id],
		queryFn: async ({ pageParam = 4294967295 }) =>
			await (
				await fetch(`/api/posts/userId?userId=${user?.id}&postId=${pageParam}`)
			).json(),
		getNextPageParam: (lastPage, _pages) => {
			if (lastPage?.length >= 11) {
				return lastPage[lastPage.length - 1].postId;
			}
			return undefined;
		},
		enabled: Boolean(user),
	});

	function formatFollowerCount() {
		if (user) {
			const followerCount = parseInt(user.followers);
			if (followerCount >= 1000000) {
				return `${`00${followerCount / 1000000}`.slice(-3)}M`;
			}
			if (followerCount >= 1000) {
				return `${`00${followerCount / 1000}`.slice(-3)}K`;
			}
			return `000${followerCount}`.slice(-4);
		}
	}

	return (
		<main className="max-w-2xl h-full flex flex-col w-full mx-auto px-2.5">
			<Header />
			{userLoading ? (
				<div className="w-full flex h-full items-center justify-center">
					<Spinner size="xl" />
				</div>
			) : (
				user && (
					<>
						<div
							style={{ gridTemplateColumns: "auto 1fr" }}
							className="rounded-md grid gap-x-2.5 border p-2.5 mb-2.5 shadow-sm"
						>
							<Image
								src={user.image}
								alt={`${user.name}'s profile picture`}
								width={32}
								height={32}
								className={`rounded-full ${!user.bio && "self-center"}`}
							/>
							<div className="flex flex-col">
								<div className="flex items-center gap-2.5">
									<div className={`flex-grow ${!user.bio && "self-center"}`}>
										<h2 className="font-semibold text-lg leading-tight">
											{user.name}
											{parseInt(user.followsUser) ? (
												<span className="font-normal bg-secondary text-xs py-1 px-1.5 rounded-md ml-1.5">
													follows you
												</span>
											) : null}
										</h2>
										<p className="leading-tight text-foreground/70">
											@{user.username}
										</p>
										<p className="text-sm mt-1.5 empty:mt-0">{user.bio}</p>
									</div>
									<div className="flex flex-col h-full justify-end items-center">
										<p className="font-bold mb-1.5 flex items-center text-center text-lg leading-none">
											{formatFollowerCount()}
										</p>
										{currentUserId === user.id ? (
											<>
												<Dialog>
													<DialogTrigger className="py-1 px-2.5 border w-fit h-fit rounded-md text-xs hover:bg-accent hover:border-ring transition-colors flex items-end justify-center gap-1 leading-[1.2]">
														<div className="h-4 w-4 flex items-center justify-center">
															<PencilIcon size={12} />
														</div>
														<span className="h-fit">Edit</span>
													</DialogTrigger>
													<DialogContent className="p-0 border-0 !w-[360px]">
														<EditProfile />
													</DialogContent>
												</Dialog>
											</>
										) : (
											<FollowButton
												userId={user.id}
												username={user.username}
												followed={parseInt(user.followedByUser) === 1}
											/>
										)}
									</div>
								</div>
							</div>
						</div>
						{postsLoading ? (
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
								endMessage={
									<p className="text-ring/70 text-center">No more posts</p>
								}
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
													key={
														post.postId +
														("repostCreatedAt" in post ? "repost" : "")
													}
													post={post}
												/>
											);
										});
								})}
							</InfiniteScroll>
						) : (
							<p className="text-ring/70 text-center">
								This user hasn&apos;t posted yet
							</p>
						)}
					</>
				)
			)}
		</main>
	);
}
