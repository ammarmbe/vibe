"use client";
import { Post, Repost } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
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
	const { user } = useUser();

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
			onMutate: (userRepostStatus) => {
				function updater(data: { pages: (Post | Repost)[][] } | undefined) {
					if (data)
						return {
							pages: data.pages.map((page, index) => {
								let array = [
									...page.map((p) => {
										if (p.postId === post.postId) {
											return {
												...p,
												userRepostStatus: userRepostStatus ? "0" : "1",
											};
										}
										return p;
									}),
								] as (Post | Repost)[];

								const name: string[] = [];

								user?.firstName && name.push(user.firstName);
								user?.lastName && name.push(user.lastName);

								if (!name.length) {
									user?.emailAddresses[0].emailAddress.split("@")[0] &&
										name.push(
											user?.emailAddresses[0].emailAddress.split("@")[0],
										);
								}

								if (userRepostStatus) {
									console.log("removing");
									array = array.filter(
										(p) =>
											!(
												p.postId === post.postId &&
												"reposterUsername" in p &&
												p.reposterUsername === user?.username
											),
									);
								} else if (index === 0 && user) {
									array.unshift({
										...post,
										reposterName: name.join(" "),
										repostCreatedAt: (Date.now() / 1000).toString(),
										reposterUsername: user.username,
									} as Repost);

									return array as (Post | Repost)[];
								}

								return array as (Post | Repost)[];
							}),
						};
				}

				queryClient.setQueryData(["homeFeed", "Home"], updater);
				queryClient.setQueryData(["userPosts", user?.id], updater);
			},
			onSuccess: () => {
				notificationMutation.mutate();
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
					onClick={() =>
						repostMutation.mutate(
							parseInt(
								"reposterName" in post &&
									post.reposterUsername === user?.username
									? "1"
									: post.userRepostStatus,
							),
						)
					}
				>
					<div className="h-5 w-5 flex items-center justify-center">
						<Repeat2 size={16} />
					</div>
					<span className="h-fit">
						{parseInt(
							"reposterName" in post && post.reposterUsername === user?.username
								? "1"
								: post.userRepostStatus,
						)
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
	);
}
