"use client";
import { Post, Repost } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "../PostCard/PostCard";
import Spinner from "../Spinner";

export default function Page({ userid }: { userid: string }) {
  const {
    data: userPosts,
    hasNextPage,
    fetchNextPage,
    isLoading: postsLoading,
  } = useInfiniteQuery({
    queryKey: ["userPosts", userid],
    queryFn: async ({ pageParam = 2147483647 }) => {
      const res = await fetch(
        `/api/posts/userid?userid=${userid}&postid=${pageParam}`,
      );
      return res.json();
    },
    getNextPageParam: (lastPage, _pages) => {
      if (lastPage?.length >= 11) {
        return lastPage[lastPage.length - 1].postid;
      }
      return undefined;
    },
  });

  return postsLoading ? (
    <div className="w-full flex items-center justify-center">
      <Spinner size="xl" />
    </div>
  ) : userPosts && userPosts.pages[0].length > 0 ? (
    <InfiniteScroll
      dataLength={userPosts.pages.flatMap((page) => page).length}
      hasMore={hasNextPage || false}
      loader={
        <div className="w-full flex items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
      endMessage={<p className="text-ring/70 text-center">No more posts</p>}
      next={fetchNextPage}
      className="flex flex-col gap-2.5 pb-2.5"
    >
      {userPosts.pages.map((page) => {
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
                key={post.postid + ("repostcreatedat" in post ? "repost" : "")}
                post={post}
              />
            );
          });
      })}
    </InfiniteScroll>
  ) : (
    <p className="text-ring/70 text-center">This user hasn&apos;t posted yet</p>
  );
}
