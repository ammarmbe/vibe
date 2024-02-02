import { db } from "@/lib/db";
import dayjs from "dayjs";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = (
		await db.execute(
			"SELECT createdAt, nanoId FROM posts WHERE deleted = 0 ORDER BY id DESC LIMIT 50000",
		)
	).rows;

	return posts.map((post) => ({
		url: `${process.env.URL}/post/${post.nanoId}`,
		lastModified: dayjs(new Date(parseInt(post.createdAt) * 1000)).toDate(),
	}));
}
