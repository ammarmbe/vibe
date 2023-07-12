"use client";
import React from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export default function Button() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="border disabled:cursor-wait disabled:hover:border-border disabled:hover:bg-white disabled:text-ring rounded-sm text-sm px-1.5 py-0.5 hover:bg-accent hover:border-ring transition-colors absolute top-[6px] right-[6px]"
    >
      Post
    </button>
  );
}
