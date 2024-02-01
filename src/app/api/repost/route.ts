import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url);
	const postId = searchParams.get("postId");
	const userRepostStatus = searchParams.get("userRepostStatus");
	const { userId } = auth();

	if (postId && userId) {
		if (parseInt(userRepostStatus || "0")) {
			await db.execute(
				"DELETE FROM reposts WHERE postId = :postId AND userId = :userId",
				{
					postId,
					userId,
				},
			);
		} else {
			await db.execute(
				"INSERT INTO reposts (postId, userId) VALUES (:postId, :userId)",
				{
					postId,
					userId,
				},
			);
		}
	}

	return new Response("OK");
}
