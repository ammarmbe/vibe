import { db } from "@/lib/db";
import sendPushNotification from "@/lib/sendPushNotification";
import { auth } from "@clerk/nextjs";
import { Notification } from "@/lib/types";

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");
	const postId = searchParams.get("postId");
	const { userId: currentUserId } = auth();

	if (currentUserId === userId) {
		return new Response("OK");
	}

	if (userId && postId && currentUserId) {
		await db.execute(
			"INSERT INTO notifications (type, notifier, notified, postId) VALUES ('commentedOnPost', :currentUserId, :userId, :postId)",
			{
				userId,
				postId,
				currentUserId,
			},
		);

		const notification = (await db.execute(
			`SELECT notifications.id, notifications.read, posts.nanoId, posts.deleted, notifications.type, notifications.notifier, notifications.postId, UNIX_TIMESTAMP(notifications.createdAt) AS createdAt, users.image AS notifierImage, users.username AS notifierUsername, users.name AS notifierName, posts.content FROM notifications JOIN users ON users.id = notifications.notifier LEFT JOIN posts ON posts.id = notifications.postId WHERE notifications.notified = :userId AND notifier = :currentUserId AND postId = :postId AND type = 'commentedOnPost'`,
			{
				userId,
				postId,
				currentUserId,
			},
		)) as { rows: Notification[] };

		sendPushNotification(notification.rows[0], userId);
	}

	return new Response("OK");
}
