"use client";
import { client } from "@/lib/ReactQueryProvider";
import { Post } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
	const [buttonClicked, setButtonClicked] = useState(liked);
	const [buttonCount, setButtonCount] = useState(parseInt(count));

	const notificationMutation = useMutation({
		mutationFn: async () =>
			await fetch(
				`/api/notification/likedPost?postId=${postId}&userId=${userId}`,
				{ method: "POST" },
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
		onMutate: () => {
			setButtonClicked(!buttonClicked);
			setButtonCount(buttonClicked ? buttonCount - 1 : buttonCount + 1);
		},
		onError: () => {
			setButtonClicked(liked);
			setButtonCount(parseInt(count));
		},
		onSuccess: () => {
			if (!liked && userId !== currentUserId) notificationMutation.mutate();

			function updater(data: { pages: Post[][] } | undefined) {
				if (data)
					return {
						pages: data.pages.map((page) => {
							return page.map((post) => {
								if (post.postId === postId) {
									return {
										...post,
										likedByUser: liked ? "0" : "1",
										likes: liked
											? (parseInt(post.likes) - 1).toString()
											: (parseInt(post.likes) + 1).toString(),
									};
								}
								return post;
							});
						}),
					};
			}

			client.setQueryData(["homeFeed"], updater);
			client.setQueryData(["userPosts", userId], updater);
			client.setQueryData(["comments"], updater);
			client.setQueryData(["post", nanoId], (data: Post | undefined) => {
				if (data) {
					return {
						...data,
						likedByUser: liked ? "0" : "1",
						likes: liked
							? (parseInt(data.likes) - 1).toString()
							: (parseInt(data.likes) + 1).toString(),
					};
				}
			});
		},
	});

	const toggleLike = async () => {
		likeMutation.mutate();
	};

	const likesOrLike = buttonCount === 1 ? "like" : "likes";

	return (
		<button
			type="button"
			disabled={likeMutation.isLoading}
			className={`text-xs px-2.5 py-1 border transition-colors rounded-md ${
				buttonClicked
					? "bg-main text-white border-main/50 hover:bg-main/90"
					: "hover:bg-main/10 hover:border-main/50 text-main"
			}`}
			onClick={isSignedIn ? toggleLike : () => push("/sign-up")}
		>
			{buttonCount} {buttonClicked ? "liked" : likesOrLike}
		</button>
	);
}
