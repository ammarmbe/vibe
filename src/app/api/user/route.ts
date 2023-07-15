import { db } from "@/lib/db";
import { User } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  let user;
  if (userId) {
    user = (
      await db.execute("SELECT * FROM users WHERE id = :userId", { userId })
    ).rows[0] as User;
  }

  return new Response(JSON.stringify(user));
}
