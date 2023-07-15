import { db } from "@/lib/db";
import { Post } from "@/lib/types";
import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let postId = searchParams.get("postId");
  let feed = searchParams.get("feed");
  if (postId === "undefined") postId = "4294967295";
  const { userId } = auth();

  let posts;
  if (feed == "Home") {
    posts = (
      await db.execute(
        "SELECT posts.id AS postId, posts.nanoId, posts.content, UNIX_TIMESTAMP(posts.createdAt) as createdAt, users.name, users.username, users.image, users.id AS userId, COUNT(likes.postId) AS likes, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentId = posts.id) AS comments, (SELECT COUNT(*) FROM likes WHERE likes.postId = posts.id AND likes.userId = :userId) as likedByUser FROM posts JOIN users ON posts.userId = users.id LEFT JOIN likes ON likes.postId = posts.id WHERE posts.parentId IS NULL AND posts.id < :postId GROUP BY posts.id, createdAt ORDER BY createdAt DESC LIMIT 11",
        { postId, userId }
      )
    ).rows as Post[];
  } else {
    posts = (
      await db.execute(
        "SELECT posts.id AS postId, posts.nanoId, posts.content, UNIX_TIMESTAMP(posts.createdAt) as createdAt, users.name, users.username, users.image, users.id AS userId, COUNT(likes.postId) AS likes, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentId = posts.id) AS comments, (SELECT COUNT(*) FROM likes WHERE likes.postId = posts.id AND likes.userId = :userId) as likedByUser FROM posts JOIN users ON posts.userId = users.id JOIN (SELECT following FROM follower_relation WHERE follower = :userId) AS following ON following.following = posts.userId LEFT JOIN likes ON likes.postId = posts.id WHERE posts.parentId IS NULL AND posts.id < :postId GROUP BY posts.id, createdAt ORDER BY createdAt DESC LIMIT 11",
        { postId, userId }
      )
    ).rows as Post[];
  }

  return new Response(JSON.stringify(posts));
}
