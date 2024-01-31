import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const value = searchParams.get("value");
	const { userId } = auth();

	if (userId) {
		const users = (
			await db.execute(
				"SELECT id, name, username, image FROM users LEFT JOIN follower_relation ON follower_relation.following = users.id WHERE users.username LIKE :value OR users.name LIKE :value GROUP BY users.id ORDER BY COUNT(follower_relation.following) DESC LIMIT 5",
				{ userId, value: `%${value}%` },
			)
		).rows;

		return new Response(JSON.stringify(users));
	}

	return new Response(JSON.stringify([]));
}
