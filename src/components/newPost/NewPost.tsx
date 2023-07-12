import { currentUser } from "@clerk/nextjs";
import React from "react";
import Textarea from "./Textarea";
import Button from "./Button";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export default async function NewPost() {
  const user = await currentUser();

  async function NewPost(data: FormData) {
    "use server";
    const content = data.get("content") as string;
    if (content == "") return;
    const nanoId = nanoid(12);

    if (!!user)
      await db.execute(
        "INSERT INTO posts (userId, content, nanoId) VALUES (:userId, :content, :nanoId)",
        {
          userId: user.id,
          content,
          nanoId,
        }
      );
  }

  if (!!user) {
    return (
      <form action={NewPost} className="relative">
        <Textarea />
        <Button />
      </form>
    );
  } else {
    return null;
  }
}
