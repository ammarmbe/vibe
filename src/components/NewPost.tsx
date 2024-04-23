"use client";
import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import Input from "./Input";
import { Post } from "@/lib/types";
import { Send } from "lucide-react";
import { nanoid } from "nanoid";

export default function NewPost() {
  const queryClient = useQueryClient();
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
  const [postContent, setPostContent] = useState("");

  const [inputFocus, setInputFocus] = useState(false);

  const notificationMutation = useMutation({
    mutationFn: async (d: string) => {
      const [username, data] = JSON.parse(d);

      await fetch(
        `/api/notification/mentioned?username=${username}&postid=${data}&type=post`,
        { method: "POST" },
      );
    },
  });

  const postMutation = useMutation({
    mutationFn: async (nanoid: string) => {
      const id = await fetch("/api/post", {
        method: "POST",
        body: JSON.stringify({
          content: postContent,
          nanoid,
        }),
      });

      return {
        id: await id.json(),
      };
    },
    onMutate: (nanoid) => {
      const name: string[] = [];

      user?.firstName && name.push(user.firstName);
      user?.lastName && name.push(user.lastName);

      if (!name.length) {
        user?.emailAddresses[0].emailAddress.split("@")[0] &&
          name.push(user?.emailAddresses[0].emailAddress.split("@")[0]);
      }

      queryClient.setQueryData(
        ["homeFeed", "Home"],
        (oldData: { pages: Post[][] } | undefined) => {
          if (oldData?.pages) {
            return {
              pages: [
                [
                  {
                    postid: "0", // will be invalidated
                    nanoid: nanoid,
                    content: postContent,
                    createdat: (Date.now() / 1000).toString(),
                    parentnanoid: null,
                    name: name.join(" "),
                    username: user?.username || "",
                    image: user?.imageUrl || "",
                    userid: user?.id || "",
                    likecount: "0",
                    crycount: "0",
                    laughcount: "0",
                    heartcount: "0",
                    surprisecount: "0",
                    commentcount: "0",
                    userlikestatus: null,
                    userrepoststatus: "",
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

      setValue([]);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["homeFeed", "Home"]);
    },
    onSuccess: (data) => {
      // send a notification for all users mentioned in the post
      const mentionedUsers = value
        .filter((v) => v.mention)
        .map((v) => v.sanitized.slice(1));

      for (const username of mentionedUsers) {
        if (user?.username !== username)
          notificationMutation.mutate(JSON.stringify([username, data.id]));
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
        postMutation={postMutation}
      />
      <button
        type="button"
        aria-label="Post"
        onClick={() => {
          if (
            !value
              .map((v) => v.unsanitized)
              .join(" ")
              .trim()
          )
            return;
          setPostContent(
            value
              .map((v) => v.unsanitized)
              .join(" ")
              .trim(),
          );
          postMutation.mutate(nanoid(12));
        }}
        disabled={
          postMutation.isLoading ||
          value.map((v) => v.sanitized).join(" ").length > 512
        }
        className="order-2 border disabled:!opacity-50 rounded-sm text-sm px-2 py-1 hover:bg-accent hover:border-ring transition-colors relative top-[0px] self-start flex items-end justify-center gap-1 leading-[1.2]"
      >
        <div className="h-4 w-4 flex items-center justify-center">
          <Send size={14} />
        </div>
        <span className="h-fit">Post</span>
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
