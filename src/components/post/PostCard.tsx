import { Post, Repost } from "@/lib/types";
import Image from "next/image";
import React from "react";
import LikeButton from "./LikeButton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useUser } from "@clerk/nextjs";
import OptionsButton from "./OptionsButton";
import { MessageCircle, Pencil, Repeat2, Share } from "lucide-react";
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
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../ui/hover-card";
import UserCard from "./UserCard";
import { HoverCardPortal } from "@radix-ui/react-hover-card";
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

	const notificationMutation = useMutation(
		async () => {
			await fetch(
				`/api/notification/reposted?postId=${post.postId}&userId=${post.userId}`,
				{
					method: "POST",
				},
			);
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["notifications", post.userId]);
			},
		},
	);

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
				notificationMutation.mutate();

				queryClient.invalidateQueries(["homeFeed"]);
				queryClient.invalidateQueries(["userPosts", user?.id]);
			},
		},
	);

	return (
		<div>
			{"reposterName" in post ? (
				<div className="bg-border rounded-t-md p-1 px-2 text-xs -mb-2 pb-[calc(0.75rem-1px)] flex items-center gap-1">
					<Repeat2 size={14} strokeWidth={2} className="text-[#ababab]" />
					<p className="text-[#ababab]">
						<Link
							href={`/user/${post.reposterUsername}`}
							className="font-semibold"
						>
							{post.reposterName}
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
						width={32}
						height={32}
						className="rounded-full"
						alt={`${post.name}'s profile picture}`}
					/>
				</Link>
				<HoverCard>
					<div className="flex flex-col flex-grow w-[calc(100%-39px)]">
						<div className="flex justify-between items-baseline w-full">
							<HoverCardTrigger className="p-0 m-0 w-fit h-fit leading-tight">
								<h2
									className={`leading-tight font-medium ${
										postPage && "text-lg truncate inline-block"
									}`}
								>
									<Link href={`/user/${post.username}`}>{post.name}</Link>
								</h2>
							</HoverCardTrigger>
							<time
								dateTime={dayjs(
									new Date(parseInt(post.createdAt) * 1000),
								).format("YYYY-MM-DD HH:MM")}
								className="text-sm leading-tight text-foreground/70"
							>
								{dayjs(new Date(parseInt(post.createdAt) * 1000)).fromNow()}
							</time>
						</div>
						<HoverCardTrigger
							className={`${
								!postPage && "text-sm"
							} p-0 m-0 w-fit h-fit leading-tight`}
						>
							<Link
								className={`${
									!postPage && "text-sm"
								} hover:underline text-foreground/70 w-fit`}
								href={`/user/${post.username?.toLocaleLowerCase()}`}
							>
								@{post.username}
							</Link>
						</HoverCardTrigger>
						<HoverCardPortal container={document.body}>
							<HoverCardContent className="p-2.5 h-fit w-fit z-20 relative">
								<svg
									width="9"
									height="4"
									viewBox="0 0 9 4"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="absolute top-[-4px] left-[50%] transform translate-x-[-50%]"
								>
									<title>arrow</title>
									<path
										d="M4.49999 0L9 4H0L4.49999 0Z"
										className="fill-border"
									/>
									<path
										d="M4.49996 1.32813L7.50001 4H1.50001L4.49996 1.32813Z"
										className="fill-popover"
									/>
								</svg>
								<UserCard username={post.username} />
							</HoverCardContent>
						</HoverCardPortal>
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
									className="text-xs px-2 py-1 border rounded-md transition-colors hover:border-ring hover:bg-accent h-full items-end flex gap-1 justify-center order-2 leading-[1.3]"
								>
									<div className="h-4 w-4 flex items-center justify-center -translate-y-[0.5px]">
										<MessageCircle size={14} />
									</div>
									<span className="h-fit">
										{post.commentCount} {commentOrComments}
									</span>
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
									<PopoverTrigger
										name="Share"
										className="h-full border hover:border-ring hover:bg-accent rounded-sm transition-colors aspect-square flex items-center justify-center"
									>
										<Repeat2 size={16} />
									</PopoverTrigger>
									<PopoverContent
										align="end"
										side="top"
										className="flex flex-col shadow-sm p-0 border-0 w-[100px] group"
									>
										<PopoverClose
											className="border-b-0 text-sm rounded-t-sm transition-colors hover:bg-accent hover:border-ring border p-2 disabeld:cursor-not-allowed disabled:text-foreground/50 disabled:hover:bg-accent/10 flex items-end justify-center gap-1.5 leading-[1.3]"
											onClick={() =>
												repostMutation.mutate(parseInt(post.userRepostStatus))
											}
										>
											<div className="h-5 w-5 flex items-center justify-center">
												<Repeat2 size={16} />
											</div>
											<span className="h-fit">
												{parseInt(post.userRepostStatus)
													? "Unrepost"
													: "Repost"}
											</span>
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
											className="border-t-0 text-sm text-center rounded-b-sm transition-colors hover:bg-accent hover:border-ring border p-2 disabeld:cursor-not-allowed disabled:text-foreground/50 disabled:hover:bg-accent/10 flex justify-center gap-1.5 items-end leading-[1.3]"
										>
											<div className="h-5 w-5 flex items-center justify-center">
												<Share size={16} />
											</div>
											<span className="h-fit">Share</span>
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
				</HoverCard>
			</article>
		</div>
	);
}
