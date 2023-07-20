"use client";
import { client } from "@/lib/ReactQueryProvider";
import { Post } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function LikeButton({
  count,
  liked,
  postId,
  nanoId,
  userId,
}: {
  count: string;
  liked: boolean;
  postId: string;
  nanoId?: string;
  userId: string;
}) {
  const { userId: currentUserId, isSignedIn } = useAuth();
  const { push } = useRouter();

  const notificationMutation = useMutation({
    mutationFn: async () =>
      await fetch(
        `/api/notification/likedPost?postId=${postId}&userId=${userId}`,
        { method: "POST" }
      ),
    onSuccess: () => {
      client.invalidateQueries(["notifications", userId]);
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      await fetch(`/api/like?postId=${postId}&liked=${liked}`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      if (!liked && userId != currentUserId) notificationMutation.mutate();

      function updater(data: any) {
        if (data)
          return {
            pages: data.pages.map((page: any) => {
              return page.map((post: Post) => {
                if (post.postId == postId) {
                  return {
                    ...post,
                    likedByUser: liked ? 0 : 1,
                    likes: liked
                      ? parseInt(post.likes) - 1
                      : parseInt(post.likes) + 1,
                  };
                } else {
                  return post;
                }
              });
            }),
          };
      }

      client.setQueryData(["homeFeed"], updater);
      client.setQueryData(["userPosts", userId], updater);
      client.setQueryData(["comments"], updater);
      client.setQueryData(["post", nanoId], (data: any) => {
        if (data) {
          return {
            ...data,
            likedByUser: liked ? 0 : 1,
            likes: liked ? parseInt(data.likes) - 1 : parseInt(data.likes) + 1,
          };
        }
      });
    },
  });

  const toggleLike = async () => {
    likeMutation.mutate();
  };

  const likesOrLike = parseInt(count) == 1 ? "like" : "likes";

  return (
    <button
      disabled={likeMutation.isLoading}
      className={`text-xs px-2.5 py-1 border transition-colors rounded-md ${
        liked
          ? `bg-main text-white border-main/50 hover:bg-main/90`
          : `border-main/20 hover:bg-main/10 dark:border-main/40 hover:border-main/50 text-main`
      }`}
      onClick={isSignedIn ? toggleLike : () => push("/sign-up")}
    >
      {count} {liked ? "liked" : likesOrLike}
    </button>
  );
}
