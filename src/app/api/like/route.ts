import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(request: Request) {
	const { userId } = auth();
	const { searchParams } = new URL(request.url);
	const postId = searchParams.get("postId");
	const userLikeStatus = searchParams.get("userLikeStatus") as
		| "like"
		| "laugh"
		| "heart"
		| "cry"
		| "surprise"
		| null;
	const type = searchParams.get("type") as
		| "like"
		| "laugh"
		| "heart"
		| "cry"
		| "surprise";

	if (userId)
		if (userLikeStatus) {
			await db.execute(
				"DELETE FROM likes WHERE likes.postId = :postId AND likes.userId = :userId",
				{
					postId,
					userId,
				},
			);
		}
	if (type !== userLikeStatus) {
		await db.execute(
			"INSERT INTO likes (postId, userId, type) VALUES (:postId, :userId, :type)",
			{
				postId,
				userId,
				type,
			},
		);
	}

	return new Response("OK");
}
