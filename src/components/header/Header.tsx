import React from "react";
import HeaderButtons from "./HeaderButtons";
import { JetBrains_Mono } from "next/font/google";

const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  style: ["italic", "normal"],
});

export default function Header() {
  return (
    <header className="py-3 flex items-center justify-between">
      <h1
        className={`${jetBrains.className} text-main select-none italic font-extrabold text-3xl tracking-tighter`}
      >
        <a href="/">Vibe</a>
      </h1>
      <nav className="flex gap-2.5 items-center">
        <HeaderButtons />
      </nav>
    </header>
  );
}
