import { Post, Repost } from "@/lib/types";
import Image from "next/image";
import React from "react";
import LikeButton from "./LikeButton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useUser } from "@clerk/nextjs";
import OptionsButton from "./OptionsButton";
import { Pencil, Repeat2 } from "lucide-react";
import Link from "@/components/Link";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
dayjs.extend(relativeTime);

export default function PostCard({
	post,
	parentNanoId,
	postPage,
}: {
	post: Post | Repost;
	parentNanoId?: string;
	postPage?: boolean;
}) {
	const { user } = useUser();
	const queryClient = useQueryClient();

	const commentOrComments =
		parseInt(post.commentCount) === 1 ? "Comment" : "Comments";

	const repostMutation = useMutation(
		async (userRepostStatus: number) => {
			await fetch(
				`/api/repost?postId=${post.postId}&userRepostStatus=${userRepostStatus}`,
				{
					method: "POST",
				},
			);
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["homeFeed"]);
				queryClient.invalidateQueries(["user", user?.id]);
			},
		},
	);

	return (
		<div>
			{"reposterName" in post ? (
				<div className="bg-border rounded-t-md p-1 px-2 text-xs -mb-2 pb-[calc(0.75rem-1px)]">
					<p className="text-foreground/70">
						<Link href={`/user/${post.username}`} className="font-semibold">
							{post.name}
						</Link>{" "}
						reposted this
					</p>
				</div>
			) : null}
			<article
				className={`border rounded-md bg-background p-2.5 gap-1.5 flex shadow-sm z-10 relative ${
					postPage && parentNanoId
						? "mb-2.5 rounded-t-none border-t-0"
						: postPage && "mb-2.5"
				}`}
			>
				<Link className="flex-none h-fit" href={`/user/${post.username}`}>
					<Image
						src={post.image}
						width={33}
						height={33}
						className="rounded-full"
						alt={`${post.name}'s profile picture}`}
					/>
				</Link>
				<div className="flex flex-col flex-grow w-[calc(100%-39px)]">
					<div className="flex justify-between items-baseline w-full">
						<h2
							className={`leading-tight font-medium ${
								postPage && "text-lg truncate inline-block"
							}`}
						>
							<Link href={`/user/${post.username}`}>{post.name}</Link>
						</h2>
						<time
							dateTime={dayjs(new Date(parseInt(post.createdAt) * 1000)).format(
								"YYYY-MM-DD HH:MM",
							)}
							className="text-sm leading-tight text-foreground/70"
						>
							{dayjs(new Date(parseInt(post.createdAt) * 1000)).fromNow()}
						</time>
					</div>
					<Link
						className={`${
							!postPage && "text-sm"
						} hover:underline text-foreground/70 leading-tight w-fit`}
						href={`/user/${post.username?.toLocaleLowerCase()}`}
					>
						@{post.username}
					</Link>
					<p
						className={`mt-2.5 ${
							!postPage && "text-sm"
						} break-words w-full mb-4`}
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>

					<div className="flex justify-between w-full">
						<div className="flex gap-1.5 items-center">
							<LikeButton
								likeCount={parseInt(post.likeCount)}
								cryCount={parseInt(post.cryCount)}
								heartCount={parseInt(post.heartCount)}
								laughCount={parseInt(post.laughCount)}
								surpriseCount={parseInt(post.surpriseCount)}
								userLikeStatus={post.userLikeStatus}
								postId={post.postId}
								userId={post.userId}
								nanoId={post.nanoId}
							/>
							<Link
								href={`/post/${post.nanoId}`}
								className="text-xs px-2.5 py-1 border rounded-md transition-colors hover:border-ring hover:bg-accent h-full flex items-center order-2"
							>
								{post.commentCount} {commentOrComments}
							</Link>
						</div>

						<div
							className={`flex gap-1.5 ${
								user?.id === post.userId ? "items-center" : "items-end"
							} justify-end`}
						>
							{parseInt(post.edited) === 1 && (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger className="px-0.5 cursor-auto">
											<Pencil size={14} className="text-[#666666]" />
										</TooltipTrigger>
										<TooltipContent className="text-xs px-2">
											<p>This post has been edited</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
							<Popover>
								<PopoverTrigger className="h-full border hover:border-ring hover:bg-accent rounded-sm transition-colors aspect-square flex items-center justify-center">
									<Repeat2 size={16} />
								</PopoverTrigger>
								<PopoverContent
									align="end"
									side="top"
									className="flex flex-col shadow-sm p-0 border-0 w-[100px] group"
								>
									<PopoverClose
										className="border-b-0 text-sm text-center rounded-t-sm transition-colors hover:bg-accent hover:border-ring border p-2 disabeld:cursor-not-allowed disabled:text-foreground/50 disabled:hover:bg-accent/10"
										onClick={() =>
											repostMutation.mutate(parseInt(post.userRepostStatus))
										}
									>
										{parseInt(post.userRepostStatus) ? "Unrepost" : "Repost"}
									</PopoverClose>
									<div className="border-b border-dashed transition-all group-hover:border-ring group-hover:border-solid" />
									<PopoverClose
										onClick={() => {
											if (navigator.share)
												navigator.share({
													title: "Share this post",
													url: `https://vibe.ambe.dev/post/${post.nanoId}`,
												});
										}}
										className="border-t-0 text-sm text-center rounded-b-sm transition-colors hover:bg-accent hover:border-ring border p-2 disabeld:cursor-not-allowed disabled:text-foreground/50 disabled:hover:bg-accent/10"
									>
										Share
									</PopoverClose>
								</PopoverContent>
							</Popover>
							{user?.id === post.userId && (
								<OptionsButton
									post={post}
									postPage={postPage}
									parentNanoId={parentNanoId}
								/>
							)}
						</div>
					</div>
				</div>
			</article>
		</div>
	);
}
