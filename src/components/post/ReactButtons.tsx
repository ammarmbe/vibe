import { client } from "@/lib/ReactQueryProvider";
import { Post } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReactionButtons({
	heartCount,
	laughCount,
	surpriseCount,
	cryCount,
	userLikeStatus,
	postId,
	nanoId,
	userId,
}: {
	heartCount: number;
	laughCount: number;
	surpriseCount: number;
	cryCount: number;
	userLikeStatus: "like" | "laugh" | "heart" | "surprise" | "cry" | null;
	postId: string;
	nanoId?: string;
	userId: string;
}) {
	const { userId: currentUserId, isSignedIn } = useAuth();
	const { push } = useRouter();
	const [currentStatus, setCurrentStatus] = useState(userLikeStatus);
	const [buttonCounts, setButtonCounts] = useState({
		heartCount,
		laughCount,
		surpriseCount,
		cryCount,
	});

	useEffect(() => {
		setCurrentStatus(userLikeStatus);
	}, [userLikeStatus]);

	useEffect(() => {
		setButtonCounts({
			heartCount,
			laughCount,
			surpriseCount,
			cryCount,
		});
	}, [heartCount, laughCount, surpriseCount, cryCount]);

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
		mutationFn: async (
			type: "like" | "cry" | "laugh" | "heart" | "surprise",
		) => {
			await fetch(
				`/api/like?postId=${postId}&userLikeStatus=${userLikeStatus}&type=${type}`,
				{
					method: "POST",
				},
			);
		},
		onMutate: (type) => {
			setCurrentStatus(type === currentStatus ? null : type);
			setButtonCounts((prev) => {
				return {
					laughCount:
						currentStatus === "laugh"
							? prev.laughCount - 1
							: type === "laugh"
							  ? prev.laughCount + 1
							  : prev.laughCount,
					heartCount:
						currentStatus === "heart"
							? prev.heartCount - 1
							: type === "heart"
							  ? prev.heartCount + 1
							  : prev.heartCount,
					surpriseCount:
						currentStatus === "surprise"
							? prev.surpriseCount - 1
							: type === "surprise"
							  ? prev.surpriseCount + 1
							  : prev.surpriseCount,
					cryCount:
						currentStatus === "cry"
							? prev.cryCount - 1
							: type === "cry"
							  ? prev.cryCount + 1
							  : prev.cryCount,
				};
			});
		},
		onError: () => {
			setCurrentStatus(userLikeStatus);
		},
		onSuccess: (_data, type) => {
			if (userLikeStatus === null && userId !== currentUserId)
				notificationMutation.mutate();

			function updater(data: { pages: Post[][] } | undefined) {
				if (data)
					return {
						pages: data.pages.map((page) => {
							return page.map((post) => {
								if (post.postId === postId) {
									return {
										...post,
										userLikeStatus: type === currentStatus ? null : type,
										likeCount:
											currentStatus === "like"
												? (parseInt(post.likeCount) - 1).toString()
												: type === "like"
												  ? (parseInt(post.likeCount) + 1).toString()
												  : post.likeCount,
										laughCount:
											currentStatus === "laugh"
												? (parseInt(post.laughCount) - 1).toString()
												: type === "laugh"
												  ? (parseInt(post.laughCount) + 1).toString()
												  : post.laughCount,
										heartCount:
											currentStatus === "heart"
												? (parseInt(post.heartCount) - 1).toString()
												: type === "heart"
												  ? (parseInt(post.heartCount) + 1).toString()
												  : post.heartCount,
										surpriseCount:
											currentStatus === "surprise"
												? (parseInt(post.surpriseCount) - 1).toString()
												: type === "surprise"
												  ? (parseInt(post.surpriseCount) + 1).toString()
												  : post.surpriseCount,
										cryCount:
											currentStatus === "cry"
												? (parseInt(post.cryCount) - 1).toString()
												: type === "cry"
												  ? (parseInt(post.cryCount) + 1).toString()
												  : post.cryCount,
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
						userLikeStatus: type === currentStatus ? null : type,
						likeCount:
							currentStatus === "like"
								? (parseInt(data.likeCount) - 1).toString()
								: type === "like"
								  ? (parseInt(data.likeCount) + 1).toString()
								  : data.likeCount,
						laughCount:
							currentStatus === "laugh"
								? (parseInt(data.laughCount) - 1).toString()
								: type === "laugh"
								  ? (parseInt(data.laughCount) + 1).toString()
								  : data.laughCount,
						heartCount:
							currentStatus === "heart"
								? (parseInt(data.heartCount) - 1).toString()
								: type === "heart"
								  ? (parseInt(data.heartCount) + 1).toString()
								  : data.heartCount,
						surpriseCount:
							currentStatus === "surprise"
								? (parseInt(data.surpriseCount) - 1).toString()
								: type === "surprise"
								  ? (parseInt(data.surpriseCount) + 1).toString()
								  : data.surpriseCount,
						cryCount:
							currentStatus === "cry"
								? (parseInt(data.cryCount) - 1).toString()
								: type === "cry"
								  ? (parseInt(data.cryCount) + 1).toString()
								  : data.cryCount,
					};
				}
			});
		},
	});

	const toggleLike = async (
		type: "like" | "cry" | "laugh" | "heart" | "surprise",
	) => {
		likeMutation.mutate(type);
	};

	return (
		<div className="flex gap-1.5">
			<button
				type="button"
				className={`rounded-md px-2 p-[7px] text-xs transition-all border ${
					currentStatus === "heart"
						? "bg-accent border-ring"
						: "hover:bg-accent hover:border-ring"
				}`}
				disabled={likeMutation.isLoading}
				onClick={
					isSignedIn ? () => toggleLike("heart") : () => push("/sign-up")
				}
			>
				❤️ {buttonCounts.heartCount}
			</button>
			<button
				type="button"
				className={`rounded-md px-2 p-[7px] text-xs transition-all border ${
					currentStatus === "cry"
						? "bg-accent border-ring"
						: "hover:bg-accent hover:border-ring"
				}`}
				disabled={likeMutation.isLoading}
				onClick={isSignedIn ? () => toggleLike("cry") : () => push("/sign-up")}
			>
				😭 {buttonCounts.cryCount}
			</button>
			<button
				type="button"
				className={`rounded-md px-2 p-[7px] text-xs transition-all border ${
					currentStatus === "laugh"
						? "bg-accent border-ring"
						: "hover:bg-accent hover:border-ring"
				}`}
				disabled={likeMutation.isLoading}
				onClick={
					isSignedIn ? () => toggleLike("laugh") : () => push("/sign-up")
				}
			>
				😂 {buttonCounts.laughCount}
			</button>
			<button
				type="button"
				className={`rounded-md px-2 p-[7px] text-xs transition-all border ${
					currentStatus === "surprise"
						? "bg-accent border-ring"
						: "hover:bg-accent hover:border-ring"
				}`}
				disabled={likeMutation.isLoading}
				onClick={
					isSignedIn ? () => toggleLike("surprise") : () => push("/sign-up")
				}
			>
				😮 {buttonCounts.surpriseCount}
			</button>
		</div>
	);
}
