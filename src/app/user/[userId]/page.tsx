"use client";
import FollowButton from "@/components/FollowButton";
import Spinner from "@/components/Spinner";
import Header from "@/components/header/Header";
import PostCard from "@/components/post/PostCard";
import { Post, User } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
  params: {
    userId: string;
  };
}

export default function Page({ params }: Props) {
  const userId = params.userId;
  const { isSignedIn } = useAuth();

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () =>
      (await axios.get(`/api/user?userId=${userId}`)).data as User,
  });

  const {
    data: userPosts,
    hasNextPage,
    fetchNextPage,
    isLoading: postsLoading,
  } = useInfiniteQuery({
    queryKey: ["userPosts", userId],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get(
          `/api/posts/userId?userId=${user?.id}&postId=${pageParam}`
        )
      ).data,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length == 11) {
        return lastPage[lastPage.length - 1].postId;
      } else {
        return undefined;
      }
    },
    enabled: !!user,
  });

  return (
    <main className="max-w-3xl w-full mx-auto px-2.5">
      <Header />
      {user && (
        <div
          style={{
            gridTemplateColumns: "auto 1fr auto",
            gridTemplateRows: "auto auto",
          }}
          className="rounded-md grid gap-x-2.5 border p-2.5 mb-2.5 shadow-sm"
        >
          <Image
            src={user.image}
            alt={`${user.name}'s profile picture`}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col self-center">
            <h2 className="font-semibold text-lg leading-none">{user.name}</h2>
            <p className="leading-none text-black/70">@{user.username}</p>
          </div>
          {!isSignedIn ? (
            <div></div>
          ) : (
            <FollowButton
              userId={user.id}
              followed={parseInt(user.followedByUser) == 1}
            />
          )}
          <div></div>
          <p className="text-sm">{user.bio} test test test</p>
        </div>
      )}
      {postsLoading ? (
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
            return page.map((post: Post) => {
              return <PostCard key={post.postId} post={post} />;
            });
          })}
        </InfiniteScroll>
      ) : (
        <p className="text-ring/70 text-center">This user hasn't posted yet</p>
      )}
    </main>
  );
}
