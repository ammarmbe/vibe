import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(request: Request) {
  const { userId } = auth();
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  const liked = searchParams.get("liked") === "true";

  if (!!userId)
    if (liked) {
      await db.execute(
        "DELETE FROM likes WHERE likes.postId = :postId AND likes.userId = :userId",
        {
          postId,
          userId,
        }
      );
    } else {
      await db.execute(
        "INSERT INTO likes (postId, userId) VALUES (:postId, :userId)",
        {
          postId,
          userId,
        }
      );
    }

  return new Response("OK");
}
