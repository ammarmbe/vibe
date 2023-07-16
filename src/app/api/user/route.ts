import { db } from "@/lib/db";
import { User } from "@/lib/types";
import { auth } from "@clerk/nextjs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const { userId: currentUserId } = auth();

  let user;
  if (userId) {
    user = (
      await db.execute(
        "SELECT users.id, users.image, users.bio, users.username, users.name, COUNT(follower_relation.following) AS followers, (SELECT COUNT(*) FROM follower_relation WHERE follower = :currentUserId AND following = :userId) AS followedByUser FROM users LEFT JOIN follower_relation ON follower_relation.following = users.id WHERE users.id = :userId",
        { userId, currentUserId }
      )
    ).rows[0] as User;
  }

  return new Response(JSON.stringify(user));
}

export async function POST(request: Request) {
  const body = (await request.json()) as any;

  await db.execute(
    "INSERT INTO `users` (id, name, email, image) VALUES (:id, :name, :email, :image)",
    {
      id: body.data.id,
      name: body.data.first_name + " " + body.data.last_name,
      email: body.data.email_addresses[0].email_address,
      image: body.data.image_url,
    }
  );

  return new Response("OK");
}
