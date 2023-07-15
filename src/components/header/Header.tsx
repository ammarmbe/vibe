import React from "react";
import HeaderButtons from "./HeaderButtons";
import HeaderTitle from "./HeaderTitle";

export default function Header() {
  return (
    <header className="py-3 flex items-center justify-between">
      <HeaderTitle />
      <nav className="flex gap-2.5 items-center">
        <HeaderButtons />
      </nav>
    </header>
  );
}
