import { db } from "@/lib/db";
import { Post } from "@/lib/types";
import { auth } from "@clerk/nextjs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  let postId = searchParams.get("postId");
  if (postId === "undefined") postId = "4294967295";
  const { userId: currentUserId } = auth();

  const posts = (
    await db.execute(
      "SELECT posts.id AS postId, posts.nanoId, posts.content, UNIX_TIMESTAMP(posts.createdAt) as createdAt, users.name, users.username, users.image, users.id AS userId, COUNT(likes.postId) AS likes, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentId = posts.id) AS comments, (SELECT COUNT(*) FROM likes WHERE likes.postId = posts.id AND likes.userId = :currentUserId) as likedByUser FROM posts JOIN users ON posts.userId = users.id LEFT JOIN likes ON likes.postId = posts.id WHERE posts.parentId IS NULL AND posts.userId = :userId AND posts.id < :postId GROUP BY posts.id, createdAt ORDER BY createdAt DESC LIMIT 11",
      { postId, currentUserId, userId }
    )
  ).rows as Post[];

  return new Response(JSON.stringify(posts));
}
