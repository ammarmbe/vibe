import sql from "@/lib/db";
import { Post } from "@/lib/types";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parentnanoid = searchParams.get("parentnanoid");
  const postid = searchParams.get("postid");
  const { userId } = auth();

  const comments = (await sql(
    "SELECT posts.id AS postid, posts.nanoid, posts.edited, posts.content, posts.parentnanoid, EXTRACT(epoch FROM posts.createdat) as createdat, users.name, users.username, users.image, users.id AS userid, SUM(CASE WHEN likes.type = 'like' THEN 1 ELSE 0 END) AS likecount, SUM(CASE WHEN likes.type = 'heart' THEN 1 ELSE 0 END) AS heartcount, SUM(CASE WHEN likes.type = 'cry' THEN 1 ELSE 0 END) AS crycount, SUM(CASE WHEN likes.type = 'laugh' THEN 1 ELSE 0 END) AS laughcount, SUM(CASE WHEN likes.type = 'surprise' THEN 1 ELSE 0 END) AS surprisecount, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentnanoid = posts.nanoid AND comments.deleted = false) AS commentcount, (SELECT type FROM likes WHERE likes.postid = posts.id AND likes.userid = $3) as userlikestatus, (SElECT COUNT(*) FROM reposts WHERE postid = posts.id AND userid = $3) AS userrepoststatus FROM posts JOIN users ON posts.userid = users.id LEFT JOIN likes ON likes.postid = posts.id WHERE posts.parentnanoid = $1 AND posts.deleted = false AND posts.id < $2 GROUP BY posts.id, createdat, users.name, users.image, users.id ORDER BY posts.createdat DESC LIMIT 11",
    [parentnanoid, postid, userId],
  )) as Post[];

  return new Response(JSON.stringify(comments));
}
