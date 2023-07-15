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
}: {
  count: number;
  liked: boolean;
  postId: number;
  nanoId?: string;
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
                      ? // without parseInt, the number of likes will be concatenated, I have no idea why
                        parseInt(post.likes) - 1
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
      client.setQueryData(["comments"], updater);
      client.setQueryData(["post", nanoId], (data?: Post) => {
        if (data) {
          return {
            ...data,
            likedByUser: liked ? 0 : 1,
            likes: liked
              ? // without parseInt, the number of likes will be concatenated, I have no idea why
                parseInt(data.likes) - 1
              : parseInt(data.likes) + 1,
          };
        }
      });
    },
  });

  const toggleLike = async () => {
    likeMutation.mutate();
  };

  // return "likes" if count is 0 or 1, otherwise return "like"
  const likesOrLike = count == 1 ? "like" : "likes";

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
