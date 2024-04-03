import sql from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function POST() {
  const { userId } = auth();

  if (userId) {
    await sql("UPDATE notifications SET `read` = true WHERE notified = $1", [
      userId,
    ]);
  }

  return new Response("OK");
}
