"use client";
import { useQuery } from "@tanstack/react-query";
import Parent from "./Parent";
import PostCard from "../PostCard/PostCard";
import { Comments } from "./Comments";
import { Post } from "@/lib/types";
import Spinner from "../Spinner";

export default function PostComponent({ nanoId }: { nanoId: string }) {
	const { data: post, isLoading } = useQuery({
		queryKey: ["postPage", nanoId],
		queryFn: async () => {
			const res = await fetch(`/api/post?nanoId=${nanoId}`);
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
				<div className="border rounded-md mb-2">
					{post.parentNanoId && (
						<Parent
							nanoId={post.parentNanoId}
							childDeleted={Boolean(parseInt(post.deleted))}
						/>
					)}
					{parseInt(post.deleted) ? (
						<div className="text-center text-sm text-foreground/30 p-2.5">
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
