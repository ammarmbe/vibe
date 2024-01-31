import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

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
	}

	return new Response("OK");
}
