import { db } from "@/lib/db";
import sendPushNotification from "@/lib/sendPushNotification";
import { auth } from "@clerk/nextjs";
import { Notification } from "@/lib/types";

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");
	const { userId: currentUserId } = auth();

	if (currentUserId === userId) {
		return new Response("OK");
	}

	if (userId && currentUserId) {
		try {
			await db.execute(
				"INSERT INTO notifications (type, notifier, notified, postId) VALUES ('followedUser', :currentUserId, :userId, :postId)",
				{
					userId,
					currentUserId,
					postId: 0, // used for unique key constraint
				},
			);

			const notification = (await db.execute(
				`SELECT notifications.id, notifications.read, posts.nanoId, posts.deleted, notifications.type, notifications.notifier, notifications.postId, UNIX_TIMESTAMP(notifications.createdAt) AS createdAt, users.image AS notifierImage, users.username AS notifierUsername, users.name AS notifierName, posts.content FROM notifications JOIN users ON users.id = notifications.notifier LEFT JOIN posts ON posts.id = notifications.postId WHERE notifications.notified = :userId AND notifier = :currentUserId AND postId = :postId AND type = 'followedUser'`,
				{
					userId,
					postId: 0,
					currentUserId,
				},
			)) as { rows: Notification[] };

			sendPushNotification(notification.rows[0], userId);
		} catch (e) {
			// ignore unique constraint error
		}
	}

	return new Response("OK");
}
