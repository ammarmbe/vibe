import { db } from "@/lib/db";
import { User } from "@/lib/types";
import { auth } from "@clerk/nextjs";
import { nanoid } from "nanoid";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const username = searchParams.get("username");
	const { userId: currentUserId } = auth();

	let user: User | null = null;
	if (username) {
		user = (
			await db.execute(
				"SELECT users.id, users.image, users.bio, users.username, users.name, COUNT(follower_relation.following) AS followers, (SELECT COUNT(*) FROM follower_relation WHERE follower = :currentUserId AND following = users.id) AS followedByUser FROM users LEFT JOIN follower_relation ON follower_relation.following = users.id WHERE users.username = :username GROUP BY users.id",
				{ username, currentUserId },
			)
		).rows[0] as User;
	}

	return new Response(JSON.stringify(user));
}

export async function POST(request: Request) {
	const body = (await request.json()) as {
		data: {
			id: string;
			first_name: string;
			last_name: string;
			email_addresses: [{ email_address: string }];
			image_url: string;
			username: string;
		};
	};

	let username = body.data.username;

	if (!username) {
		username = (
			body.data.email_addresses[0].email_address.split("@")[0] + nanoid(4)
		).toLocaleLowerCase();
	}

	await db.execute(
		"INSERT INTO `users` (id, name, email, image) VALUES (:id, :name, :email, :image)",
		{
			id: body.data.id,
			name: `${body.data.first_name} ${body.data.last_name}`,
			email: body.data.email_addresses[0].email_address,
			username: username,
			image: body.data.image_url,
		},
	);

	return new Response("OK");
}
