"use client";
import { useAuth } from "@clerk/nextjs";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import axios from "axios";
import { client } from "@/lib/reactQueryProvider";
import { Post } from "@/lib/types";

export default function NewComment({
  parentId,
  nanoId,
}: {
  parentId: string;
  nanoId: string;
}) {
  const { userId } = useAuth();
  const commentMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const content = data.get("content") as string;
      if (content == "") return;
      const nanoId = nanoid(12);

      await axios.post("/api/new-comment", { content, nanoId, parentId });
    },
    onSuccess: () => {
      client.invalidateQueries(["comments"]);
      client.setQueryData(["post", nanoId], (data?: Post) => {
        if (data) {
          return {
            ...data,
            // @ts-ignore
            comments: parseInt(data.comments) + 1,
          };
        }
      });

      setInputValue("");
    },
  });

  function handleSubmit(data: React.FormEvent<HTMLFormElement>) {
    data.preventDefault();
    commentMutation.mutate(new FormData(data.target as HTMLFormElement));
  }

  // Textarea code
  function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if (textArea == null) return;
    textArea.style.height = "0";
    textArea.style.height = `${textArea.scrollHeight + 2}px`;
  }

  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  if (!!userId) {
    return (
      <form
        onSubmit={(data) => handleSubmit(data)}
        className="relative flex mb-2.5"
      >
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          rows={1}
          name="content"
          className="outline-none resize-none overflow-hidden w-full border focus:shadow-none transition-colors shadow-sm rounded-md px-2.5 py-1.5 pr-[55px] focus:border-ring"
          placeholder="Add a comment"
        ></textarea>
        <button
          disabled={commentMutation.isLoading}
          className="border disabled:cursor-wait disabled:hover:border-border disabled:hover:bg-white disabled:text-ring rounded-sm text-sm px-1.5 py-0.5 hover:bg-accent hover:border-ring transition-colors absolute top-[6px] right-[6px]"
        >
          Reply
        </button>
      </form>
    );
  } else {
    return null;
  }
}
