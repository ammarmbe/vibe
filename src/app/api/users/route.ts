import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const value = searchParams.get("value");
	const { userId } = auth();

	if (userId) {
		if (value) {
			const users = (
				await db.execute(
					"SELECT id, name, username, image FROM users LEFT JOIN follower_relation ON follower_relation.following = users.id AND follower_relation.follower = :userId WHERE users.username LIKE :value OR users.name LIKE :value GROUP BY users.id LIMIT 5",
					{ userId, value: `%${value}%` },
				)
			).rows;

			return new Response(JSON.stringify(users));
		}

		const users = (
			await db.execute(
				"SELECT id, name, username, image FROM users LEFT JOIN follower_relation ON follower_relation.following = users.id AND follower_relation.follower = :userId GROUP BY users.id ORDER BY COALESCE(follower_relation.follower, '') = :userId LIMIT 5",
				{ userId },
			)
		).rows;

		return new Response(JSON.stringify(users));
	}

	return new Response(JSON.stringify([]));
}
