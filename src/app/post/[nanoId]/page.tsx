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
              <a
                href={`/post/${parentPost.nanoId}`}
                className="border peer hover:border-ring transition-colors cursor-pointer hover:bg-accent border-b-0 rounded-t-md p-2.5 gap-1.5 flex"
              >
                <a className="flex-none" href={`/user/${parentPost.userId}`}>
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
                      {parentPost.name}
                    </h2>
                    <p className="text-sm leading-none text-black/70">
                      {dayjs(new Date(parentPost.createdAt * 1000)).fromNow()}
                    </p>
                  </div>
                  <a
                    className="text-sm hover:underline text-black/70 leading-none w-fit"
                    href={`/user/${parentPost.userId}`}
                  >
                    @{parentPost.username}
                  </a>
                  <p className="mt-2.5 text-sm">{parentPost.content}</p>
                </div>
              </a>
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
                <a className="flex-none" href={`/user/${mainPost.userId}`}>
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
                    <h2 className="leading-none text-lg font-medium">
                      {mainPost.name}
                    </h2>
                    <p className="leading-none text-sm text-black/70">
                      {dayjs(new Date(mainPost.createdAt * 1000)).format(
                        "DD/MM/YYYY, HH:mm A"
                      )}
                    </p>
                  </div>
                  <a
                    className="hover:underline text-black/70 leading-none w-fit"
                    href={`/user/${mainPost.userId}`}
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
                    />
                    <a
                      href={`/post/${mainPost.nanoId}`}
                      className="text-xs px-2.5 py-1 border rounded-md hover:border-ring hover:bg-accent"
                    >
                      {mainPost.comments} {commentOrComments}
                    </a>
                  </div>
                </div>
              </article>
              <NewComment parentId={mainPost.postId} nanoId={mainPost.nanoId} />
              {comments && comments.pages[0].length > 0 ? (
                <InfiniteScroll
                  dataLength={comments.pages.flatMap((page) => page).length}
                  hasMore={hasNextPage || false}
                  loader={<Spinner size="md" />}
                  endMessage={
                    <p className="text-ring/70 text-center">No more replies</p>
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
                <p className="text-ring/70 text-center">No replies yet...</p>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
