import sql from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function POST(request: Request) {
  const { userId } = auth();
  const { searchParams } = new URL(request.url);
  const postid = searchParams.get("postid");
  const userlikestatus = searchParams.get("userlikestatus") as
    | "like"
    | "laugh"
    | "heart"
    | "cry"
    | "surprise"
    | null;
  const type = searchParams.get("type") as
    | "like"
    | "laugh"
    | "heart"
    | "cry"
    | "surprise";

  if (userId)
    if (userlikestatus) {
      await sql(
        "DELETE FROM likes WHERE likes.postid = $1 AND likes.userid = $2",
        [postid, userId],
      );
    }
  if (type !== userlikestatus) {
    await sql("INSERT INTO likes (postid, userid, type) VALUES ($1, $2, $3)", [
      postid,
      userId,
      type,
    ]);
  }

  return new Response("OK");
}
