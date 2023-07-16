import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const { userId: currentUserId } = auth();

  if (!!userId && !!currentUserId) {
    await db.execute(
      "INSERT INTO notifications (type, notifier, notified) VALUES ('followedUser', :currentUserId, :userId)",
      {
        userId,
        currentUserId,
      }
    );
  } else {
    return new Response("Missing parameters", { status: 400 });
  }

  return new Response("OK");
}
