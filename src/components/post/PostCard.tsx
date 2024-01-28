import { Post } from "@/lib/types";
import Image from "next/image";
import React, { useEffect } from "react";
import LikeButton from "./LikeButton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useUser } from "@clerk/nextjs";
import OptionsButton from "./OptionsButton";
import { Pencil } from "lucide-react";
import Link from "@/components/Link";
dayjs.extend(relativeTime);

export default function PostCard({
	post,
	parentNanoId,
	postPage,
}: {
	post: Post;
	parentNanoId?: string;
	postPage?: boolean;
}) {
	const { user } = useUser();

	const commentOrComments =
		parseInt(post.commentCount) === 1 ? "Comment" : "Comments";

	return (
		<article
			className={`border rounded-md p-2.5 gap-1.5 flex shadow-s ${
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
					href={`/user/${post.username.toLocaleLowerCase()}`}
				>
					@{post.username}
				</Link>
				<p
					className={`mt-2.5 ${!postPage && "text-sm"} break-words w-full mb-4`}
				>
					{post.content}
				</p>
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
							<abbr title="This post has been edited">
								<Pencil size={12} className="text-foreground/50" />
							</abbr>
						)}
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
	);
}
