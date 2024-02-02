import { db } from "@/lib/db";
import { MetadataRoute } from "next";

export async function generateSitemaps() {
	const { total } = (
		await db.execute("SELECT COUNT(*) as total FROM posts WHERE deleted = 0")
	).rows[0];

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
	const posts = (
		await db.execute(
			`SELECT createdAt, nanoId FROM posts WHERE id BETWEEN ${start} AND ${end} AND deleted = 0 ORDER BY id DESC`,
		)
	).rows;

	return posts.map((post) => ({
		url: `${process.env.URL}/post/${post.nanoId}`,
		lastModified: post.createdAt,
	}));
}
