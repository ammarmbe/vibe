import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import webpush, { PushSubscription } from "web-push";

webpush.setVapidDetails(
	"https://vibe.ambe.dev",
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
	process.env.VAPID_PRIVATE_KEY as string,
);

export async function POST(request: NextRequest) {
	const { subscription, userId } = (await request.json()) as {
		subscription: PushSubscription;
		userId: string;
	};

	if (!subscription || !userId) return;

	await db.execute(
		"INSERT INTO subscriptions (subscription, userId) VALUES (:subscription, :userId) ON DUPLICATE KEY UPDATE subscription = :subscription",
		{
			subscription: JSON.stringify(subscription),
			userId,
		},
	);

	return NextResponse.json("OK");
}
