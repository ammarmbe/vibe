"use client";
import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useUser } from "@clerk/nextjs";
import Input from "./Input";

export function updateInputSize(input: HTMLElement | null) {
	if (input == null) return;
	input.style.height = "0px";
	input.style.height = `${input.scrollHeight}px`;
}

export default function NewPost() {
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
		mutationFn: async (d: string) => {
			const [username, data] = JSON.parse(d);

			await fetch(
				`/api/notification/mentioned?username=${username}&postId=${data}&userId=${user?.id}&type=post`,
				{ method: "POST" },
			);
		},
		onSuccess: () => {
			client.invalidateQueries({
				predicate: (query) => query.queryKey[0] === "notifications",
			});
		},
	});

	const postMutation = useMutation({
		mutationFn: async () => {
			const nanoId = nanoid(12);

			const id = await fetch("/api/post", {
				method: "POST",
				body: JSON.stringify({
					content: value.map((v) => v.unsanitized).join("&nbsp;"),
					nanoId,
				}),
			});

			return id.json();
		},
		onSuccess: (data) => {
			setValue([]);
			updateInputSize(inputRef.current);

			client.invalidateQueries(["posts"]);
			client.invalidateQueries(["homeFeed"]);
			client.invalidateQueries(["userPosts", user?.id]);

			// send a notification for all users mentioned in the post
			const mentionedUsers = value
				.filter((v) => v.mention)
				.map((v) => v.sanitized.slice(1));

			for (const username of mentionedUsers) {
				if (user?.unsafeMetadata.username !== username)
					notificationMutation.mutate(JSON.stringify([username, data]));
			}
		},
	});

	return (
		<form
			className={`grid grid-cols-[1fr,auto] grid-rows-[auto,auto,1fr] mb-2.5 hover:shadow-none items-center transition-colors shadow-sm rounded-md px-2 py-1 pr-1 border ${
				inputFocus ? "dark:border-foreground/25 border-ring" : null
			}`}
		>
			<Input
				value={value}
				setValue={setValue}
				inputRef={inputRef}
				setInputFocus={setInputFocus}
				postMutation={postMutation}
			/>
			<button
				type="button"
				onClick={() => {
					postMutation.mutate();
				}}
				disabled={
					postMutation.isLoading ||
					value.map((v) => v.sanitized).join(" ").length > 512
				}
				className="order-2 border disabled:cursor-wait disabled:!opacity-50 rounded-sm text-sm px-1.5 py-0.5 hover:bg-accent hover:border-ring transition-colors relative top-[0px] self-start"
			>
				Post
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
