import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function POST() {
	const { userId } = auth();

	if (userId) {
		await db.execute(
			"UPDATE notifications SET `read` = true WHERE notified = :userId",
			{ userId },
		);
	}

	return new Response("OK");
}
