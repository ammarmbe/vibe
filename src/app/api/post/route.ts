import { db } from "@/lib/db";
import { Post } from "@/lib/types";
import { auth } from "@clerk/nextjs";

export async function POST(request: Request) {
	const { userId } = auth();

	const body = (await request.json()) as {
		content: string;
		nanoId: string;
		parentNanoId: string;
	};

	// remove ONLY trailing and leading &nbsp; from content
	body.content = body.content.replace(/^&nbsp;|&nbsp;$/g, "");

	if (userId && body.content) {
		await db.execute(
			"INSERT INTO posts (userId, content, parentNanoId, nanoId) VALUES (:userId, :content, :parentNanoId, :nanoId)",
			{
				userId,
				content: body.content,
				parentNanoId: body.parentNanoId ?? null,
				nanoId: body.nanoId,
			},
		);
	}

	return new Response(
		(await db.execute("SELECT LAST_INSERT_ID() AS id")).rows[0].id,
	);
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const nanoId = searchParams.get("nanoId");
	const { userId } = auth();

	const post = (
		await db.execute(
			"SELECT posts.id AS postId, posts.deleted, posts.edited, posts.nanoId, posts.content, posts.parentNanoId, UNIX_TIMESTAMP(posts.createdAt) as createdAt, users.name, users.username, users.image, users.id AS userId, SUM(CASE WHEN likes.type = 'like' THEN 1 ELSE 0 END) AS likeCount, SUM(CASE WHEN likes.type = 'heart' THEN 1 ELSE 0 END) AS heartCount, SUM(CASE WHEN likes.type = 'cry' THEN 1 ELSE 0 END) AS cryCount, SUM(CASE WHEN likes.type = 'laugh' THEN 1 ELSE 0 END) AS laughCount, SUM(CASE WHEN likes.type = 'surprise' THEN 1 ELSE 0 END) AS surpriseCount, (SELECT COUNT(*) FROM posts AS comments WHERE comments.parentNanoId = posts.nanoId AND comments.deleted = 0) AS commentCount, (SELECT type FROM likes WHERE likes.postId = posts.id AND likes.userId = :userId) as userLikeStatus, (SElECT COUNT(*) FROM reposts WHERE postId = posts.id AND userId = :userId) AS userRepostStatus FROM posts JOIN users ON posts.userId = users.id LEFT JOIN likes ON likes.postId = posts.id WHERE posts.nanoId = :nanoId GROUP BY posts.id, createdAt",
			{ nanoId, userId },
		)
	).rows[0] as Post;

	if (!post) {
		return new Response(
			JSON.stringify({
				nanoId: nanoId,
				deleted: 1,
				parentNanoId: null,
			}),
		);
	}

	if (post.deleted) {
		return new Response(
			JSON.stringify({
				nanoId: nanoId,
				deleted: post.deleted,
				parentNanoId: post.parentNanoId,
			}),
		);
	}

	return new Response(JSON.stringify(post));
}

export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const postId = searchParams.get("postId");
	const { userId } = auth();

	if (postId && userId) {
		await db.execute(
			"UPDATE posts SET deleted = 1 WHERE id = :postId AND userId = :userId",
			{
				postId,
				userId,
			},
		);
	}

	return new Response("OK");
}

export async function PUT(request: Request) {
	const { searchParams } = new URL(request.url);
	const postId = searchParams.get("postId");
	const content = searchParams.get("content");
	const { userId } = auth();

	if (postId && userId && content && content.length < 513) {
		await db.execute(
			"UPDATE posts SET content = :content, edited = 1 WHERE id = :postId AND userId = :userId",
			{
				postId,
				userId,
				content,
			},
		);
	}

	return new Response("OK");
}
