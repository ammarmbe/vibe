import { db } from "@/lib/db";
import { sendPushNotification } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { Notification } from "@/lib/types";

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url);
	const postId = searchParams.get("postId");
	const username = searchParams.get("username");
	const type = searchParams.get("type") as "comment" | "post";
	const { userId: currentUserId, user } = auth();

	if (user?.username === username) {
		return new Response("OK");
	}

	if (postId && currentUserId && username) {
		await db.execute(
			`INSERT INTO notifications (type, notifier, postId, notified) VALUES ('mentioned.${type}', :currentUserId, :postId, (SELECT id FROM users WHERE username = :username))`,
			{
				postId,
				currentUserId,
				username,
			},
		);

		const userId = (
			await db.execute("SELECT id FROM users WHERE username = :username", {
				username,
			})
		).rows[0].id;

		const notification = (await db.execute(
			`SELECT notifications.id, notifications.read, posts.nanoId, posts.deleted, notifications.type, notifications.notifier, notifications.postId, UNIX_TIMESTAMP(notifications.createdAt) AS createdAt, users.image AS notifierImage, users.username AS notifierUsername, users.name AS notifierName, posts.content FROM notifications JOIN users ON users.id = notifications.notifier LEFT JOIN posts ON posts.id = notifications.postId WHERE notifications.notified = (SELECT id FROM users WHERE username = :username) AND notifier = :currentUserId AND postId = :postId AND type = 'mentioned.${type}'`,
			{
				username,
				postId,
				currentUserId,
			},
		)) as { rows: Notification[] };

		sendPushNotification(notification.rows[0], userId);
	}

	return new Response("OK");
}
