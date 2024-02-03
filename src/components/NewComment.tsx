"use client";
import { useUser } from "@clerk/nextjs";
import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import Input from "./Input";
import { Send } from "lucide-react";
import { Post } from "@/lib/types";

export default function NewComment({
	parentNanoId,
	userId,
	parentPostId,
	parentPostUsername,
}: {
	parentNanoId: string;
	userId: string;
	parentPostId: string;
	parentPostUsername: string;
}) {
	const { user } = useUser();
	const queryClient = useQueryClient();

	const inputRef = useRef<HTMLElement>(null);
	const [value, setValue] = useState<
		{
			sanitized: string;
			unsanitized: string;
			mention: boolean;
			selected: boolean;
		}[]
	>([]);
	const [commentContent, setCommentContent] = useState("");

	const [inputFocus, setInputFocus] = useState(false);

	const commentNotificationMutation = useMutation({
		mutationFn: async () =>
			await fetch(`/api/notification/commentedOnPost?postId=${parentPostId}`, {
				method: "POST",
			}),
	});

	const mentionNotificationMutation = useMutation({
		mutationFn: async (d: string) => {
			const [username, data] = JSON.parse(d);

			await fetch(
				`/api/notification/mentioned?username=${username}&postId=${data}&userId=${userId}&type=comment`,
				{ method: "POST" },
			);
		},
	});

	const commentMutation = useMutation({
		mutationFn: async (nanoId: string) => {
			const id = await fetch("/api/post", {
				method: "POST",
				body: JSON.stringify({
					content: commentContent,
					nanoId,
					parentNanoId,
				}),
			});

			return id.json();
		},
		onMutate: (nanoId) => {
			setValue([]);

			queryClient.setQueryData(
				["postPage", parentNanoId],
				(old: Post | undefined) => {
					if (old) {
						return {
							...old,
							commentCount: (parseInt(old.commentCount) + 1).toString(),
						};
					}
				},
			);

			const name: string[] = [];

			user?.firstName && name.push(user.firstName);
			user?.lastName && name.push(user.lastName);

			if (!name.length) {
				user?.emailAddresses[0].emailAddress.split("@")[0] &&
					name.push(user?.emailAddresses[0].emailAddress.split("@")[0]);
			}

			queryClient.setQueryData(
				["comments", parentNanoId],
				(oldData: { pages: Post[][] } | undefined) => {
					if (oldData) {
						return {
							pages: [
								[
									{
										postId: "0", // will be invalidated
										nanoId: nanoId,
										content: commentContent,
										createdAt: (Date.now() / 1000).toString(),
										parentNanoId: null,
										name: name.join(" "),
										username: user?.username || "",
										image: user?.imageUrl || "",
										userId: user?.id || "",
										likeCount: "0",
										cryCount: "0",
										laughCount: "0",
										heartCount: "0",
										surpriseCount: "0",
										commentCount: "0",
										userLikeStatus: null,
										userRepostStatus: "",
										deleted: "0",
										edited: "0",
									},
									...oldData.pages[0],
								],
								...oldData.pages.slice(1),
							],
						};
					}
					return oldData;
				},
			);
		},
		onSettled: () => {
			queryClient.invalidateQueries(["comments", parentNanoId]);
		},
		onSuccess: (data) => {
			if (userId !== user?.id) commentNotificationMutation.mutate();

			// send a notification for all users mentioned in the post
			const mentionedUsers = value
				.filter((v) => v.mention)
				.map((v) => v.sanitized.slice(1));

			for (const username of mentionedUsers) {
				if (parentPostUsername !== username && user?.username !== username)
					mentionNotificationMutation.mutate(JSON.stringify([username, data]));
			}
		},
	});

	return (
		<form
			className={`grid grid-cols-[1fr,auto] grid-rows-[auto,auto,1fr] gap-x-2 mb-2.5 hover:shadow-none items-center transition-colors shadow-sm rounded-md px-2 py-2 pl-2.5 border ${
				inputFocus ? "dark:border-foreground/25 border-ring" : null
			}`}
		>
			<Input
				value={value}
				setValue={setValue}
				inputRef={inputRef}
				setInputFocus={setInputFocus}
				postMutation={commentMutation}
			/>
			<button
				aria-label="Reply"
				type="button"
				onClick={() => {
					if (
						!value
							.map((v) => v.sanitized)
							.join(" ")
							.trim()
					)
						return;
					setCommentContent(
						value
							.map((v) => v.sanitized)
							.join(" ")
							.trim(),
					);
					commentMutation.mutate(nanoid(12));
				}}
				disabled={
					commentMutation.isLoading ||
					value.map((v) => v.sanitized).join(" ").length > 512
				}
				className="order-2 border disabled:!opacity-50 rounded-sm text-sm px-2 py-1 hover:bg-accent hover:border-ring transition-colors relative top-[0px] self-start flex items-end justify-center gap-1 leading-[1.2]"
			>
				<div className="h-4 w-4 flex items-center justify-center">
					<Send size={14} />
				</div>
				<span className="h-fit">Reply</span>
			</button>
			<p
				className={`order-3 transition-colors text-xs text-right p-1 w-[43px] ${(() => {
					if (value.map((v) => v.sanitized).join(" ").length < 412)
						return "hidden";
					if (value.map((v) => v.sanitized).join(" ").length < 481)
						return "text-muted-foreground";
					if (value.map((v) => v.sanitized).join(" ").length < 512)
						return "text-yellow-500/90";
					return "text-danger";
				})()}`}
			>
				{512 - value.map((v) => v.sanitized).join(" ").length}
			</p>
		</form>
	);
}
