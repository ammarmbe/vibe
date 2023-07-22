import { db } from "@/lib/db";
import { Post } from "@/lib/types";
import { auth } from "@clerk/nextjs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parentNanoId = searchParams.get("parentNanoId");
  let postId = searchParams.get("postId");
  if (postId === "undefined") postId = "4294967295";
  const { userId } = auth();

  const comments = (
    await db.execute(
      "SELECT posts.id AS postId, posts.nanoId, posts.edited, posts.content, UNIX_TIMESTAMP(posts.createdAt) as createdAt, users.name, users.username, users.image, users.id AS userId, COUNT(likes.postId) AS likes, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentNanoId = posts.id AND comments.deleted = 0) AS comments, (SELECT COUNT(*) FROM likes WHERE likes.postId = posts.id AND likes.userId = :userId) as likedByUser FROM posts JOIN users ON posts.userId = users.id LEFT JOIN likes ON likes.postId = posts.id WHERE posts.parentNanoId = :parentNanoId AND posts.deleted = 0 AND posts.id < :postId GROUP BY posts.id, createdAt ORDER BY createdAt DESC LIMIT 11",
      { parentNanoId, postId, userId }
    )
  ).rows as Post[];

  return new Response(JSON.stringify(comments));
}
