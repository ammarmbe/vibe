"use client";
import { client } from "@/lib/ReactQueryProvider";
import { Post } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	TooltipProvider,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "../ui/tooltip";
import { PopoverContent, PopoverTrigger, Popover } from "../ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";

export default function LikeButton({
	likeCount,
	laughCount,
	surpriseCount,
	cryCount,
	heartCount,
	userLikeStatus,
	postId,
	nanoId,
	userId,
}: {
	likeCount: number;
	laughCount: number;
	surpriseCount: number;
	cryCount: number;
	heartCount: number;
	userLikeStatus: "like" | "laugh" | "heart" | "surprise" | "cry" | null;
	postId: string;
	nanoId?: string;
	userId: string;
}) {
	const [popoverOpen, setPopoverOpen] = useState(false);
	const { userId: currentUserId, isSignedIn } = useAuth();
	const { push } = useRouter();
	const [currentStatus, setCurrentStatus] = useState(userLikeStatus);
	const [buttonCounts, setButtonCounts] = useState({
		likeCount,
		heartCount,
		laughCount,
		surpriseCount,
		cryCount,
	});

	const isTouchDevice =
		"ontouchstart" in window || navigator.maxTouchPoints > 0;
	let timeoutId: NodeJS.Timeout;

	const handleTouchStart = () => {
		timeoutId = setTimeout(() => {
			setPopoverOpen(true);
		}, 500);
	};

	const handleTouchEnd = () => {
		clearTimeout(timeoutId);
	};

	const notificationMutation = useMutation({
		mutationFn: async (type: "like" | "cry" | "laugh" | "heart" | "surprise") =>
			await fetch(
				`/api/notification/likedPost?postId=${postId}&userId=${userId}&type=${type}`,
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
					likeCount:
						currentStatus === "like"
							? prev.likeCount - 1
							: type === "like"
							  ? prev.likeCount + 1
							  : prev.likeCount,
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
			setButtonCounts({
				likeCount,
				heartCount,
				laughCount,
				surpriseCount,
				cryCount,
			});
		},
		onSuccess: (_data, type) => {
			if (type !== userLikeStatus && userId !== currentUserId)
				notificationMutation.mutate(type);

			function updater(data: { pages: Post[][] } | undefined) {
				if (data)
					return {
						pages: data.pages.map((page) => {
							return page.map((post) => {
								if (post.postId === postId) {
									return {
										...post,
										userLikeStatus: type === userLikeStatus ? null : type,
										likeCount:
											userLikeStatus === "like"
												? (parseInt(post.likeCount) - 1).toString()
												: type === "like"
												  ? (parseInt(post.likeCount) + 1).toString()
												  : post.likeCount,
										laughCount:
											userLikeStatus === "laugh"
												? (parseInt(post.laughCount) - 1).toString()
												: type === "laugh"
												  ? (parseInt(post.laughCount) + 1).toString()
												  : post.laughCount,
										heartCount:
											userLikeStatus === "heart"
												? (parseInt(post.heartCount) - 1).toString()
												: type === "heart"
												  ? (parseInt(post.heartCount) + 1).toString()
												  : post.heartCount,
										surpriseCount:
											userLikeStatus === "surprise"
												? (parseInt(post.surpriseCount) - 1).toString()
												: type === "surprise"
												  ? (parseInt(post.surpriseCount) + 1).toString()
												  : post.surpriseCount,
										cryCount:
											userLikeStatus === "cry"
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
						userLikeStatus: type === userLikeStatus ? null : type,
						likeCount:
							userLikeStatus === "like"
								? (parseInt(data.likeCount) - 1).toString()
								: type === "like"
								  ? (parseInt(data.likeCount) + 1).toString()
								  : data.likeCount,
						laughCount:
							userLikeStatus === "laugh"
								? (parseInt(data.laughCount) - 1).toString()
								: type === "laugh"
								  ? (parseInt(data.laughCount) + 1).toString()
								  : data.laughCount,
						heartCount:
							userLikeStatus === "heart"
								? (parseInt(data.heartCount) - 1).toString()
								: type === "heart"
								  ? (parseInt(data.heartCount) + 1).toString()
								  : data.heartCount,
						surpriseCount:
							userLikeStatus === "surprise"
								? (parseInt(data.surpriseCount) - 1).toString()
								: type === "surprise"
								  ? (parseInt(data.surpriseCount) + 1).toString()
								  : data.surpriseCount,
						cryCount:
							userLikeStatus === "cry"
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

	const likesOrLike = buttonCounts.likeCount === 1 ? "like" : "likes";

	return (
		<>
			{isTouchDevice ? (
				<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
					<PopoverTrigger
						disabled={likeMutation.isLoading}
						className={`text-xs px-2.5 py-1 border transition-colors rounded-md h-full select-none order-1 ${
							currentStatus === "like"
								? "bg-main text-white border-main/50 hover:bg-main/90"
								: "hover:bg-main/10 hover:border-main/50 text-main"
						}`}
						onClick={
							isSignedIn
								? (e) => {
										e.preventDefault();
										toggleLike("like");
								  }
								: (e) => {
										e.preventDefault();
										push("/sign-up");
								  }
						}
						onTouchStart={handleTouchStart}
						onTouchEnd={handleTouchEnd}
					>
						{buttonCounts.likeCount}{" "}
						{currentStatus === "like" ? "liked" : likesOrLike}
					</PopoverTrigger>
					<PopoverContent className="p-1.5 w-fit space-x-1" side="top">
						<PopoverClose
							type="button"
							className={`rounded-sm px-2 p-1.5 text-sm transition-all ${
								currentStatus === "heart"
									? "bg-secondary"
									: "hover:bg-secondary/50"
							}`}
							disabled={likeMutation.isLoading}
							onClick={
								isSignedIn ? () => toggleLike("heart") : () => push("/sign-up")
							}
						>
							❤️ {buttonCounts.heartCount}
						</PopoverClose>
						<PopoverClose
							type="button"
							className={`rounded-sm px-2 p-1.5 text-sm transition-all ${
								currentStatus === "cry"
									? "bg-secondary"
									: "hover:bg-secondary/50"
							}`}
							disabled={likeMutation.isLoading}
							onClick={
								isSignedIn ? () => toggleLike("cry") : () => push("/sign-up")
							}
						>
							😭 {buttonCounts.cryCount}
						</PopoverClose>
						<PopoverClose
							type="button"
							className={`rounded-sm px-2 p-1.5 text-sm transition-all ${
								currentStatus === "laugh"
									? "bg-secondary"
									: "hover:bg-secondary/50"
							}`}
							disabled={likeMutation.isLoading}
							onClick={
								isSignedIn ? () => toggleLike("laugh") : () => push("/sign-up")
							}
						>
							😂 {buttonCounts.laughCount}
						</PopoverClose>
						<PopoverClose
							type="button"
							className={`rounded-sm px-2 p-1.5 text-sm transition-all ${
								currentStatus === "surprise"
									? "bg-secondary"
									: "hover:bg-secondary/50"
							}`}
							disabled={likeMutation.isLoading}
							onClick={
								isSignedIn
									? () => toggleLike("surprise")
									: () => push("/sign-up")
							}
						>
							😮 {buttonCounts.surpriseCount}
						</PopoverClose>
					</PopoverContent>
				</Popover>
			) : (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger
							disabled={likeMutation.isLoading}
							className={`text-xs px-2.5 py-1 border transition-colors rounded-md h-full select-none ${
								currentStatus === "like"
									? "bg-main text-white border-main/50 hover:bg-main/90"
									: "hover:bg-main/10 hover:border-main/50 text-main"
							}`}
							onClick={
								isSignedIn ? () => toggleLike("like") : () => push("/sign-up")
							}
						>
							{buttonCounts.likeCount}{" "}
							{currentStatus === "like" ? "liked" : likesOrLike}
						</TooltipTrigger>
						<TooltipContent className="px-1.5 space-x-1">
							<button
								type="button"
								className={`rounded-sm px-2 p-1.5 text-sm transition-all ${
									currentStatus === "heart"
										? "bg-secondary"
										: "hover:bg-secondary/50"
								}`}
								disabled={likeMutation.isLoading}
								onClick={
									isSignedIn
										? () => toggleLike("heart")
										: () => push("/sign-up")
								}
							>
								❤️ {buttonCounts.heartCount}
							</button>
							<button
								type="button"
								className={`rounded-sm px-2 p-1.5 text-sm transition-all ${
									currentStatus === "cry"
										? "bg-secondary"
										: "hover:bg-secondary/50"
								}`}
								disabled={likeMutation.isLoading}
								onClick={
									isSignedIn ? () => toggleLike("cry") : () => push("/sign-up")
								}
							>
								😭 {buttonCounts.cryCount}
							</button>
							<button
								type="button"
								className={`rounded-sm px-2 p-1.5 text-sm transition-all ${
									currentStatus === "laugh"
										? "bg-secondary"
										: "hover:bg-secondary/50"
								}`}
								disabled={likeMutation.isLoading}
								onClick={
									isSignedIn
										? () => toggleLike("laugh")
										: () => push("/sign-up")
								}
							>
								😂 {buttonCounts.laughCount}
							</button>
							<button
								type="button"
								className={`rounded-sm px-2 p-1.5 text-sm transition-all ${
									currentStatus === "surprise"
										? "bg-secondary"
										: "hover:bg-secondary/50"
								}`}
								disabled={likeMutation.isLoading}
								onClick={
									isSignedIn
										? () => toggleLike("surprise")
										: () => push("/sign-up")
								}
							>
								😮 {buttonCounts.surpriseCount}
							</button>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
			{buttonCounts.heartCount ? (
				<button
					type="button"
					className={`border p-1.5 py-1 text-xs rounded-md order-3 ${
						currentStatus === "heart"
							? "bg-secondary border-ring"
							: "hover:bg-secondary hover:border-ring"
					}`}
					disabled={likeMutation.isLoading}
					onClick={
						isSignedIn ? () => toggleLike("heart") : () => push("/sign-up")
					}
				>
					❤️ {buttonCounts.heartCount}
				</button>
			) : null}
			{buttonCounts.laughCount ? (
				<button
					type="button"
					className={`border p-1.5 py-1 text-xs rounded-md order-4 ${
						currentStatus === "laugh"
							? "bg-secondary border-ring"
							: "hover:bg-secondary hover:border-ring"
					}`}
					disabled={likeMutation.isLoading}
					onClick={
						isSignedIn ? () => toggleLike("laugh") : () => push("/sign-up")
					}
				>
					😂 {buttonCounts.laughCount}
				</button>
			) : null}
			{buttonCounts.surpriseCount ? (
				<button
					type="button"
					className={`border p-1.5 py-1 text-xs rounded-md order-5 ${
						currentStatus === "surprise"
							? "bg-secondary border-ring"
							: "hover:bg-secondary hover:border-ring"
					}`}
					disabled={likeMutation.isLoading}
					onClick={
						isSignedIn ? () => toggleLike("surprise") : () => push("/sign-up")
					}
				>
					😮 {buttonCounts.surpriseCount}
				</button>
			) : null}
			{buttonCounts.cryCount ? (
				<button
					type="button"
					className={`border p-1.5 py-1 text-xs rounded-md order-6 ${
						currentStatus === "cry"
							? "bg-secondary border-ring"
							: "hover:bg-secondary hover:border-ring"
					}`}
					disabled={likeMutation.isLoading}
					onClick={
						isSignedIn ? () => toggleLike("cry") : () => push("/sign-up")
					}
				>
					😭 {buttonCounts.cryCount}
				</button>
			) : null}
		</>
	);
}
