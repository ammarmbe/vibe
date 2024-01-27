import { db } from "@/lib/db";
import { Post } from "@/lib/types";
import { auth } from "@clerk/nextjs";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");
	const postId = searchParams.get("postId");
	const { userId: currentUserId } = auth();

	const posts = (
		await db.execute(
			"SELECT posts.id AS postId, posts.nanoId, posts.edited, posts.content, UNIX_TIMESTAMP(posts.createdAt) as createdAt, users.name, users.username, users.image, users.id AS userId, COUNT(likes.postId) AS likes, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentNanoId = posts.id AND comments.deleted = 0) AS comments, (SELECT COUNT(*) FROM likes WHERE likes.postId = posts.id AND likes.userId = :currentUserId) as likedByUser FROM posts JOIN users ON posts.userId = users.id LEFT JOIN likes ON likes.postId = posts.id WHERE posts.parentNanoId IS NULL AND posts.deleted = 0 AND posts.userId = :userId AND posts.id < :postId GROUP BY posts.id, createdAt ORDER BY createdAt DESC LIMIT 11",
			{ postId, currentUserId, userId },
		)
	).rows as Post[];

	return new Response(JSON.stringify(posts));
}
