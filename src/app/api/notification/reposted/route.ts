import sql from "@/lib/db";
import sendPushNotification from "@/lib/sendPushNotification";
import { auth } from "@clerk/nextjs";
import { Notification } from "@/lib/types";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const userid = searchParams.get("userid");
  const postid = searchParams.get("postid");
  const { userId: currentUserId } = auth();

  if (currentUserId === userid) {
    return new Response("OK");
  }

  if (userid && postid && currentUserId) {
    await sql(
      `INSERT INTO notifications (type, notifier, notified, postid) VALUES ('reposted', $3, $1, $2)`,
      [userid, postid, currentUserId],
    );

    const notification = (await sql(
      "SELECT notifications.id, notifications.read, posts.nanoid, posts.deleted, notifications.type, notifications.notifier, notifications.postid, EXTRACT(epoch FROM notifications.createdat) AS createdat, users.image AS notifierimage, users.username AS notifierusername, users.name AS notifiername, posts.content FROM notifications JOIN users ON users.id = notifications.notifier LEFT JOIN posts ON posts.id = notifications.postid WHERE notifications.notified = $1 AND notifier = $3 AND postid = $2 AND type = 'reposted'",
      [userid, postid, currentUserId],
    )) as Notification[];

    await sendPushNotification(notification[0], userid);
  }

  return new Response("OK");
}
