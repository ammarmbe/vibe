"use client";
import React from "react";
import type { Notification } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "@/components/Link";

export default function NotificationCard({
	notification,
}: {
	notification: Notification;
}) {
	const { push } = useRouter();

	return (
		<div
			className={`rounded-md border transition-colors ${
				!notification.deleted &&
				"hover:border-ring hover:bg-accent cursor-pointer"
			} dark:bg-foreground/5
      p-2.5 flex gap-1.5 ${
				notification.read && "bg-ring/10 dark:bg-transparent"
			} ${notification.type === "followedUser" && "items-center"}`}
			onClick={() => {
				if (notification.deleted) {
					return;
				}

				notification.type.startsWith("likedPost") &&
					push(`/post/${notification.nanoId}`);

				notification.type === "commentedOnPost" &&
					push(`/post/${notification.nanoId}`);

				notification.type === "followedUser" &&
					push(`/user/${notification.notifierUsername}`);
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					if (notification.deleted) {
						return;
					}

					notification.type.startsWith("likedPost") &&
						push(`/post/${notification.nanoId}`);

					notification.type === "commentedOnPost" &&
						push(`/post/${notification.nanoId}`);

					notification.type === "followedUser" &&
						push(`/user/${notification.notifierUsername}`);
				}
			}}
		>
			<Link
				className="flex-none"
				href={`/user/${notification.notifierUsername}`}
			>
				<Image
					src={notification.notifierImage}
					alt={`${notification.notifierName}'s profile picture`}
					width={25}
					height={25}
					className="rounded-full"
				/>
			</Link>
			<p className="text-sm line-clamp-2">
				<Link
					href={`/user/${notification.notifierUsername}`}
					className="font-medium"
				>
					{notification.notifierName}
				</Link>{" "}
				{notification.type === "likedPost.like"
					? notification.deleted
						? "liked your deleted post"
						: "liked your post: "
					: notification.type.startsWith("likedPost")
					  ? `reacted ${
								notification.type.endsWith("heart")
									? "❤️"
									: notification.type.endsWith("cry")
									  ? "😭"
									  : notification.type.endsWith("laugh")
										  ? "😂"
										  : notification.type.endsWith("surprise") && "'😮"
						  } to your ${notification.deleted ? "deleted post" : "post: "}`
					  : notification.type === "commentedOnPost"
						  ? notification.deleted
								? "commented on your deleted post"
								: "commented on your post: "
						  : "followed you"}{" "}
				{notification.content &&
					!notification.deleted &&
					`"${notification.content}"`}
			</p>
		</div>
	);
}
