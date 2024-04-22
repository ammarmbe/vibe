import React, { Suspense } from "react";
import { Metadata } from "next/types";
import sanitize from "sanitize-html";
import Header from "@/components/Header/Header";
import getQueryClient from "@/lib/utils";
import Post from "@/components/PostPage/Post";
import Spinner from "@/components/Spinner";

interface Props {
  params: {
    nanoid: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { decode } = await import("he");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/post?nanoid=${params.nanoid}`,
  );
  const post = await res.json();

  return {
    title: post.name ? `${post.name} on Vibe` : "Vibe",
    description:
      "Vibe is a social media web app all about connecting with people who share your interests, and it's the perfect place to share your thoughts, photos, and videos.",
    metadataBase: new URL("https://vibe.ambe.dev"),
    openGraph: {
      description: post.content
        ? decode(sanitize(post.content, { allowedTags: [] }))
        : "Vibe is a social media web app all about connecting with people who share your interests, and it's the perfect place to share your thoughts, photos, and videos.",
    },
  };
}

export default async function Page({ params }: Props) {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["postPage", params.nanoid],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/post?nanoid=${params.nanoid}`,
      );
      return res.json();
    },
  });

  queryClient.prefetchInfiniteQuery({
    queryKey: ["comments", params.nanoid],
    queryFn: async ({ pageParam = 2147483647 }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/posts/parentnanoid?postid=${pageParam}&parentnanoid=${params.nanoid}`,
      );
      return res.json();
    },
  });

  return (
    <main className="max-w-2xl h-full flex flex-col w-full mx-auto px-2.5">
      <Header />
      <Suspense
        fallback={
          <div className="w-full flex h-full items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <Post nanoid={params.nanoid} />
      </Suspense>
    </main>
  );
}
