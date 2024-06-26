import sql from "@/lib/db";
import dayjs from "dayjs";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await sql(
    "SELECT EXTRACT(epoch FROM createdat) as createdat, nanoid FROM posts WHERE deleted = false ORDER BY id DESC LIMIT 50000",
  );

  return posts.map((post) => ({
    url: `${process.env.NEXT_PUBLIC_URL}/post/${post.nanoid}`,
    lastModified: dayjs.unix(post.createdat).toDate(),
  }));
}
