import { db } from "@/lib/db";
import { Post } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let postId = searchParams.get("postId");
  if (postId === "undefined") postId = "4294967295";

  const posts = (
    await db.execute(
      "SELECT posts.id AS postId, posts.nanoId, posts.content, posts.createdAt, users.name, users.username, users.image, users.id AS userId, COUNT(likes.postId) AS likes FROM posts JOIN users ON posts.userId = users.id LEFT JOIN likes ON likes.postId = posts.id WHERE posts.parentId IS NULL AND posts.id < :postId GROUP BY posts.id, createdAt ORDER BY createdAt DESC LIMIT 11",
      { postId }
    )
  ).rows as Post[];

  return new Response(JSON.stringify(posts));
}
