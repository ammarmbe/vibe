import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const followed = searchParams.get("followed") === "true";
  const { userId: currentUserId } = auth();

  if (userId && currentUserId) {
    if (!!followed) {
      await db.execute(
        "DELETE FROM follower_relation WHERE follower = :currentUserId AND following = :userId",
        { currentUserId, userId }
      );
    } else {
      await db.execute(
        "INSERT INTO follower_relation VALUES (:currentUserId, :userId)",
        { currentUserId, userId }
      );
    }
  } else {
    return new Response("Missing userId or currentUserId", { status: 400 });
  }

  return new Response("OK");
}
