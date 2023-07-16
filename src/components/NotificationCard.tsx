import React from "react";
import type { Notification } from "@/lib/types";
import Image from "next/image";

export default function NotificationCard({
  notification,
}: {
  notification: Notification;
}) {
  return (
    <div
      className={`rounded-md border transition-colors ${
        notification.read && "bg-ring/10"
      } p-2.5 flex gap-1.5`}
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
