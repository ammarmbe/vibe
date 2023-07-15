"use client";
import Header from "@/components/header/Header";
import { User } from "@/lib/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

interface Props {
  params: {
    userId: string;
  };
}

export default function Page({ params }: Props) {
  const userId = params.userId;

  const { data } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () =>
      (await axios.get(`/api/user?userId=${userId}`)).data as User,
  });

  const { data: userPosts } = useInfiniteQuery({
    queryKey: ["userPosts", userId],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get(
          `/api/posts/userId?userId=${data?.id}&postId=${pageParam}`
        )
      ).data,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length == 11) {
        return lastPage[lastPage.length - 1].postId;
      } else {
        return undefined;
      }
    },
    enabled: !!data,
  });

  return (
    <main className="max-w-3xl w-full mx-auto px-2.5">
      <Header />
      {data && (
        <div className="rounded-md border p-2.5">
          <Image
            src={data.image}
            alt={`${data.name}'s profile picture`}
            width={40}
            height={40}
            className="rounded-full"
          />
          <h2 className="font-semibold">{data.name}</h2>
        </div>
      )}
    </main>
  );
}
