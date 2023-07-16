"use client";
import React, { useEffect, useState } from "react";
import style from "./Header.module.css";
import { JetBrains_Mono } from "next/font/google";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  style: ["italic", "normal"],
});

export default function HeaderTitle() {
  const [feed, setFeed] = useState<"Home" | "Following">("Home");
  const popoverClose = React.useRef<HTMLButtonElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [popoverDisabled, setPopoverDisabled] = useState(false);
  const { push } = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    setFeed(localStorage.getItem("feed") as "Home" | "Following");
  });

  // Run animation when feed changes
  useEffect(() => {
    if (!isSignedIn || location.pathname != "/") return;

    setPopoverDisabled(true);
    containerRef.current?.classList.add(style.animateLetters);

    if (feed == "Following") {
      containerRef.current?.classList.add(style.animateWidth);
    }

    setTimeout(() => {
      containerRef.current?.classList.remove(style.animateLetters);
      containerRef.current?.classList.remove(style.animateWidth);
      setPopoverDisabled(false);
    }, 3000);
  }, []);

  return (
    <div className="flex">
      <h1
        className={`${jetBrains.className} text-main select-none italic font-extrabold text-3xl tracking-tighter`}
      >
        <a href="/">
          <div
            ref={containerRef}
            className={`flex w-[66px] h-[36px] flex-wrap overflow-y-hidden will-change-contents`}
          >
            <span>
              <div>V</div>
              <div>{feed ? feed[0] : "H"}</div>
            </span>
            <span style={{ animationDelay: "75ms" }}>
              <div>i</div>
              <div>o</div>
            </span>
            <span style={{ animationDelay: "150ms" }}>
              <div>b</div>
              <div>{feed ? feed[2] : "m"}</div>
            </span>
            <span style={{ animationDelay: "225ms" }}>
              <div>e</div>
              <div>{feed ? feed[3] : "e"}</div>
            </span>
            <span style={{ animationDelay: "300ms" }}>
              <div>&nbsp;</div>
              <div>o</div>
            </span>
            <span style={{ animationDelay: "375ms" }}>
              <div>&nbsp;</div>
              <div>w</div>
            </span>
            <span style={{ animationDelay: "450ms" }}>
              <div>&nbsp;</div>
              <div>i</div>
            </span>
            <span style={{ animationDelay: "525ms" }}>
              <div>&nbsp;</div>
              <div>n</div>
            </span>
            <span style={{ animationDelay: "600ms" }}>
              <div>&nbsp;</div>
              <div>g</div>
            </span>
          </div>
        </a>
      </h1>
      {isSignedIn && (
        <Popover>
          <PopoverTrigger disabled={popoverDisabled}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2 h-4 w-4"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </PopoverTrigger>
          <PopoverContent className="p-1 flex flex-col text-center h-auto w-auto">
            <button
              onClick={() => {
                setFeed("Home");
                localStorage.setItem("feed", "Home");
                popoverClose.current?.click();
                if (location.pathname == "/") {
                  location.reload();
                } else {
                  push("/");
                }
              }}
              className={`px-2.5 py-1.5 rounded-sm text-sm transition-colors ${
                feed === "Home" && "bg-secondary"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setFeed("Following");
                localStorage.setItem("feed", "Following");
                popoverClose.current?.click();
                if (location.pathname == "/") {
                  location.reload();
                } else {
                  push("/");
                }
              }}
              className={`px-2.5 py-1.5 rounded-sm text-sm transition-colors ${
                feed === "Following" && "bg-secondary"
              }`}
            >
              Following
            </button>
            <PopoverClose ref={popoverClose} />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
