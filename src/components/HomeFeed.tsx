"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import type { Post } from "@/lib/types";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "./post/PostCard";
import Spinner from "./Spinner";

export default function HomeFeed() {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["homeFeed"],
    queryFn: async ({ pageParam }) =>
      (await axios.get(`/api/home-feed?postId=${pageParam}`)).data,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length == 11) {
        return lastPage[lastPage.length - 1].postId;
      } else {
        return undefined;
      }
    },
  });

  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );

  if (data && data?.pages[0].length > 0)
    return (
      <>
        <InfiniteScroll
          dataLength={data.pages.flatMap((page) => page).length}
          hasMore={hasNextPage || false}
          loader={<h4>Loading...</h4>}
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
  else return <div>no posts yet...</div>;
}
