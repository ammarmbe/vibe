"use client";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Post } from "@/lib/types";

export default function LikeButton({
  likecount,
  laughcount,
  surprisecount,
  crycount,
  heartcount,
  userlikestatus,
  postid,
  userid,
}: {
  likecount: number;
  laughcount: number;
  surprisecount: number;
  crycount: number;
  heartcount: number;
  userlikestatus: "like" | "laugh" | "heart" | "surprise" | "cry" | null;
  postid: string;
  userid: string;
}) {
  const queryClient = useQueryClient();

  const [hoverCardOpen, setHoverCardOpen] = useState(false);
  const { userId: currentUserId, isSignedIn } = useAuth();
  const { push } = useRouter();
  const [currentStatus, setCurrentStatus] = useState(userlikestatus);
  const [buttonCounts, setButtonCounts] = useState({
    likecount,
    heartcount,
    laughcount,
    surprisecount,
    crycount,
  });

  useEffect(() => {
    setButtonCounts({
      likecount,
      heartcount,
      laughcount,
      surprisecount,
      crycount,
    });
  }, [likecount, heartcount, laughcount, surprisecount, crycount]);

  useEffect(() => {
    setCurrentStatus(userlikestatus);
  }, [userlikestatus]);

  const notificationMutation = useMutation({
    mutationFn: async (type: "like" | "cry" | "laugh" | "heart" | "surprise") =>
      await fetch(
        `/api/notification/likedPost?postid=${postid}&userid=${userid}&type=${type}`,
        { method: "POST" },
      ),
  });

  const likeMutation = useMutation({
    mutationFn: async (
      type: "like" | "cry" | "laugh" | "heart" | "surprise",
    ) => {
      await fetch(
        `/api/like?postid=${postid}&userlikestatus=${userlikestatus}&type=${type}`,
        {
          method: "POST",
        },
      );
    },
    onMutate: (type) => {
      function updater(oldData: { pages: Post[][] } | undefined) {
        if (oldData?.pages) {
          return {
            pages: oldData.pages.map((page) => {
              return page.map((post) => {
                if (post.postid === postid) {
                  return {
                    ...post,
                    userlikestatus: type === currentStatus ? null : type,
                    likecount:
                      currentStatus === "like"
                        ? (parseInt(post.likecount) - 1).toString()
                        : type === "like"
                          ? (parseInt(post.likecount) + 1).toString()
                          : post.likecount,
                    laughcount:
                      currentStatus === "laugh"
                        ? (parseInt(post.laughcount) - 1).toString()
                        : type === "laugh"
                          ? (parseInt(post.laughcount) + 1).toString()
                          : post.laughcount,
                    heartcount:
                      currentStatus === "heart"
                        ? (parseInt(post.heartcount) - 1).toString()
                        : type === "heart"
                          ? (parseInt(post.heartcount) + 1).toString()
                          : post.heartcount,
                    surprisecount:
                      currentStatus === "surprise"
                        ? (parseInt(post.surprisecount) - 1).toString()
                        : type === "surprise"
                          ? (parseInt(post.surprisecount) + 1).toString()
                          : post.surprisecount,
                    crycount:
                      currentStatus === "cry"
                        ? (parseInt(post.crycount) - 1).toString()
                        : type === "cry"
                          ? (parseInt(post.crycount) + 1).toString()
                          : post.crycount,
                  };
                }
                return post;
              });
            }),
          };
        }
        return oldData;
      }

      queryClient.setQueryData(["homeFeed", "Home"], updater);
      queryClient.setQueryData(["homeFeed", "Following"], updater);
      queryClient.setQueryData(["userPosts", userid], updater);

      setCurrentStatus(type === currentStatus ? null : type);
      setButtonCounts((prev) => {
        return {
          likecount:
            currentStatus === "like"
              ? prev.likecount - 1
              : type === "like"
                ? prev.likecount + 1
                : prev.likecount,
          laughcount:
            currentStatus === "laugh"
              ? prev.laughcount - 1
              : type === "laugh"
                ? prev.laughcount + 1
                : prev.laughcount,
          heartcount:
            currentStatus === "heart"
              ? prev.heartcount - 1
              : type === "heart"
                ? prev.heartcount + 1
                : prev.heartcount,
          surprisecount:
            currentStatus === "surprise"
              ? prev.surprisecount - 1
              : type === "surprise"
                ? prev.surprisecount + 1
                : prev.surprisecount,
          crycount:
            currentStatus === "cry"
              ? prev.crycount - 1
              : type === "cry"
                ? prev.crycount + 1
                : prev.crycount,
        };
      });
    },
    onError: () => {
      setCurrentStatus(userlikestatus);
      setButtonCounts({
        likecount,
        heartcount,
        laughcount,
        surprisecount,
        crycount,
      });

      queryClient.invalidateQueries(["homeFeed", "Home"]);
      queryClient.invalidateQueries(["homeFeed", "Following"]);
      queryClient.invalidateQueries(["userPosts", userid]);
    },
    onSuccess: (_data, type) => {
      if (currentStatus !== null && userid !== currentUserId)
        notificationMutation.mutate(type);
    },
  });

  const toggleLike = async (
    type: "like" | "cry" | "laugh" | "heart" | "surprise",
  ) => {
    likeMutation.mutate(type);
  };

  const likesOrLike = buttonCounts.likecount === 1 ? "like" : "likes";

  return (
    <>
      <HoverCard open={hoverCardOpen} onOpenChange={setHoverCardOpen}>
        <HoverCardTrigger asChild onClick={(e) => e.preventDefault()}>
          <button
            type="button"
            aria-label="like"
            disabled={likeMutation.isLoading}
            className={`text-xs px-2 gap-1 leading-[1.3] py-1 border transition-colors rounded-md h-fit select-none order-1 items-end flex justify-center ${
              currentStatus === "like"
                ? "bg-main text-white border-main/50 hover:bg-main/90"
                : "hover:bg-main/10 hover:border-main/50 dark:text-[#f5315c] text-main"
            }`}
            onClick={() => {
              if (isSignedIn) {
                toggleLike("like");
              } else push("/sign-up");
            }}
          >
            <div className="h-4 w-4 flex items-center justify-center">
              <Heart size={14} />
            </div>
            <span className="h-fit">
              {buttonCounts.likecount}{" "}
              {currentStatus === "like" ? "liked" : likesOrLike}
            </span>
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="p-1.5 w-fit space-x-1" side="top">
          <button
            type="button"
            aria-label="heart"
            className={`rounded-sm px-2 p-1.5 text-sm transition-all ${
              currentStatus === "heart"
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            }`}
            disabled={likeMutation.isLoading}
            onClick={
              isSignedIn
                ? () => {
                    toggleLike("heart");
                    setHoverCardOpen(false);
                  }
                : () => push("/sign-up")
            }
          >
            ❤️
          </button>
          <button
            type="button"
            aria-label="laugh"
            className={`rounded-sm px-2 p-1.5 text-sm transition-all ${
              currentStatus === "laugh"
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            }`}
            disabled={likeMutation.isLoading}
            onClick={
              isSignedIn
                ? () => {
                    toggleLike("laugh");
                    setHoverCardOpen(false);
                  }
                : () => push("/sign-up")
            }
          >
            😂
          </button>
          <button
            type="button"
            aria-label="cry"
            className={`rounded-sm px-2 p-1.5 text-sm transition-all ${
              currentStatus === "cry" ? "bg-secondary" : "hover:bg-secondary/50"
            }`}
            disabled={likeMutation.isLoading}
            onClick={
              isSignedIn
                ? () => {
                    toggleLike("cry");
                    setHoverCardOpen(false);
                  }
                : () => push("/sign-up")
            }
          >
            😭
          </button>
          <button
            type="button"
            aria-label="surprise"
            className={`rounded-sm px-2 p-1.5 text-sm transition-all ${
              currentStatus === "surprise"
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            }`}
            disabled={likeMutation.isLoading}
            onClick={
              isSignedIn
                ? () => {
                    toggleLike("surprise");
                    setHoverCardOpen(false);
                  }
                : () => push("/sign-up")
            }
          >
            😮
          </button>
        </HoverCardContent>
      </HoverCard>
      {buttonCounts.heartcount ? (
        <button
          aria-label="heart"
          type="button"
          className={`border h-fit p-1.5 py-1 text-xs rounded-md leading-[1.3] flex items-end justify-center order-3 ${
            currentStatus === "heart"
              ? "bg-secondary border-ring"
              : "hover:bg-secondary hover:border-ring"
          }`}
          disabled={likeMutation.isLoading}
          onClick={
            isSignedIn ? () => toggleLike("heart") : () => push("/sign-up")
          }
        >
          <span className="h-fit">❤️ {buttonCounts.heartcount}</span>
        </button>
      ) : null}
      {buttonCounts.laughcount ? (
        <button
          aria-label="laugh"
          type="button"
          className={`border h-fit p-1.5 py-1 text-xs rounded-md leading-[1.3] flex items-end justify-center order-4 ${
            currentStatus === "laugh"
              ? "bg-secondary border-ring"
              : "hover:bg-secondary hover:border-ring"
          }`}
          disabled={likeMutation.isLoading}
          onClick={
            isSignedIn ? () => toggleLike("laugh") : () => push("/sign-up")
          }
        >
          <span className="h-fit">😂 {buttonCounts.laughcount}</span>
        </button>
      ) : null}
      {buttonCounts.crycount ? (
        <button
          aria-label="cry"
          type="button"
          className={`border h-fit p-1.5 py-1 text-xs rounded-md leading-[1.3] flex items-end justify-center order-6 ${
            currentStatus === "cry"
              ? "bg-secondary border-ring"
              : "hover:bg-secondary hover:border-ring"
          }`}
          disabled={likeMutation.isLoading}
          onClick={
            isSignedIn ? () => toggleLike("cry") : () => push("/sign-up")
          }
        >
          <span className="h-fit">😭 {buttonCounts.crycount}</span>
        </button>
      ) : null}
      {buttonCounts.surprisecount ? (
        <button
          aria-label="surprise"
          type="button"
          className={`border h-fit p-1.5 py-1 text-xs rounded-md leading-[1.3] flex items-end justify-center order-5 ${
            currentStatus === "surprise"
              ? "bg-secondary border-ring"
              : "hover:bg-secondary hover:border-ring"
          }`}
          disabled={likeMutation.isLoading}
          onClick={
            isSignedIn ? () => toggleLike("surprise") : () => push("/sign-up")
          }
        >
          <span className="h-fit">😮 {buttonCounts.surprisecount}</span>
        </button>
      ) : null}
    </>
  );
}
