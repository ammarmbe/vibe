"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { nanoid } from "nanoid";
import { Post } from "@/lib/types";
import InfiniteScroll from "react-infinite-scroll-component";

export default function HomeFeed() {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
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

  if (data && data?.pages[0].length > 0)
    return (
      <>
        <InfiniteScroll
          dataLength={data.pages.flatMap((page) => page).length}
          hasMore={hasNextPage || false}
          loader={<h4>Loading...</h4>}
          next={fetchNextPage}
        >
          {data.pages.map((page) => {
            return page.map((post: Post) => {
              return (
                <div key={nanoid()}>
                  <p>
                    {post.content} {post.postId}
                  </p>
                </div>
              );
            });
          })}
        </InfiniteScroll>
      </>
    );
  else return <div>no posts yet...</div>;
}
