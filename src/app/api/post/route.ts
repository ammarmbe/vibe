import { db } from "@/lib/db";
import { Post } from "@/lib/types";
import { auth } from "@clerk/nextjs";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const parentNanoId = searchParams.get("parentNanoId");
  const { userId } = auth();
  const content = searchParams.get("content");
  const nanoId = searchParams.get("nanoId");

  if (parentNanoId && userId && content && nanoId && content.length < 513) {
    await db.execute(
      "INSERT INTO posts (userId, content, parentNanoId, nanoId) VALUES (:userId, :content, :parentNanoId, :nanoId)",
      {
        userId,
        content,
        parentNanoId,
        nanoId,
      }
    );
  }

  return new Response("OK");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nanoId = searchParams.get("nanoId");
  const { userId } = auth();

  const post = (
    await db.execute(
      "SELECT posts.id AS postId, posts.deleted, posts.nanoId, posts.content, posts.parentNanoId, UNIX_TIMESTAMP(posts.createdAt) as createdAt, users.name, users.username, users.image, users.id AS userId, COUNT(likes.postId) AS likes, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentNanoId = posts.nanoId AND comments.deleted = 0) AS comments, (SELECT COUNT(*) FROM likes WHERE likes.postId = posts.id AND likes.userId = :userId) as likedByUser FROM posts JOIN users ON posts.userId = users.id LEFT JOIN likes ON likes.postId = posts.id WHERE posts.nanoId = :nanoId GROUP BY posts.id, createdAt",
      { nanoId, userId }
    )
  ).rows[0] as Post;

  if (post.deleted) {
    return new Response(
      JSON.stringify({
        nanoId: post.nanoId,
        deleted: post.deleted,
        parentNanoId: post.parentNanoId,
      })
    );
  }

  return new Response(JSON.stringify(post));
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  // const { userId } = auth();

  if (postId) {
    await db.execute("UPDATE posts SET deleted = 1 WHERE id = :postId", {
      postId,
    });
  }

  return new Response("OK");
}
