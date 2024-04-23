import sql from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const value = searchParams.get("value");
  const { userId } = auth();

  if (userId) {
    if (value) {
      const users = await sql(
        "SELECT id, name, username, image FROM users LEFT JOIN follower_relation ON follower_relation.following = users.id AND follower_relation.follower = $1 WHERE LOWER(users.username) LIKE $2 OR LOWER(users.name) LIKE $2 GROUP BY users.id LIMIT 5",
        [userId, `%${value.toLowerCase()}%`],
      );

      return new Response(JSON.stringify(users));
    }

    const users = await sql(
      "SELECT id, name, username, image FROM users LEFT JOIN follower_relation ON follower_relation.following = users.id AND follower_relation.follower = $1 GROUP BY users.id, follower_relation.follower ORDER BY COALESCE(follower_relation.follower, '') = $1 LIMIT 5",
      [userId],
    );

    return new Response(JSON.stringify(users));
  }

  return new Response(JSON.stringify([]));
}
