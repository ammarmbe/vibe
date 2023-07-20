"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { client } from "@/lib/ReactQueryProvider";
import { Post } from "@/lib/types";

export default function NewComment({
  parentId,
  nanoId,
  userId,
}: {
  parentId: string;
  nanoId: string;
  userId: string;
}) {
  const { userId: currentUserId, isSignedIn } = useAuth();
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const [inputValue, setInputValue] = useState("");

  const notificationMutation = useMutation({
    mutationFn: async () =>
      await fetch(
        `/api/notification/commentedOnPost?postId=${parentId}&userId=${currentUserId}`,
        { method: "POST" }
      ),
    onSuccess: () => {
      client.invalidateQueries(["notifications", userId]);
    },
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      const nanoId = nanoid(12);

      await fetch(
        `/api/post?content=${inputValue}&nanoId=${nanoId}&parentId=${parentId}`,
        { method: "POST" }
      );
    },
    onSuccess: () => {
      if (userId != currentUserId) notificationMutation.mutate();

      client.invalidateQueries(["comments"]);
      client.setQueryData(["post", nanoId], (data?: Post) => {
        if (data) {
          return {
            ...data,
            comments: String(parseInt(data.comments) + 1),
          };
        }
      });

      setInputValue("");
    },
  });

  // Textarea code
  function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if (textArea == null) return;
    textArea.style.height = "0";
    textArea.style.height = `${textArea.scrollHeight + 2}px`;
  }

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  if (!!currentUserId) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (inputValue == "") return;
          commentMutation.mutate();
        }}
        className="relative flex mb-2.5"
      >
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          name="content"
          className="outline-none bg-transparent h-[38px] resize-none overflow-hidden w-full border focus:shadow-none transition-colors shadow-sm rounded-md px-2.5 py-1.5 pr-[55px] focus:border-ring dark:focus:border-foreground/25"
          placeholder="Add a comment"
        ></textarea>
        <p
          className={`absolute transition-colors text-xs text-foreground/60 right-[6px] text-right px-1.5 w-[43px] top-[40px] ${
            inputValue.length < 412 && `hidden`
          } ${
            inputValue.length > 481 &&
            inputValue.length < 513 &&
            `!text-yellow-500/90`
          } ${inputValue.length > 512 && `!text-danger`}`}
        >
          {512 - inputValue.length}
        </p>
        <button
          disabled={commentMutation.isLoading}
          className="border disabled:cursor-wait disabled:!opacity-50 rounded-sm text-sm px-1.5 py-0.5 hover:bg-accent hover:border-ring transition-colors absolute top-[6px] right-[6px]"
        >
          Reply
        </button>
      </form>
    );
  } else {
    return null;
  }
}
