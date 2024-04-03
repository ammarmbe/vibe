import sql from "@/lib/db";
import { Post, Repost } from "@/lib/types";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userid = searchParams.get("userid");
  const postid = searchParams.get("postid");
  const { userId: currentUserId } = auth();

  const posts = (await sql(
    "SELECT posts.id AS postid, posts.nanoid, posts.edited, posts.content, EXTRACT(epoch FROM posts.createdat) as createdat, users.name, users.username, users.image, users.id AS userid, SUM(CASE WHEN likes.type = 'like' THEN 1 ELSE 0 END) AS likecount, SUM(CASE WHEN likes.type = 'heart' THEN 1 ELSE 0 END) AS heartcount, SUM(CASE WHEN likes.type = 'cry' THEN 1 ELSE 0 END) AS crycount, SUM(CASE WHEN likes.type = 'laugh' THEN 1 ELSE 0 END) AS laughcount, SUM(CASE WHEN likes.type = 'surprise' THEN 1 ELSE 0 END) AS surprisecount, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentnanoid = posts.nanoid AND comments.deleted = false) AS commentcount, (SELECT type FROM likes WHERE likes.postid = posts.id AND likes.userid = $2) as userlikestatus, (SElECT COUNT(*) FROM reposts WHERE postid = posts.id AND userid = $2) AS userrepoststatus FROM posts JOIN users ON posts.userid = users.id LEFT JOIN likes ON likes.postid = posts.id WHERE posts.parentnanoid IS NULL AND posts.deleted = false AND posts.userid = $3 AND posts.id < $1 GROUP BY posts.id, posts.createdat, users.name, users.id, users.username, users.image ORDER BY posts.createdat DESC LIMIT 11",
    [postid, currentUserId, userid],
  )) as Post[];

  const reposts = (await sql(
    "SELECT posts.id AS postid, posts.nanoid, posts.edited, posts.content, users2.name AS repostername, users2.username AS reposterusername, EXTRACT(epoch FROM reposts.createdat) as repostcreatedat, EXTRACT(epoch FROM posts.createdat) as createdat, users.name, users.username, users.image, users.id AS userid, SUM(CASE WHEN likes.type = 'like' THEN 1 ELSE 0 END) AS likecount, SUM(CASE WHEN likes.type = 'heart' THEN 1 ELSE 0 END) AS heartcount, SUM(CASE WHEN likes.type = 'cry' THEN 1 ELSE 0 END) AS crycount, SUM(CASE WHEN likes.type = 'laugh' THEN 1 ELSE 0 END) AS laughcount, SUM(CASE WHEN likes.type = 'surprise' THEN 1 ELSE 0 END) AS surprisecount, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentnanoid = posts.nanoid AND comments.deleted = false) AS commentcount, (SELECT type FROM likes WHERE likes.postid = posts.id AND likes.userid = $2) as userlikestatus, (SElECT COUNT(*) FROM reposts WHERE postid = posts.id AND userid = $2) AS userrepoststatus FROM reposts JOIN posts ON reposts.postid = posts.id LEFT JOIN likes ON likes.postid = posts.id JOIN users ON posts.userid = users.id JOIN users AS users2 ON users2.id = reposts.userid WHERE posts.parentnanoid IS NULL AND posts.deleted = false AND reposts.userid = $3 AND posts.id < $1 GROUP BY posts.id, reposts.createdat, users2.name, users2.username, reposts.createdat, users.name, users.id, users.username, users.image ORDER BY reposts.createdat DESC LIMIT 11",
    [postid, currentUserId, userid],
  )) as Repost[];

  return new Response(JSON.stringify([...posts, ...reposts]));
}
