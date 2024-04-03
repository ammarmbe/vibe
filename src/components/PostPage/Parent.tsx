"use client";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function Parent({
  nanoid,
  childDeleted,
}: {
  nanoid: string;
  childDeleted: boolean;
}) {
  const { data: post, isLoading } = useQuery({
    queryKey: ["postPage", nanoid],
    queryFn: async () => {
      const res = await fetch(`/api/post?nanoid=${nanoid}`);
      return res.json() as Promise<Post>;
    },
  });

  if ((post?.deleted && childDeleted) || isLoading) {
    return null;
  }

  if (post)
    return (
      <div className="flex items-center justify-center w-full">
        <div className="w-full max-w-2xl">
          {post.deleted ? (
            <div className="text-foreground/30 text-sm w-full p-2.5 text-center">
              This post has been deleted
            </div>
          ) : (
            <Link
              href={`/post/${post.nanoid}`}
              className="border peer text-left hover:border-ring w-full transition-colors cursor-pointer hover:bg-accent border-b-0 rounded-t-md p-2.5 gap-1.5 flex"
            >
              <Link className="flex-none h-fit" href={`/user/${post.username}`}>
                <Image
                  src={post.image}
                  width={32}
                  height={32}
                  className="rounded-full"
                  alt={`${post.name}'s profile picture}`}
                />
              </Link>
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-baseline w-full">
                  <h2 className="leading-tight font-medium">
                    <Link href={`/user/${post.username}`}>{post.name}</Link>
                  </h2>
                  <time
                    dateTime={dayjs(
                      new Date(parseInt(post.createdat) * 1000),
                    ).format("YYYY-MM-DD HH:MM")}
                    className="text-sm leading-tight text-muted-foreground"
                  >
                    {dayjs(new Date(parseInt(post.createdat) * 1000)).fromNow()}
                  </time>
                </div>
                <Link
                  className="text-sm hover:underline text-muted-foreground leading-tight w-fit"
                  href={`/user/${post.username}`}
                >
                  @{post.username}
                </Link>
                <p
                  className="mt-2.5 text-sm"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </Link>
          )}
          <div className="border-t w-full border-dashed peer-hover:border-solid peer-hover:border-ring transition-colors" />
        </div>
      </div>
    );
}
