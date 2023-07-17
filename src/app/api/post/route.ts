import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const parentId = searchParams.get("parentId");
  const { userId } = auth();
  const content = searchParams.get("content");
  const nanoId = searchParams.get("nanoId");

  if (parentId && userId && content && nanoId && content.length < 513) {
    await db.execute(
      "INSERT INTO posts (userId, content, parentId, nanoId) VALUES (:userId, :content, :parentId, :nanoId)",
      {
        userId,
        content,
        parentId,
        nanoId,
      }
    );
  } else {
    return new Response("Invalid request", { status: 400 });
  }

  return new Response("OK");
}
