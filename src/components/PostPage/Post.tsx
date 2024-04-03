"use client";
import { useQuery } from "@tanstack/react-query";
const Parent = dynamic(() => import("./Parent"));
import PostCard from "../PostCard/PostCard";
import { Comments } from "./Comments";
import { Post } from "@/lib/types";
import Spinner from "../Spinner";
import dynamic from "next/dynamic";

export default function PostComponent({ nanoid }: { nanoid: string }) {
  const { data: post, isLoading } = useQuery({
    queryKey: ["postPage", nanoid],
    queryFn: async () => {
      const res = await fetch(`/api/post?nanoid=${nanoid}`);
      return res.json() as Promise<Post>;
    },
  });

  if (isLoading)
    return (
      <div className="mx-auto py-10">
        <Spinner size="xl" />
      </div>
    );

  if (post)
    return (
      <>
        <div className="mb-2">
          {post.parentnanoid && (
            <Parent
              nanoid={post.parentnanoid}
              childDeleted={Boolean(parseInt(post.deleted))}
            />
          )}
          {parseInt(post.deleted) ? (
            <div className="text-center text-sm rounded-b-md border border-t-0 text-foreground/30 p-2.5">
              This post has been deleted
            </div>
          ) : (
            <PostCard post={post} postPage={true} />
          )}
        </div>
        {!parseInt(post.deleted) ? <Comments post={post} /> : null}
      </>
    );
}
