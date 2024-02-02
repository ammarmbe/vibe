import { db } from "@/lib/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const users = (
		await db.execute(
			"SELECT id, username FROM users ORDER BY id DESC LIMIT 50000",
		)
	).rows;

	return users.map((user) => ({
		url: `${process.env.URL}/user/${user.username}`,
		lastModified: new Date(),
	}));
}
