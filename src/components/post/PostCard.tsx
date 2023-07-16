import { Post } from "@/lib/types";
import Image from "next/image";
import React from "react";
import LikeButton from "./LikeButton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function PostCard({ post }: { post: Post }) {
  const commentOrComments =
    parseInt(post.comments) == 1 ? "Comment" : "Comments";

  return (
    <article className="border rounded-md p-2.5 gap-1.5 flex shadow-sm">
      <a className="flex-none" href={`/user/${post.userId}`}>
        <Image
          src={post.image}
          width={33}
          height={33}
          className="rounded-full"
          alt={`${post.name}'s profile picture}`}
        />
      </a>
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-baseline w-full">
          <h2 className="leading-none font-medium">
            <a href={`/user/${post.userId}`}>{post.name}</a>
          </h2>
          <p className="text-sm leading-none text-black/70">
            {dayjs(new Date(parseInt(post.createdAt) * 1000)).fromNow()}
          </p>
        </div>
        <a
          className="text-sm hover:underline text-black/70 leading-none w-fit"
          href={`/user/${post.userId}`}
        >
          @{post.username}
        </a>
        <p className="mt-2.5 text-sm mb-4">{post.content}</p>
        <div className="flex gap-1.5">
          <LikeButton
            count={post.likes}
            liked={parseInt(post.likedByUser) == 0 ? false : true}
            postId={post.postId}
            userId={post.userId}
            content={post.content}
          />
          <a
            href={`/post/${post.nanoId}`}
            className="text-xs px-2.5 py-1 border rounded-md hover:border-ring hover:bg-accent"
          >
            {post.comments} {commentOrComments}
          </a>
        </div>
      </div>
    </article>
  );
}
