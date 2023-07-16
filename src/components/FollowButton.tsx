"use client";
import { client } from "@/lib/reactQueryProvider";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

export default function FollowButton({
  userId,
  followed,
}: {
  userId: string;
  followed: boolean;
}) {
  const { isSignedIn } = useAuth();
  const { push } = useRouter();

  const notificationMutation = useMutation({
    mutationFn: async () =>
      await axios.post(`/api/notification/followedUser?userId=${userId}`),
    onSuccess: () => {
      client.invalidateQueries(["notifications", userId]);
    },
  });

  const followMutation = useMutation({
    mutationFn: async () =>
      await axios.post(`/api/follow?userId=${userId}&followed=${followed}`),
    onSuccess: () => {
      !followed && notificationMutation.mutate();

      client.setQueryData(["user", userId], (data: any) => {
        if (data) {
          return {
            ...data,
            followedByUser: followed ? 0 : 1,
            followers: followed
              ? parseInt(data.followers) - 1
              : parseInt(data.followers) + 1,
          };
        }
      });
    },
  });

  return (
    <button
      className={`py-1 px-2.5 border w-fit h-fit rounded-md text-xs ${
        followed
          ? `bg-main text-white border-main/50 hover:bg-main/90`
          : `border-main/20 hover:bg-main/10 dark:border-main/30 hover:border-main/50 text-main`
      }`}
      onClick={
        isSignedIn ? () => followMutation.mutate() : () => push("/sign-up")
      }
    >
      {followed ? "Following" : "Follow"}
    </button>
  );
}
