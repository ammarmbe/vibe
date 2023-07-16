import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const postId = searchParams.get("postId");
  const { userId: currentUserId } = auth();

  if (currentUserId === userId) {
    return new Response("Not allowed", { status: 400 });
  }

  if (!!userId && !!postId && !!currentUserId) {
    await db.execute(
      "INSERT INTO notifications (type, notifier, notified, postId) VALUES ('likedPost', :currentUserId, :userId, :postId)",
      {
        userId,
        postId,
        currentUserId,
      }
    );
  } else {
    return new Response("Missing parameters", { status: 400 });
  }

  return new Response("OK");
}
