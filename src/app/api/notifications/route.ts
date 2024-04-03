import sql from "@/lib/db";
import { Notification } from "@/lib/types";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let notificationId = searchParams.get("notificationId");
  if (notificationId === "undefined") notificationId = "2147483647";
  const { userId } = auth();

  const notifications = (await sql(
    "SELECT notifications.id, notifications.read, posts.nanoid, posts.deleted, notifications.type, notifications.notifier, notifications.postid, EXTRACT(epoch FROM notifications.createdat) AS createdat, users.image AS notifierimage, users.username AS notifierusername, users.name AS notifiername, posts.content FROM notifications JOIN users ON users.id = notifications.notifier LEFT JOIN posts ON posts.id = notifications.postid WHERE notifications.id < $1 AND notifications.notified = $2 ORDER BY createdat DESC LIMIT 11",
    [notificationId, userId],
  )) as Notification[];

  return new Response(JSON.stringify(notifications));
}
