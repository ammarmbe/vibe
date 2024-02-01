import { db } from "@/lib/db";
import { Post, Repost } from "@/lib/types";
import { auth } from "@clerk/nextjs";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");
	const postId = searchParams.get("postId");
	const { userId: currentUserId } = auth();

	const posts = (
		await db.execute(
			"SELECT posts.id AS postId, posts.nanoId, posts.edited, posts.content, UNIX_TIMESTAMP(posts.createdAt) as createdAt, users.name, users.username, users.image, users.id AS userId, SUM(CASE WHEN likes.type = 'like' THEN 1 ELSE 0 END) AS likeCount, SUM(CASE WHEN likes.type = 'heart' THEN 1 ELSE 0 END) AS heartCount, SUM(CASE WHEN likes.type = 'cry' THEN 1 ELSE 0 END) AS cryCount, SUM(CASE WHEN likes.type = 'laugh' THEN 1 ELSE 0 END) AS laughCount, SUM(CASE WHEN likes.type = 'surprise' THEN 1 ELSE 0 END) AS surpriseCount, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentNanoId = posts.nanoId AND comments.deleted = 0) AS commentCount, (SELECT type FROM likes WHERE likes.postId = posts.id AND likes.userId = :currentUserId) as userLikeStatus, (SElECT COUNT(*) FROM reposts WHERE postId = posts.id AND userId = :currentUserId) AS userRepostStatus FROM posts JOIN users ON posts.userId = users.id LEFT JOIN likes ON likes.postId = posts.id WHERE posts.parentNanoId IS NULL AND posts.deleted = 0 AND posts.userId = :userId AND posts.id < :postId GROUP BY posts.id, createdAt ORDER BY createdAt DESC LIMIT 11",
			{ postId, currentUserId, userId },
		)
	).rows as Post[];

	const reposts = (
		await db.execute(
			"SELECT posts.id AS postId, posts.nanoId, posts.edited, posts.content, users2.name AS reposterName, users2.username AS reposterUsername, UNIX_TIMESTAMP(reposts.createdAt) as repostCreatedAt, UNIX_TIMESTAMP(posts.createdAt) as createdAt, users.name, users.username, users.image, users.id AS userId, SUM(CASE WHEN likes.type = 'like' THEN 1 ELSE 0 END) AS likeCount, SUM(CASE WHEN likes.type = 'heart' THEN 1 ELSE 0 END) AS heartCount, SUM(CASE WHEN likes.type = 'cry' THEN 1 ELSE 0 END) AS cryCount, SUM(CASE WHEN likes.type = 'laugh' THEN 1 ELSE 0 END) AS laughCount, SUM(CASE WHEN likes.type = 'surprise' THEN 1 ELSE 0 END) AS surpriseCount, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentNanoId = posts.nanoId AND comments.deleted = 0) AS commentCount, (SELECT type FROM likes WHERE likes.postId = posts.id AND likes.userId = :currentUserId) as userLikeStatus, (SElECT COUNT(*) FROM reposts WHERE postId = posts.id AND userId = :currentUserId) AS userRepostStatus FROM reposts JOIN posts ON reposts.postId = posts.id LEFT JOIN likes ON likes.postId = posts.id JOIN users ON posts.userId = users.id JOIN users AS users2 ON users2.id = reposts.userId WHERE posts.parentNanoId IS NULL AND posts.deleted = 0 AND reposts.userId = :userId AND posts.id < :postId GROUP BY posts.id, createdAt, users2.name, users2.username, reposts.createdAt ORDER BY createdAt DESC LIMIT 11",
			{ postId, currentUserId, userId },
		)
	).rows as Repost[];

	return new Response(JSON.stringify([...posts, ...reposts]));
}
