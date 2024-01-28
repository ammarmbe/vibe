import { db } from "@/lib/db";
import { Post } from "@/lib/types";
import { auth } from "@clerk/nextjs";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const postId = searchParams.get("postId");
	const feed = searchParams.get("feed");
	const { userId } = auth();

	if (feed === "Home") {
		const posts = (
			await db.execute(
				"SELECT posts.id AS postId, posts.nanoId, posts.edited, posts.content, UNIX_TIMESTAMP(posts.createdAt) as createdAt, users.name, users.username, users.image, users.id AS userId, SUM(CASE WHEN likes.type = 'like' THEN 1 ELSE 0 END) AS likeCount, SUM(CASE WHEN likes.type = 'heart' THEN 1 ELSE 0 END) AS heartCount, SUM(CASE WHEN likes.type = 'cry' THEN 1 ELSE 0 END) AS cryCount, SUM(CASE WHEN likes.type = 'laugh' THEN 1 ELSE 0 END) AS laughCount, SUM(CASE WHEN likes.type = 'surprise' THEN 1 ELSE 0 END) AS surpriseCount, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentNanoId = posts.nanoId AND comments.deleted = 0) AS commentCount, (SELECT type FROM likes WHERE likes.postId = posts.id AND likes.userId = :userId) as userLikeStatus FROM posts JOIN users ON posts.userId = users.id LEFT JOIN likes ON likes.postId = posts.id WHERE posts.parentNanoId IS NULL AND posts.deleted = 0 AND posts.id < :postId GROUP BY posts.id, createdAt ORDER BY createdAt DESC LIMIT 11",
				{ postId, userId },
			)
		).rows as Post[];

		return new Response(JSON.stringify(posts));
	}

	const posts = (
		await db.execute(
			"SELECT posts.id AS postId, posts.nanoId, posts.edited, posts.content, UNIX_TIMESTAMP(posts.createdAt) as createdAt, users.name, users.username, users.image, users.id AS userId, SUM(CASE WHEN likes.type = 'like' THEN 1 ELSE 0 END) AS likeCount, SUM(CASE WHEN likes.type = 'heart' THEN 1 ELSE 0 END) AS heartCount, SUM(CASE WHEN likes.type = 'cry' THEN 1 ELSE 0 END) AS cryCount, SUM(CASE WHEN likes.type = 'laugh' THEN 1 ELSE 0 END) AS laughCount, SUM(CASE WHEN likes.type = 'surprise' THEN 1 ELSE 0 END) AS surpriseCount, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentNanoId = posts.nanoId AND comments.deleted = 0) AS commentCount, (SELECT type FROM likes WHERE likes.postId = posts.id AND likes.userId = :userId) as userLikeStatus FROM posts JOIN users ON posts.userId = users.id JOIN (SELECT following FROM follower_relation WHERE follower = :userId) AS following ON following.following = posts.userId LEFT JOIN likes ON likes.postId = posts.id WHERE posts.parentNanoId IS NULL AND posts.deleted = 0 AND posts.id < :postId GROUP BY posts.id, createdAt ORDER BY createdAt DESC LIMIT 11",
			{ postId, userId },
		)
	).rows as Post[];

	return new Response(JSON.stringify(posts));
}
