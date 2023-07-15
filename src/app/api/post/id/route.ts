import { db } from "@/lib/db";
import { Post } from "@/lib/types";
import { auth } from "@clerk/nextjs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  const { userId } = auth();

  const post = (
    await db.execute(
      "SELECT posts.id AS postId, posts.nanoId, posts.content, posts.parentId, UNIX_TIMESTAMP(posts.createdAt) as createdAt, users.name, users.username, users.image, users.id AS userId, COUNT(likes.postId) AS likes, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentId = posts.id) AS comments, (SELECT COUNT(*) FROM likes WHERE likes.postId = posts.id AND likes.userId = :userId) as likedByUser FROM posts JOIN users ON posts.userId = users.id LEFT JOIN likes ON likes.postId = posts.id WHERE posts.id = :postId GROUP BY posts.id, createdAt",
      { postId, userId }
    )
  ).rows[0] as Post;

  return new Response(JSON.stringify(post));
}
