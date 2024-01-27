import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url);
	const username = searchParams.get("username");
	const currentUserId = searchParams.get("userId");
	const bio = searchParams.get("bio");
	const { userId } = auth();

	const existingUser = (
		await db.execute(
			"SELECT * FROM users WHERE username = :username AND id != :userId",
			{
				username,
				userId: currentUserId,
			},
		)
	).rows;

	if (existingUser.length > 0) {
		return new Response("Username already exists", {
			status: 409,
		});
	}

	await db.execute(
		"UPDATE users SET username = :username, bio = :bio WHERE id = :userId",
		{
			username,
			bio,
			userId,
		},
	);

	return new Response("OK");
}
