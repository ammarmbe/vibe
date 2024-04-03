import sql from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const currentUserId = searchParams.get("userid");
  const bio = searchParams.get("bio");
  const { userId } = auth();

  const existingUser = await sql(
    "SELECT * FROM users WHERE username = $1 AND id != $2",
    [username, currentUserId],
  );

  if (existingUser.length > 0) {
    return new Response("Username already exists", {
      status: 409,
    });
  }

  await sql("UPDATE users SET username = $1, bio = $2 WHERE id = $3", [
    username,
    bio,
    userId,
  ]);

  return new Response("OK");
}
