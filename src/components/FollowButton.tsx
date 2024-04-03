"use client";
import { User } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function FollowButton({
  userid,
  followed,
  username,
  className,
}: {
  userid: string;
  followed: boolean;
  username: string;
  className?: string;
}) {
  const { isSignedIn } = useAuth();
  const { push } = useRouter();
  const { userid: currentUserId } = useAuth();
  const [following, setFollowing] = React.useState(followed);
  const queryClient = useQueryClient();

  const notificationMutation = useMutation({
    mutationFn: async () =>
      await fetch(`/api/notification/followedUser?userid=${userid}`, {
        method: "POST",
      }),
  });

  const followMutation = useMutation({
    mutationFn: async () =>
      await fetch(`/api/follow?userid=${userid}&followed=${followed}`, {
        method: "POST",
      }),
    onMutate: () => {
      setFollowing(!following);
      queryClient.setQueryData(["user", username], (data: User | undefined) => {
        if (data) {
          return {
            ...data,
            followers: followed
              ? (parseInt(data.followers) - 1).toString()
              : (parseInt(data.followers) + 1).toString(),
            followedbyuser: followed ? "0" : "1",
          };
        }
        return data;
      });
    },
    onError: () => {
      setFollowing(!following);
      queryClient.invalidateQueries(["user", username]);
    },
    onSuccess: () => {
      if (userid !== currentUserId && following) notificationMutation.mutate();
    },
  });

  return (
    <button
      type="button"
      aria-label="Follow"
      disabled={followMutation.isLoading}
      className={`${className} py-1 px-2.5 border w-fit h-fit rounded-md text-xs flex items-end justify-center gap-1 leading-[1.2] ${
        following
          ? "bg-main text-white border-main/50 hover:bg-main/90"
          : "border-main/20 hover:bg-main/10 dark:border-main/50 hover:border-main/50 text-main"
      }`}
      onClick={
        isSignedIn ? () => followMutation.mutate() : () => push("/sign-up")
      }
    >
      <div className="h-4 w-4 flex items-center justify-center">
        <UserPlus2 size={12} />
      </div>
      <span className="h-fit">{following ? "Following" : "Follow"}</span>
    </button>
  );
}
