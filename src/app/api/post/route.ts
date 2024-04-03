import sql from "@/lib/db";
import { Post } from "@/lib/types";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function POST(request: Request) {
  const { userId } = auth();

  const body = (await request.json()) as {
    content: string;
    nanoid: string;
    parentnanoid: string;
  };

  // remove ONLY trailing and leading &nbsp; from content
  body.content = body.content.replace(/^&nbsp;|&nbsp;$/g, "");

  if (userId && body.content) {
    await sql(
      "INSERT INTO posts (userid, content, parentnanoid, nanoid) VALUES ($1, $2, $3, $4)",
      [userId, body.content, body.parentnanoid ?? null, body.nanoid],
    );
  }

  return new Response((await sql("SELECT LAST_INSERT_ID() AS id"))[0]?.id);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nanoid = searchParams.get("nanoid");
  const { userId } = auth();

  const post = (
    await sql(
      "SELECT posts.id AS postid, posts.deleted, posts.edited, posts.nanoid, posts.content, posts.parentnanoid, EXTRACT(epoch FROM posts.createdat) as createdat, users.name, users.username, users.image, users.id AS userid, SUM(CASE WHEN likes.type = 'like' THEN 1 ELSE 0 END) AS likecount, SUM(CASE WHEN likes.type = 'heart' THEN 1 ELSE 0 END) AS heartcount, SUM(CASE WHEN likes.type = 'cry' THEN 1 ELSE 0 END) AS crycount, SUM(CASE WHEN likes.type = 'laugh' THEN 1 ELSE 0 END) AS laughcount, SUM(CASE WHEN likes.type = 'surprise' THEN 1 ELSE 0 END) AS surprisecount, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentnanoid = posts.nanoid AND comments.deleted = false) AS commentcount, (SELECT type FROM likes WHERE likes.postid = posts.id AND likes.userid = $2) as userlikestatus, (SElECT COUNT(*) FROM reposts WHERE postid = posts.id AND userid = $2) AS userrepoststatus FROM posts JOIN users ON posts.userid = users.id LEFT JOIN likes ON likes.postid = posts.id WHERE posts.nanoid = $1 GROUP BY posts.id, posts.createdat, users.name, users.id, users.username",
      [nanoid, userId],
    )
  )[0] as Post;

  if (!post) {
    return new Response(
      JSON.stringify({
        nanoid: nanoid,
        deleted: 1,
        parentnanoid: null,
      }),
    );
  }

  if (post.deleted) {
    return new Response(
      JSON.stringify({
        nanoid: nanoid,
        deleted: post.deleted,
        parentnanoid: post.parentnanoid,
      }),
    );
  }

  return new Response(JSON.stringify(post));
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const postid = searchParams.get("postid");
  const { userId } = auth();

  if (postid && userId) {
    await sql("UPDATE posts SET deleted = true WHERE id = $1 AND userid = $2", [
      postid,
      userId,
    ]);
  }

  return new Response("OK");
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const postid = searchParams.get("postid");
  const content = searchParams.get("content");
  const { userId } = auth();

  if (postid && userId && content && content.length < 513) {
    await sql(
      "UPDATE posts SET content = $3, edited = true WHERE id = $1 AND userid = $2",
      [postid, userId, content],
    );
  }

  return new Response("OK");
}
