"use client";
import { Post, Repost } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Repeat2, Share } from "lucide-react";

export default function ShareButton({ post }: { post: Post | Repost }) {
	const queryClient = useQueryClient();
	const { userId } = useAuth();

	const notificationMutation = useMutation(async () => {
		await fetch(
			`/api/notification/reposted?postId=${post.postId}&userId=${post.userId}`,
			{
				method: "POST",
			},
		);
	});

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

				queryClient.invalidateQueries({
					predicate: (query) => query.queryKey[0] === "homeFeed",
				});
				queryClient.invalidateQueries(["userPosts", userId]);
			},
		},
	);

	return (
		<Popover>
			<PopoverTrigger
				aria-label="Share"
				className="border hover:border-ring p-1 h-fit hover:bg-accent rounded-sm transition-colors flex items-center justify-center"
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
					onClick={() => repostMutation.mutate(parseInt(post.userRepostStatus))}
				>
					<div className="h-5 w-5 flex items-center justify-center">
						<Repeat2 size={16} />
					</div>
					<span className="h-fit">
						{parseInt(post.userRepostStatus) ? "Unrepost" : "Repost"}
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
	);
}
