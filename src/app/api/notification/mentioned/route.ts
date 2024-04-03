import sql from "@/lib/db";
import sendPushNotification from "@/lib/sendPushNotification";
import { auth } from "@clerk/nextjs";
import { Notification } from "@/lib/types";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const postid = searchParams.get("postid");
  const username = searchParams.get("username");
  const type = searchParams.get("type") as "comment" | "post";
  const { userId: currentUserId, user } = auth();

  if (user?.username === username) {
    return new Response("OK");
  }

  if (postid && currentUserId && username) {
    await sql(
      `INSERT INTO notifications (type, notifier, postid, notified) VALUES ('mentioned.${type}', $1, $2, (SELECT id FROM users WHERE username = $3))`,
      [currentUserId, postid, username],
    );

    const userid = (
      await sql("SELECT id FROM users WHERE username = $1", [username])
    )?.[0].id;

    const notification = (await sql(
      `SELECT notifications.id, notifications.read, posts.nanoid, posts.deleted, notifications.type, notifications.notifier, notifications.postid, EXTRACT(epoch FROM notifications.createdat) AS createdat, users.image AS notifierimage, users.username AS notifierusername, users.name AS notifiername, posts.content FROM notifications JOIN users ON users.id = notifications.notifier LEFT JOIN posts ON posts.id = notifications.postid WHERE notifications.notified = (SELECT id FROM users WHERE username = $1) AND notifier = $3 AND postid = $2 AND type = 'mentioned.${type}'`,
      [username, postid, currentUserId],
    )) as Notification[];

    await sendPushNotification(notification[0], userid);
  }

  return new Response("OK");
}
