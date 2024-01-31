"use client";
import { useUser } from "@clerk/nextjs";
import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { Post } from "@/lib/types";
import Input from "./Input";

export default function NewComment({
	parentNanoId,
	nanoId,
	userId,
	parentPostId,
	parentPostUsername,
}: {
	parentNanoId: string;
	nanoId: string;
	userId: string;
	parentPostId: string;
	parentPostUsername: string;
}) {
	const client = useQueryClient();
	const { user } = useUser();

	const inputRef = useRef<HTMLElement>(null);
	const [value, setValue] = useState<
		{
			sanitized: string;
			unsanitized: string;
			mention: boolean;
			selected: boolean;
		}[]
	>([]);

	const [inputFocus, setInputFocus] = useState(false);

	const notificationMutation = useMutation({
		mutationFn: async () =>
			await fetch(
				`/api/notification/commentedOnPost?postId=${parentPostId}&userId=${user?.id}`,
				{ method: "POST" },
			),
		onSuccess: () => {
			client.invalidateQueries(["notifications", userId]);
		},
	});

	const notificationMutation2 = useMutation({
		mutationFn: async (d: string) => {
			const [username, data] = JSON.parse(d);

			await fetch(
				`/api/notification/mentioned?username=${username}&postId=${data}&userId=${user?.id}&type=comment`,
				{ method: "POST" },
			);
		},
		onSuccess: () => {
			client.invalidateQueries({
				predicate: (query) => query.queryKey[0] === "notifications",
			});
		},
	});

	const commentMutation = useMutation({
		mutationFn: async () => {
			const nanoId = nanoid(12);

			const id = await fetch("/api/post", {
				method: "POST",
				body: JSON.stringify({
					content: value.map((v) => v.unsanitized).join("&nbsp;"),
					nanoId,
					parentNanoId,
				}),
			});

			return id.json();
		},
		onSuccess: (data) => {
			if (userId !== user?.id) notificationMutation.mutate();

			client.invalidateQueries(["comments"]);
			client.setQueryData(["post", nanoId], (data?: Post) => {
				if (data) {
					return {
						...data,
						comments: String(parseInt(data.commentCount) + 1),
					};
				}
			});

			// send a notification for all users mentioned in the post
			const mentionedUsers = value
				.filter((v) => v.mention)
				.map((v) => v.sanitized.slice(1));

			for (const username of mentionedUsers) {
				if (
					parentPostUsername !== username &&
					user?.unsafeMetadata.username !== username
				)
					notificationMutation2.mutate(JSON.stringify([username, data]));
			}

			setValue([]);
		},
	});

	return (
		<form
			className={`grid grid-cols-[1fr,auto] grid-rows-[auto,auto,1fr] gap-x-2 mb-2.5 hover:shadow-none items-center transition-colors shadow-sm rounded-md px-2 py-1 pr-1 border ${
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
				type="button"
				onClick={() => {
					commentMutation.mutate();
				}}
				disabled={
					commentMutation.isLoading ||
					value.map((v) => v.sanitized).join(" ").length > 512
				}
				className="order-2 border disabled:!opacity-50 rounded-sm text-sm px-1.5 py-0.5 hover:bg-accent hover:border-ring transition-colors relative top-[0px] self-start"
			>
				Reply
			</button>
			<p
				className={`order-3 transition-colors text-xs text-right p-1 w-[43px] ${(() => {
					if (value.map((v) => v.sanitized).join(" ").length < 412)
						return "hidden";
					if (value.map((v) => v.sanitized).join(" ").length < 481)
						return "text-foreground/60";
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
