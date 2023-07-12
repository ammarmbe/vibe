"use client";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";

// Code from WebDevSimplified
function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight + 2}px`;
}

export default function Textarea() {
  // Code from WebDevSimplified
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  // TODO: Clear textarea after submit

  return (
    <textarea
      ref={inputRef}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      rows={1}
      name="content"
      className="outline-none resize-none overflow-hidden w-full border rounded-md px-2.5 py-1.5 focus:border-ring"
      placeholder="What's on your mind?"
    ></textarea>
  );
}
