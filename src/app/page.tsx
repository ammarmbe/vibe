import Feed from "@/components/Feed";
import Header from "@/components/Header/Header";
import Spinner from "@/components/Spinner";
const NewPost = dynamic(() => import("@/components/NewPost"), { ssr: false });
import getQueryClient from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = auth();
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery(
    [
      "homeFeed",
      searchParams.feed === "Home" || searchParams.feed === "Following"
        ? searchParams.feed
        : "Home",
    ],
    async ({ pageParam = 2147483647 }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/posts?postid=${pageParam}&feed=${
          searchParams.feed === "Home" || searchParams.feed === "Following"
            ? searchParams.feed
            : "Home"
        }`,
      );
      return res.json();
    },
  );

  return (
    <main className="max-w-2xl h-full flex flex-col w-full mx-auto px-2.5">
      <Header
        feed={
          searchParams.feed === "Home" || searchParams.feed === "Following"
            ? searchParams.feed
            : "Home"
        }
      />
      {userId && <NewPost />}
      <Suspense
        fallback={
          <div className="w-full flex h-full items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <Feed
          feed={
            searchParams.feed === "Home" || searchParams.feed === "Following"
              ? searchParams.feed
              : "Home"
          }
        />
      </Suspense>
    </main>
  );
}
