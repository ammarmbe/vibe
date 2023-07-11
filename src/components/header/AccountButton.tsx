"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { SignOutButton, useUser } from "@clerk/nextjs";

export default function AccountButton() {
  const { user } = useUser();
  const [border, setBorder] = useState<"signOut" | "profile" | "">("");

  if (user)
    return (
      <Popover>
        <PopoverTrigger className="border font-medium hover:bg-accent flex gap-1.5 items-center hover:border-ring transition-colors px-2.5 py-1.5 rounded-md">
          <Image
            src={user.imageUrl}
            alt={`Account options`}
            width={19}
            height={19}
            className="rounded-full"
          />
          <p>{user.fullName}</p>
        </PopoverTrigger>
        <PopoverContent
          className={`flex group flex-col p-0 border-0 w-[150px]`}
        >
          <a
            href={user.id}
            onMouseEnter={() => setBorder("profile")}
            onMouseLeave={() => setBorder("")}
            className="rounded-t-md border-b-0 text-center transition-colors hover:bg-accent hover:border-ring border p-2.5"
          >
            View profile
          </a>
          <div
            className={`border-b border-dashed transition-all ${
              border == "signOut" && `border-danger/50 !border-solid`
            } ${border == "profile" && `border-ring !border-solid`}`}
          ></div>
          <SignOutButton>
            <button
              onMouseEnter={() => setBorder("signOut")}
              onMouseLeave={() => setBorder("")}
              className="text-danger hover:bg-danger/5 rounded-b-md border-t-0 transition-colors hover:border-danger/50 border p-2.5"
            >
              Sign out
            </button>
          </SignOutButton>
        </PopoverContent>
      </Popover>
    );
}
