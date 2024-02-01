"use client";
import { Post } from "@/lib/types";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import NewComment from "./NewComment";
import Spinner from "./Spinner";
import Header from "./header/Header";
import PostCard from "./post/PostCard";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function Page({ nanoId }: { nanoId: string }) {
	const { data: mainPost } = useQuery({
		queryKey: ["post", nanoId],
		queryFn: async () =>
			(await (await fetch(`/api/post?nanoId=${nanoId}`)).json()) as Post,
	});

	const { push } = useRouter();

	const { data: parentPost, isLoading } = useQuery({
		queryKey: ["post", mainPost?.parentNanoId],
		queryFn: async () =>
			(await (
				await fetch(`/api/post?nanoId=${mainPost?.parentNanoId}`)
			).json()) as Post,
		enabled: Boolean(mainPost?.parentNanoId),
	});

	const {
		data: comments,
		fetchNextPage,
		hasNextPage,
		isLoading: commentsLoading,
	} = useInfiniteQuery({
		queryKey: ["comments"],
		queryFn: async ({ pageParam = 4294967295 }) =>
			await (
				await fetch(
					`/api/posts/parentNanoId?postId=${pageParam}&parentNanoId=${mainPost?.nanoId}`,
				)
			).json(),
		getNextPageParam: (lastPage, _pages) => {
			if (lastPage?.length >= 11) {
				return lastPage[lastPage.length - 1].postId;
			}
			return undefined;
		},
		enabled: Boolean(mainPost),
	});

	const parentLoading = isLoading && mainPost?.parentNanoId;

	return (
		<main className="max-w-2xl h-full flex flex-col w-full mx-auto px-2.5">
			<Header />
			{parentLoading ? (
				<div className="w-full h-full justify-center items-center flex">
					<Spinner size="xl" />
				</div>
			) : (
				<>
					{parentPost?.deleted && !mainPost?.deleted ? (
						<div
							className={
								"border rounded-t-md p-2.5 text-center text-foreground/30"
							}
						>
							This post has been deleted
						</div>
					) : parentPost?.deleted && mainPost?.deleted ? (
						<></>
					) : (
						parentPost && (
							<>
								<button
									type="button"
									name="View parent post"
									onClick={() => push(`/post/${parentPost.nanoId}`)}
									className="border peer text-left hover:border-ring w-full transition-colors cursor-pointer hover:bg-accent border-b-0 rounded-t-md p-2.5 gap-1.5 flex"
								>
									<Link
										className="flex-none h-fit"
										href={`/user/${parentPost.username}`}
									>
										<Image
											src={parentPost.image}
											width={32}
											height={32}
											className="rounded-full"
											alt={`${parentPost.name}'s profile picture}`}
										/>
									</Link>
									<div className="flex flex-col flex-grow">
										<div className="flex justify-between items-baseline w-full">
											<h2 className="leading-tight font-medium">
												<Link href={`/user/${parentPost.username}`}>
													{parentPost.name}
												</Link>
											</h2>
											<time
												dateTime={dayjs(
													new Date(parseInt(parentPost.createdAt) * 1000),
												).format("YYYY-MM-DD HH:MM")}
												className="text-sm leading-tight text-foreground/70"
											>
												{dayjs(
													new Date(parseInt(parentPost.createdAt) * 1000),
												).fromNow()}
											</time>
										</div>
										<Link
											className="text-sm hover:underline text-foreground/70 leading-tight w-fit"
											href={`/user/${parentPost.username}`}
										>
											@{parentPost.username}
										</Link>
										<p
											className="mt-2.5 text-sm"
											dangerouslySetInnerHTML={{ __html: parentPost.content }}
										/>
									</div>
								</button>
								<div className="border-t w-full border-dashed peer-hover:border-solid peer-hover:border-ring transition-colors" />
							</>
						)
					)}

					{!mainPost ? (
						<div className="w-full h-full items-center justify-center flex">
							<Spinner size="xl" />
						</div>
					) : (
						<>
							{mainPost.deleted ? (
								<div
									className={`${
										parentPost && !parentPost.deleted
											? "rounded-b-md border-t-0"
											: "rounded-md"
									} border p-2.5 text-center text-lg text-foreground/30 mb-2.5`}
								>
									This post has been deleted
								</div>
							) : (
								<>
									<PostCard
										post={mainPost}
										parentNanoId={parentPost?.nanoId}
										postPage={true}
									/>
									<NewComment
										parentNanoId={mainPost.nanoId}
										nanoId={mainPost.nanoId}
										userId={mainPost.userId}
										parentPostId={mainPost.postId}
										parentPostUsername={mainPost.username}
									/>
								</>
							)}
							{commentsLoading ? (
								<div className="w-full flex items-center justify-center">
									<Spinner size="xl" />
								</div>
							) : comments && comments.pages[0].length > 0 ? (
								<InfiniteScroll
									dataLength={comments.pages.flatMap((page) => page).length}
									hasMore={hasNextPage || false}
									loader={
										<div className="w-full flex items-center justify-center">
											<Spinner size="xl" />
										</div>
									}
									endMessage={
										<p className="text-foreground/30 text-center">
											No more replies
										</p>
									}
									next={fetchNextPage}
									className="flex flex-col gap-2.5 pb-2.5"
								>
									{comments.pages.map((page) => {
										return page.map((post: Post) => {
											return (
												<PostCard
													key={post.postId}
													post={post}
													parentNanoId={mainPost.nanoId}
												/>
											);
										});
									})}
								</InfiniteScroll>
							) : (
								!mainPost.deleted && (
									<p className="text-foreground/30 text-center">
										No replies yet...
									</p>
								)
							)}
						</>
					)}
				</>
			)}
		</main>
	);
}
