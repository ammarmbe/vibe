import sql from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const postid = searchParams.get("postid");
  const userrepoststatus = searchParams.get("userrepoststatus");
  const { userId } = auth();

  if (postid && userId) {
    if (parseInt(userrepoststatus || "0")) {
      await sql("DELETE FROM reposts WHERE postid = $1 AND userid = $2", [
        postid,
        userId,
      ]);
    } else {
      await sql("INSERT INTO reposts (postid, userid) VALUES ($1, $2)", [
        postid,
        userId,
      ]);
    }
  }

  return new Response("OK");
}
