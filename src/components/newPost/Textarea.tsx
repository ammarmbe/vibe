"use client";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

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

  const { pending } = useFormStatus();
  const [prevPendingState, setPrevPendingState] = useState(false);

  // Clear textarea after submit
  useEffect(() => {
    if (prevPendingState && !pending && inputValue.length < 513) {
      setTimeout(() => {
        setInputValue("");
      }, 300);
    }

    setPrevPendingState(pending);
  }, [pending]);

  return (
    <>
      <textarea
        ref={inputRef}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        name="content"
        className="outline-none resize-none overflow-hidden w-full border bg-transparent focus:shadow-none transition-colors shadow-sm rounded-md px-2.5 py-1.5 pr-[55px] focus:border-ring h-[38px] dark:focus:border-foreground/25"
        placeholder="What's on your mind?"
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
    </>
  );
}
