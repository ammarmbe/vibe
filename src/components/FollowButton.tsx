"use client";
import { client } from "@/lib/reactQueryProvider";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

export default function FollowButton({
  userId,
  followed,
}: {
  userId: string;
  followed: boolean;
}) {
  const followMutation = useMutation({
    mutationFn: async () =>
      await axios.post(`/api/follow?userId=${userId}&followed=${followed}`),
    onSuccess: () => {
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
      className={`py-1 px-2.5 border mb-4 rounded-md text-sm ${
        followed
          ? `bg-main text-white border-main/50 hover:bg-main/90`
          : `border-main/20 hover:bg-main/5 hover:border-main/50 text-main`
      }`}
      onClick={() => followMutation.mutate()}
    >
      {followed ? "Following" : "Follow"}
    </button>
  );
}