"use client";
import FollowButton from "@/components/FollowButton";
import Spinner from "@/components/Spinner";
import Header from "@/components/header/Header";
import PostCard from "@/components/post/PostCard";
import { Post, User } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
  params: {
    username: string;
  };
}

export default function Page({ params }: Props) {
  const username = params.username;
  const { userId: currentUserId } = useAuth();

  const { data: user } = useQuery({
    queryKey: ["user", username],
    queryFn: async () =>
      (await (await fetch(`/api/user?username=${username}`)).json()) as User,
  });

  const {
    data: userPosts,
    hasNextPage,
    fetchNextPage,
    isLoading: postsLoading,
  } = useInfiniteQuery({
    queryKey: ["userPosts", user?.id],
    queryFn: async ({ pageParam }) =>
      await (
        await fetch(`/api/posts/userId?userId=${user?.id}&postId=${pageParam}`)
      ).json(),
    // eslint-disable-next-line no-unused-vars
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length == 11) {
        return lastPage[lastPage.length - 1].postId;
      } else {
        return undefined;
      }
    },
    enabled: Boolean(user),
  });

  function formatFollowerCount() {
    if (user) {
      const followerCount = parseInt(user.followers);
      if (followerCount >= 1000000) {
        return `${("00" + followerCount / 1000000).slice(-3)}M`;
      } else if (followerCount >= 1000) {
        return `${("00" + followerCount / 1000).slice(-3)}K`;
      } else {
        return ("000" + followerCount).slice(-4);
      }
    }
  }

  return (
    <main className="max-w-3xl w-full mx-auto px-2.5">
      <Header />
      {user && (
        <div
          style={{ gridTemplateColumns: "auto 1fr" }}
          className="rounded-md grid gap-x-2.5 border p-2.5 mb-2.5 shadow-sm"
        >
          <Image
            src={user.image}
            alt={`${user.name}'s profile picture`}
            width={34}
            height={34}
            className={`rounded-full ${!user.bio && `self-center`}`}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <div className={`flex-grow ${!user.bio && `self-center`}`}>
                <h2 className="font-semibold text-lg leading-none">
                  {user.name}
                </h2>
                <p className="leading-none text-foreground/70">
                  @{user.username}
                </p>
                <p className={`text-sm mt-1.5 empty:mt-0`}>{user.bio}</p>
              </div>
              <div className="flex flex-col h-full justify-between items-center">
                <p className="font-bold !h-[34px] flex items-center text-center text-lg leading-none">
                  {formatFollowerCount()}
                </p>
                {currentUserId == user.id ? (
                  <a
                    href="/edit-user"
                    className="py-1 px-3.5 border w-fit h-fit rounded-md text-xs hover:bg-accent hover:border-ring transition-colors"
                  >
                    Edit
                  </a>
                ) : (
                  <FollowButton
                    userId={user.id}
                    username={user.username}
                    followed={parseInt(user.followedByUser) == 1}
                  />
                )}
              </div>
            </div>
          </div>
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
        <p className="text-ring/70 text-center">
          This user hasn&apos;t posted yet
        </p>
      )}
    </main>
  );
}
