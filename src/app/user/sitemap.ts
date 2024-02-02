import { db } from "@/lib/db";
import { MetadataRoute } from "next";

export async function generateSitemaps() {
	const { total } = (await db.execute("SELECT COUNT(*) as total FROM users"))
		.rows[0];

	return Array.from({ length: total.length }, (_, i) => {
		return {
			id: i,
		};
	});
}

export default async function sitemap({
	id,
}: {
	id: number;
}): Promise<MetadataRoute.Sitemap> {
	const start = id * 50000;
	const end = start + 50000;
	const users = (
		await db.execute(
			`SELECT id, username FROM users WHERE id BETWEEN ${start} AND ${end} ORDER BY id DESC`,
		)
	).rows;

	return users.map((user) => ({
		url: `${process.env.URL}/user/${user.username}`,
		lastModified: new Date(),
	}));
}
