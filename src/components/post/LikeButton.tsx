"use client";
import { client } from "@/lib/reactQueryProvider";
import { Post } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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
  const likeMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/like?postId=${postId}&liked=${liked}`);
    },
    onSuccess: () => {
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
      className={`text-xs px-2.5 py-1 border rounded-md ${
        liked
          ? `bg-main text-white border-main/50 hover:bg-main/90`
          : `border-main/20 hover:bg-main/5 hover:border-main/50 text-main`
      }`}
      onClick={toggleLike}
    >
      {count} {liked ? "liked" : likesOrLike}
    </button>
  );
}
