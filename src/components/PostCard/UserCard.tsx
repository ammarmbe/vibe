"use client";
import { useQuery } from "@tanstack/react-query";
const FollowButton = dynamic(() => import("../FollowButton"), {
  ssr: false,
});
import { User } from "@/lib/types";
import Image from "next/image";
import Spinner from "../Spinner";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { UserPlus2 } from "lucide-react";
import dynamic from "next/dynamic";

export default function UserCard({ username }: { username: string }) {
  const { userId: currentUserId } = useAuth();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user", username],
    queryFn: async () =>
      (await (await fetch(`/api/user?username=${username}`)).json()) as User,
  });

  if (userLoading) {
    return (
      <div className="flex h-[100px] items-center justify-center w-[150px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user)
    return (
      <>
        <svg
          width="9"
          height="4"
          viewBox="0 0 9 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-[-4px] left-[50%] transform translate-x-[-50%]"
        >
          <title>arrow</title>
          <path d="M4.49999 0L9 4H0L4.49999 0Z" className="fill-border" />
          <path
            d="M4.49996 1.32813L7.50001 4H1.50001L4.49996 1.32813Z"
            className="fill-popover"
          />
        </svg>
        <div className="flex flex-col gap-2.5">
          <div
            style={{ gridTemplateColumns: "auto 1fr" }}
            className="grid gap-x-2.5 mr-2"
          >
            <Link href={`/user/${user.username}`}>
              <Image
                src={user.image}
                alt={`${user.name}'s profile picture`}
                width={24}
                height={24}
                className={`rounded-full ${!user.bio && "self-center"}`}
              />
            </Link>
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <div className={`flex-grow ${!user.bio && "self-center"}`}>
                  <h2 className="font-semibold text-sm leading-tight text-foreground">
                    <Link href={`/user/${user.username}`}>{user.name}</Link>
                  </h2>
                  <p className="leading-tight text-sm text-muted-foreground">
                    <Link href={`/user/${user.username}`}>
                      @{user.username}
                    </Link>
                  </p>
                  <p className="text-xs mt-1.5 empty:mt-0">{user.bio}</p>
                </div>
              </div>
            </div>
          </div>
          {currentUserId ? (
            currentUserId !== user.id ? (
              <FollowButton
                userid={user.id}
                username={user.username}
                followed={parseInt(user.followedbyuser) === 1}
                className="!w-full !rounded-sm"
              />
            ) : null
          ) : (
            <Link
              href="/sign-up"
              className="py-1 px-2.5 border w-full h-fit rounded-sm text-xs flex items-end justify-center gap-1 leading-[1.2] bg-main text-white border-main/50 hover:bg-main/90"
            >
              <div className="h-4 w-4 flex items-center justify-center">
                <UserPlus2 size={12} />
              </div>
              <span className="h-fit">Follow</span>
            </Link>
          )}
        </div>
      </>
    );
}
