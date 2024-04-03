import sql from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const userid = searchParams.get("userid");
  const followed = searchParams.get("followed") === "true";
  const { userId: currentUserId } = auth();

  if (userid && currentUserId) {
    if (followed) {
      await sql(
        "DELETE FROM follower_relation WHERE follower = $1 AND following = $2",
        [currentUserId, userid],
      );
    } else {
      await sql("INSERT INTO follower_relation VALUES ($1, $2)", [
        currentUserId,
        userid,
      ]);
    }
  }

  return new Response("OK");
}
