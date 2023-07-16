"use client";
import React from "react";
import type { Notification } from "@/lib/types";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";

export default function NotificationCard({
  notification,
}: {
  notification: Notification;
}) {
  const { push } = useRouter();

  return (
    <div
      className={`rounded-md border transition-colors dark:bg-foreground/5 hover:border-ring hover:bg-accent cursor-pointer
      p-2.5 flex gap-1.5 ${
        notification.read && "bg-ring/10 dark:bg-transparent"
      } ${notification.type == "followedUser" && "items-center"}`}
      onClick={() => {
        notification.type == "likedPost" &&
          push(`/post/${notification.nanoId}`);

        notification.type == "commentedOnPost" &&
          push(`/post/${notification.nanoId}`);

        notification.type == "followedUser" &&
          push(`/user/${notification.notifier}`);
      }}
    >
      <a className="flex-none" href={`/user/${notification.notifier}`}>
        <Image
          src={notification.notifierImage}
          alt={`${notification.notifierName}'s profile picture`}
          width={25}
          height={25}
          className="rounded-full"
        />
      </a>
      <p className="text-sm line-clamp-2">
        <a href={`/user/${notification.notifier}`} className="font-medium">
          {notification.notifierName}
        </a>{" "}
        {notification.type == "likedPost"
          ? "liked your post: "
          : notification.type == "commentedOnPost"
          ? "commented on your post: "
          : "followed you"}{" "}
        {notification.content && `"${notification.content}"`}
      </p>
    </div>
  );
}
