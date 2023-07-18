"use client";
import LikeButton from "@/components/post/LikeButton";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Header from "@/components/header/Header";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "@/components/Spinner";
import { Post } from "@/lib/types";
import PostCard from "@/components/post/PostCard";
import NewComment from "@/components/NewComment";
import { useRouter } from "next/navigation";
dayjs.extend(relativeTime);

interface Props {
  params: {
    nanoId: string;
  };
}

export default function Page({ params }: Props) {
  const nanoId = params.nanoId;
  const { data: mainPost } = useQuery({
    queryKey: ["post", nanoId],
    queryFn: async () =>
      (await axios.get(`/api/post/nanoid?nanoId=${nanoId}`)).data,
  });
  const { push } = useRouter();

  const { data: parentPost, isLoading } = useQuery({
    queryKey: ["post", mainPost?.parentId],
    queryFn: async () =>
      (await axios.get(`/api/post/id?postId=${mainPost.parentId}`)).data,
    enabled: !!mainPost && !!mainPost.parentId,
  });

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isLoading: commentsLoading,
  } = useInfiniteQuery({
    queryKey: ["comments"],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get(
          `/api/posts/parentId?postId=${pageParam}&parentId=${mainPost.postId}`
        )
      ).data,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length == 11) {
        return lastPage[lastPage.length - 1].postId;
      } else {
        return undefined;
      }
    },
    enabled: !!mainPost,
  });

  const commentOrComments = mainPost?.comments == 1 ? "Comment" : "Comments";
  // isLoading will always be true if the query is disabled
  const parentLoading = isLoading && mainPost?.parentId;

  return (
    <main className="max-w-3xl w-full mx-auto px-2.5">
      <Header />
      {parentLoading ? (
        <div className="w-full justify-center flex">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          {parentPost && (
            <>
              <button
                onClick={() => push(`/post/${parentPost.nanoId}`)}
                className="border peer text-left hover:border-ring w-full transition-colors cursor-pointer hover:bg-accent border-b-0 rounded-t-md p-2.5 gap-1.5 flex"
              >
                <a className="flex-none" href={`/user/${parentPost.username}`}>
                  <Image
                    src={parentPost.image}
                    width={33}
                    height={33}
                    className="rounded-full"
                    alt={`${parentPost.name}'s profile picture}`}
                  />
                </a>
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-baseline w-full">
                    <h2 className="leading-none font-medium">
                      <a href={`/user/${parentPost.username}`}>
                        {parentPost.name}
                      </a>
                    </h2>
                    <p className="text-sm leading-none text-foreground/70">
                      {dayjs(new Date(parentPost.createdAt * 1000)).fromNow()}
                    </p>
                  </div>
                  <a
                    className="text-sm hover:underline text-foreground/70 leading-none w-fit"
                    href={`/user/${parentPost.username}`}
                  >
                    @{parentPost.username}
                  </a>
                  <p className="mt-2.5 text-sm">{parentPost.content}</p>
                </div>
              </button>
              <div className="border-t w-full border-dashed peer-hover:border-solid peer-hover:border-ring transition-colors"></div>
            </>
          )}
          {!mainPost ? (
            <div className="w-full justify-center flex">
              <Spinner size="xl" />
            </div>
          ) : (
            <>
              <article
                className={`mb-2.5 ${
                  parentPost
                    ? `rounded-b-md border border-t-0 z-10 relative`
                    : `rounded-md border`
                } p-2.5 gap-1.5 flex shadow-sm`}
              >
                <a className="flex-none" href={`/user/${mainPost.username}`}>
                  <Image
                    src={mainPost.image}
                    width={33}
                    height={33}
                    className="rounded-full"
                    alt={`${mainPost.name}'s profile picture}`}
                  />
                </a>
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-baseline w-full">
                    <h2 className="leading-tight text-lg font-medium truncate inline-block max-w-[200px]">
                      <a href={`/user/${mainPost.username}`}>{mainPost.name}</a>
                    </h2>
                    <p className="leading-none text-sm flex-none text-foreground/70">
                      {dayjs(new Date(mainPost.createdAt * 1000)).format(
                        "DD/MM/YYYY, HH:mm A"
                      )}
                    </p>
                  </div>
                  <a
                    className="hover:underline text-foreground/70 leading-none w-fit"
                    href={`/user/${mainPost.username}`}
                  >
                    @{mainPost.username}
                  </a>
                  <p className="mt-2.5 mb-4">{mainPost.content}</p>
                  <div className="flex gap-1.5">
                    <LikeButton
                      count={mainPost.likes}
                      liked={mainPost.likedByUser == 0 ? false : true}
                      postId={mainPost.postId}
                      nanoId={mainPost.nanoId}
                      userId={mainPost.userId}
                      content={mainPost.content}
                    />
                    <a
                      href={`/post/${mainPost.nanoId}`}
                      className="text-xs px-2.5 py-1 border rounded-md transition-colors hover:border-ring hover:bg-accent"
                    >
                      {mainPost.comments} {commentOrComments}
                    </a>
                  </div>
                </div>
              </article>
              <NewComment
                parentId={mainPost.postId}
                nanoId={mainPost.nanoId}
                userId={mainPost.userId}
              />
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
                    <p className="text-foreground/30 text-center">
                      No more replies
                    </p>
                  }
                  next={fetchNextPage}
                  className="flex flex-col gap-2.5 pb-2.5"
                >
                  {comments.pages.map((page) => {
                    return page.map((post: Post) => {
                      return <PostCard key={post.postId} post={post} />;
                    });
                  })}
                </InfiniteScroll>
              ) : (
                <p className="text-foreground/30 text-center">
                  No replies yet...
                </p>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
