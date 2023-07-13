"use client";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export default function Button() {
  const { pending } = useFormStatus();
  const [prevPendingState, setPrevPendingState] = useState(false);
  const client = useQueryClient();

  // Revalidate homeFeed after posting
  useEffect(() => {
    if (prevPendingState && !pending) {
      setTimeout(() => {
        client.invalidateQueries({ queryKey: ["homeFeed"] });
      }, 300);
    }

    setPrevPendingState(pending);
  }, [pending]);

  return (
    <button
      disabled={pending}
      className="border disabled:cursor-wait disabled:hover:border-border disabled:hover:bg-white disabled:text-ring rounded-sm text-sm px-1.5 py-0.5 hover:bg-accent hover:border-ring transition-colors absolute top-[6px] right-[6px]"
    >
      Post
    </button>
  );
}
