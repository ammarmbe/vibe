import "server-only";
import { Notification } from "@/lib/types";
import webpush from "web-push";
import { db } from "./db";

const sendPushNotification = async (
	notification: Notification,
	userId: string,
) => {
	if (!notification || !userId) return;

	let content = notification.notifierName;

	switch (notification.type) {
		case "followedUser":
			content += " followed you";
			break;
		case "likedPost.like":
			content += ` liked your ${
				notification.deleted ? "deleted post" : "post"
			}`;
			break;
		case "likedPost.heart":
			content += ` reacted ❤️ to your ${
				notification.deleted ? "deleted post" : "post"
			}`;
			break;
		case "likedPost.cry":
			content += ` reacted 😭 to your ${
				notification.deleted ? "deleted post" : "post"
			}`;
			break;
		case "likedPost.laugh":
			content += ` reacted 😂 to your ${
				notification.deleted ? "deleted post" : "post"
			}`;
			break;
		case "likedPost.surprise":
			content += ` reacted 😮 to your ${
				notification.deleted ? "deleted post" : "post"
			}`;
			break;
		case "commentedOnPost":
			content += ` commented on your ${
				notification.deleted ? "deleted post" : "post"
			}`;
			break;
		case "mentioned.comment":
			content += ` mentioned you in their ${
				notification.deleted ? "deleted comment" : "comment"
			}`;
			break;
		case "mentioned.post":
			content += ` mentioned you in their ${
				notification.deleted ? "deleted post" : "post"
			}`;
			break;
		case "reposted":
			content += ` reposted your ${
				notification.deleted ? "deleted post" : "post"
			}`;
			break;
		default:
			break;
	}

	const subscription = (
		await db.execute("SELECT * FROM subscriptions WHERE userId = :userId", {
			userId,
		})
	).rows[0];

	if (!subscription) return;

	const payload = JSON.stringify({
		title: "Vibe",
		body: content,
	});

	webpush.setVapidDetails(
		"https://vibe.ambe.dev",
		process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
		process.env.VAPID_PRIVATE_KEY as string,
	);

	webpush.sendNotification(subscription.subscription, payload);
};

export default sendPushNotification;
