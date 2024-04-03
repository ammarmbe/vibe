"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Post, Repost } from "@/lib/types";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "./PostCard/PostCard";
import Spinner from "./Spinner";

export default function Feed({ feed }: { feed: "Home" | "Following" }) {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["homeFeed", feed],
    queryFn: async ({ pageParam = 2147483647 }) => {
      const res = await fetch(`/api/posts?postid=${pageParam}&feed=${feed}`);
      return res.json();
    },
    getNextPageParam: (lastPage, _pages) => {
      if (lastPage?.length >= 11) {
        return lastPage[lastPage.length - 1].postid;
      }
      return undefined;
    },
    enabled: Boolean(feed),
  });

  if (isLoading)
    return (
      <div className="w-full flex h-full items-center justify-center">
        <Spinner size="xl" />
      </div>
    );

  if (data?.pages[0] && data?.pages[0].length > 0)
    return (
      <>
        <InfiniteScroll
          dataLength={data.pages.flatMap((page) => page).length}
          hasMore={hasNextPage || false}
          loader={
            <div className="flex w-full justify-center">
              <Spinner size="md" />
            </div>
          }
          endMessage={
            <p className="text-foreground/30 text-center">No more posts</p>
          }
          next={fetchNextPage}
          className="flex flex-col gap-2.5 pb-2.5"
        >
          {data.pages.map((page: (Post | Repost)[]) => {
            return page
              .sort((a: Post | Repost, b: Post | Repost) => {
                let acreatedat: string;
                let bcreatedat: string;

                if ("repostername" in a) {
                  acreatedat = a.repostcreatedat;
                } else {
                  acreatedat = a.createdat;
                }

                if ("repostername" in b) {
                  bcreatedat = b.repostcreatedat;
                } else {
                  bcreatedat = b.createdat;
                }

                return parseInt(bcreatedat) - parseInt(acreatedat);
              })
              .map((post: Post | Repost) => {
                return (
                  <PostCard
                    key={
                      post.postid +
                      ("repostcreatedat" in post
                        ? `repost${post.reposterusername}`
                        : "")
                    }
                    post={post}
                  />
                );
              });
          })}
        </InfiniteScroll>
      </>
    );
  return <p className="text-foreground/30 text-center">No posts yet...</p>;
}
