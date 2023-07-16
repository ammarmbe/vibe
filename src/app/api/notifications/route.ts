import { db } from "@/lib/db";
import { Notification } from "@/lib/types";
import { auth } from "@clerk/nextjs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let notificationId = searchParams.get("notificationId");
  if (notificationId === "undefined") notificationId = "4294967295";
  const { userId } = auth();

  const notifications = (
    await db.execute(
      "SELECT notifications.id, notifications.read, notifications.type, notifications.notifier, notifications.postId, UNIX_TIMESTAMP(notifications.createdAt) AS createdAt, users.image AS notifierImage, users.name AS notifierName, posts.content FROM notifications JOIN users ON users.id = notifications.notifier LEFT JOIN posts ON posts.id = notifications.postId WHERE notifications.id < :notificationId AND notifications.notified = :userId ORDER BY createdAt DESC LIMIT 11",
      { notificationId, userId }
    )
  ).rows as Notification[];

  return new Response(JSON.stringify(notifications));
}
