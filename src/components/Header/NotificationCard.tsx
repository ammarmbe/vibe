"use client";
import React from "react";
import type { Notification } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "@/components/Link";
import sanitize from "sanitize-html";
import he from "he";

export default function NotificationCard({
  notification,
}: {
  notification: Notification;
}) {
  const { push } = useRouter();

  return (
    <div
      className={`rounded-md border transition-colors flex items-center ${
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

        notification.type === "followedUser"
          ? push(`/user/${notification.notifierusername}`)
          : push(`/post/${notification.nanoid}`);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (notification.deleted) {
            return;
          }

          notification.type === "followedUser"
            ? push(`/user/${notification.notifierusername}`)
            : push(`/post/${notification.nanoid}`);
        }
      }}
    >
      <Link
        className="flex-none self-start"
        href={`/user/${notification.notifierusername}`}
      >
        <Image
          src={notification.notifierimage}
          alt={`${notification.notifiername}'s profile picture`}
          width={24}
          height={24}
          className="rounded-full"
        />
      </Link>
      <p className="text-sm line-clamp-2 h-fit">
        <Link
          href={`/user/${notification.notifierusername}`}
          className="font-medium"
        >
          {notification.notifiername}
        </Link>{" "}
        {(() => {
          if (notification.type === "followedUser") {
            return "followed you";
          }

          if (notification.type.startsWith("likedPost")) {
            if (notification.type.endsWith("like")) {
              return `liked your ${
                notification.deleted ? "deleted post" : "post: "
              }`;
            }
            return `reacted ${
              notification.type.endsWith("heart")
                ? "❤️"
                : notification.type.endsWith("cry")
                  ? "😭"
                  : notification.type.endsWith("laugh")
                    ? "😂"
                    : notification.type.endsWith("surprise")
                      ? "😮"
                      : ""
            } to your ${notification.deleted ? "deleted post" : "post: "}`;
          }

          if (notification.type === "commentedOnPost") {
            return `commented on your ${
              notification.deleted ? "deleted post" : "post: "
            }`;
          }

          if (notification.type === "mentioned.comment") {
            return `mentioned you in their ${
              notification.deleted ? "deleted comment" : "comment: "
            }`;
          }

          if (notification.type.startsWith("mentioned")) {
            return `mentioned you in their ${
              notification.deleted ? "deleted post" : "post: "
            }`;
          }

          if (notification.type === "reposted") {
            return `reposted your ${
              notification.deleted ? "deleted post" : "post: "
            }`;
          }
        })()}
        {notification.content && !notification.deleted
          ? `"${he.decode(
              sanitize(notification.content, {
                allowedTags: [],
              }).replaceAll(/&nbsp;/g, " "),
            )}"`
          : null}
      </p>
    </div>
  );
}
