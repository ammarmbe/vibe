"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import type { Post } from "@/lib/types";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "./post/PostCard";
import Spinner from "./Spinner";

export default function Feed() {
  let feed = useRef<"Home" | "Following">("Home");

  useEffect(() => {
    const localFeed = localStorage.getItem("feed") as "Home" | "Following";
    if (!localFeed) localStorage.setItem("feed", "Home");
    else feed.current = localFeed;
  });

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["homeFeed"],
    queryFn: async ({ pageParam }) =>
      await (
        await fetch(`/api/posts?postId=${pageParam}&feed=${feed.current}`)
      ).json(),
    // eslint-disable-next-line no-unused-vars
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length == 11) {
        return lastPage[lastPage.length - 1].postId;
      } else {
        return undefined;
      }
    },
    enabled: Boolean(feed),
  });

  if (isLoading)
    return (
      <div className="w-full flex h-full items-center justify-center">
        <Spinner size="xl" />
      </div>
    );

  if (data && data?.pages[0].length > 0)
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
          {data.pages.map((page) => {
            return page.map((post: Post) => {
              return <PostCard key={post.postId} post={post} />;
            });
          })}
        </InfiniteScroll>
      </>
    );
  else return <p className="text-foreground/30 text-center">No posts yet...</p>;
}
