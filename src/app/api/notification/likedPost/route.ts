import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");
	const postId = searchParams.get("postId");
	const type = searchParams.get("type");
	const { userId: currentUserId } = auth();

	if (currentUserId === userId) {
		return new Response("OK");
	}

	if (userId && postId && currentUserId) {
		await db.execute(
			`INSERT INTO notifications (type, notifier, notified, postId) VALUES ('likedPost.${type}', :currentUserId, :userId, :postId)`,
			{
				userId,
				postId,
				currentUserId,
			},
		);
	}

	return new Response("OK");
}
