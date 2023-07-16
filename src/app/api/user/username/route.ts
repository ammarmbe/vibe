import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  let bio = searchParams.get("bio");
  const { userId } = auth();

  const existingUser = (
    await db.execute("SELECT * FROM users WHERE username = :username", {
      username,
    })
  ).rows;

  console.log(existingUser);

  if (existingUser.length > 0) {
    return new Response(JSON.stringify({ error: "Username already taken" }), {
      status: 409,
    });
  }

  await db.execute(
    "UPDATE users SET username = :username, bio = :bio WHERE id = :userId",
    {
      username,
      bio,
      userId,
    }
  );

  return new Response("OK");
}
