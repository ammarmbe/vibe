import sql from "@/lib/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const users = await sql(
        "SELECT id, username FROM users ORDER BY id DESC LIMIT 50000"
    );

    return users.map((user) => ({
        url: `${process.env.NEXT_PUBLIC_URL}/user/${user.username}`,
        lastModified: new Date(),
    }));
}
