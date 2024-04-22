import sql from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import webpush, { PushSubscription } from "web-push";

webpush.setVapidDetails(
  "https://vibe.ambe.dev",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string,
);

export async function POST(request: NextRequest) {
  const { subscription, userid } = (await request.json()) as {
    subscription: PushSubscription;
    userid: string;
  };

  if (!subscription || !userid) return;

  await sql(
    "INSERT INTO subscriptions (subscription, userid) VALUES ($1, $2) ON CONFLICT DO UPDATE SET subscription = excluded.subscription",
    [JSON.stringify(subscription), userid],
  );

  return NextResponse.json("OK");
}
