"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import NotificationButton from "./NotificationButton";

export default function AccountButton() {
  const { user } = useUser();
  const [border, setBorder] = useState<"signOut" | "profile" | "">("");

  return !user ? (
    <>
      <SignInButton>
        <button className="border rounded-md hover:border-ring hover:bg-accent transition-colors px-2.5 py-1">
          Sign in
        </button>
      </SignInButton>
      <SignUpButton>
        <button className="border rounded-md border-main/20 hover:bg-main/5 hover:border-main/50 text-main transition-colors px-2.5 py-1">
          Sign up
        </button>
      </SignUpButton>
    </>
  ) : (
    <>
      <ClerkLoading></ClerkLoading>
      <ClerkLoaded>
        <NotificationButton />
        <Popover>
          <PopoverTrigger className="border shadow-sm hover:shadow-none font-medium text-sm hover:bg-accent flex gap-[5px] items-center hover:border-ring transition-colors px-2.5 py-1.5 rounded-md">
            <Image
              src={user.imageUrl}
              alt={`Account options`}
              width={17}
              height={17}
              className="rounded-full"
            />
            <p>{user.fullName}</p>
          </PopoverTrigger>
          <PopoverContent
            className={`flex group flex-col p-0 border-0 w-[150px]`}
          >
            <a
              href={`/user/${user.unsafeMetadata.username}`}
              onMouseEnter={() => setBorder("profile")}
              onMouseLeave={() => setBorder("")}
              className="rounded-t-md border-b-0 text-sm text-center transition-colors hover:bg-accent hover:border-ring border p-2.5"
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
                className="text-danger hover:bg-danger/5 text-sm rounded-b-md border-t-0 transition-colors hover:border-danger/50 border p-2.5"
              >
                Sign out
              </button>
            </SignOutButton>
          </PopoverContent>
        </Popover>
      </ClerkLoaded>
    </>
  );
}
