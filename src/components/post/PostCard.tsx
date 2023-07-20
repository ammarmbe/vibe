import { Post } from "@/lib/types";
import Image from "next/image";
import React, { useState } from "react";
import LikeButton from "./LikeButton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MoreHorizontal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/ReactQueryProvider";
import { useUser } from "@clerk/nextjs";
dayjs.extend(relativeTime);

export default function PostCard({
  post,
  parentNanoId,
}: {
  post: Post;
  parentNanoId?: string;
}) {
  const { user } = useUser();
  const [border, setBorder] = useState<"delete" | "edit" | "">("");

  const commentOrComments =
    parseInt(post.comments) == 1 ? "Comment" : "Comments";

  const deleteMuatation = useMutation({
    mutationFn: async () => {
      await fetch(`/api/post?postId=${post.postId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      function updater(oldData: any) {
        if (oldData)
          return {
            pages: oldData.pages.map((page: any) => {
              return page.filter(
                (oldPost: Post) => oldPost.postId != post.postId
              );
            }),
          };
      }

      client.setQueryData(["homeFeed"], updater);
      client.setQueryData(["comments"], updater);
      parentNanoId &&
        client.setQueryData(["post", parentNanoId], (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              comments: parseInt(oldData.comments) - 1,
            };
          }
        });
    },
  });

  return (
    <article className="border rounded-md p-2.5 gap-1.5 flex shadow-sm">
      <a className="flex-none h-fit" href={`/user/${post.username}`}>
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
          <h2 className="leading-tight font-medium">
            <a href={`/user/${post.username}`}>{post.name}</a>
          </h2>
          <p className="text-sm leading-tight text-foreground/70">
            {dayjs(new Date(parseInt(post.createdAt) * 1000)).fromNow()}
          </p>
        </div>
        <a
          className="text-sm hover:underline text-foreground/70 leading-none w-fit"
          href={`/user/${post.username.toLocaleLowerCase()}`}
        >
          @{post.username}
        </a>
        <p className="mt-2.5 text-sm mb-4">{post.content}</p>
        <div className="flex justify-between w-full">
          <div className="flex gap-1.5">
            <LikeButton
              count={post.likes}
              liked={parseInt(post.likedByUser) == 0 ? false : true}
              postId={post.postId}
              userId={post.userId}
            />
            <a
              href={`/post/${post.nanoId}`}
              className="text-xs px-2.5 py-1 border rounded-md transition-colors hover:border-ring hover:bg-accent"
            >
              {post.comments} {commentOrComments}
            </a>
          </div>

          {user?.id == post.userId && (
            <Popover>
              <PopoverTrigger className="h-full border hover:border-ring hover:bg-accent rounded-sm transition-colors aspect-square flex items-center justify-center">
                <MoreHorizontal size={18} />
              </PopoverTrigger>
              <PopoverContent
                align={"end"}
                side={"top"}
                className="flex flex-col p-0 border-0 w-[100px]"
              >
                <button
                  onMouseEnter={() => {
                    setBorder("edit");
                  }}
                  onMouseLeave={() => {
                    setBorder("");
                  }}
                  className="border-b-0 text-sm text-center rounded-t-sm transition-colors hover:bg-accent hover:border-ring border p-2"
                >
                  Edit
                </button>
                <div
                  className={`border-b border-dashed transition-all ${
                    border == "delete" && `border-danger/50 !border-solid`
                  } ${border == "edit" && `border-ring !border-solid`}`}
                ></div>
                <button
                  onMouseEnter={() => setBorder("delete")}
                  onMouseLeave={() => setBorder("")}
                  onClick={() => deleteMuatation.mutate()}
                  className="text-danger hover:bg-danger/5 text-sm rounded-b-sm border-t-0 transition-colors hover:border-danger/50 border p-2"
                >
                  Delete
                </button>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </article>
  );
}
