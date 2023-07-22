"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { useRouter } from "next/navigation";
import EditProfile from "@/components/EditProfile";

export default function Page() {
  const { push } = useRouter();
  const { user } = useUser();

  if (user && user.unsafeMetadata.username) {
    push("/");
  }

  return (
    <main className="flex items-center justify-center w-full h-full">
      <EditProfile newUser={true} />
    </main>
  );
}
