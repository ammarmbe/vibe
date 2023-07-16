import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const { userId: currentUserId } = auth();

  if (currentUserId === userId) {
    return new Response("Not allowed", { status: 400 });
  }

  if (!!userId && !!currentUserId) {
    await db.execute(
      "INSERT INTO notifications (type, notifier, notified, postId) VALUES ('followedUser', :currentUserId, :userId, :postId)",
      {
        userId,
        currentUserId,
        postId: 0, // used for unique key constraint
      }
    );
  } else {
    return new Response("Missing parameters", { status: 400 });
  }

  return new Response("OK");
}
