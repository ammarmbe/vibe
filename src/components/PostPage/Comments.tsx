"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import Spinner from "../Spinner";
import NewComment from "../NewComment";
import { useAuth } from "@clerk/nextjs";
import InfiniteScroll from "react-infinite-scroll-component";
import { Post } from "@/lib/types";
import PostCard from "../PostCard/PostCard";

export function Comments({ post }: { post: Post }) {
  const { userId } = useAuth();

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isLoading: commentsLoading,
  } = useInfiniteQuery({
    queryKey: ["comments", post.nanoid],
    queryFn: async ({ pageParam = 2147483647 }) => {
      const res = await fetch(
        `/api/posts/parentnanoid?postid=${pageParam}&parentnanoid=${post.nanoid}`,
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

  return (
    <>
      {userId && (
        <NewComment
          parentnanoid={post.nanoid}
          userid={post.userid}
          parentPostId={post.postid}
          parentPostUsername={post.username}
        />
      )}
      {commentsLoading ? (
        <div className="w-full flex items-center justify-center">
          <Spinner size="xl" />
        </div>
      ) : comments && comments.pages[0].length > 0 ? (
        <InfiniteScroll
          dataLength={comments.pages.flatMap((page) => page).length}
          hasMore={hasNextPage || false}
          loader={
            <div className="w-full flex items-center justify-center">
              <Spinner size="xl" />
            </div>
          }
          endMessage={
            <p className="text-foreground/30 text-center">No more replies</p>
          }
          next={fetchNextPage}
          className="flex flex-col gap-2.5 pb-2.5"
        >
          {comments.pages.map((page) => {
            return page.map((post: Post) => {
              return <PostCard key={post.postid} post={post} />;
            });
          })}
        </InfiniteScroll>
      ) : (
        <p className="text-foreground/30 text-center">No replies yet...</p>
      )}
    </>
  );
}
