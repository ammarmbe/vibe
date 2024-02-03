"use client";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart } from "lucide-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../ui/hover-card";

export default function LikeButton({
	likeCount,
	laughCount,
	surpriseCount,
	cryCount,
	heartCount,
	userLikeStatus,
	postId,
	userId,
}: {
	likeCount: number;
	laughCount: number;
	surpriseCount: number;
	cryCount: number;
	heartCount: number;
	userLikeStatus: "like" | "laugh" | "heart" | "surprise" | "cry" | null;
	postId: string;
	userId: string;
}) {
	const [hoverCardOpen, setHoverCardOpen] = useState(false);
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

	const notificationMutation = useMutation({
		mutationFn: async (type: "like" | "cry" | "laugh" | "heart" | "surprise") =>
			await fetch(
				`/api/notification/likedPost?postId=${postId}&userId=${userId}&type=${type}`,
				{ method: "POST" },
			),
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
			if (currentStatus !== null && userId !== currentUserId)
				notificationMutation.mutate(type);
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
			<HoverCard open={hoverCardOpen} onOpenChange={setHoverCardOpen}>
				<HoverCardTrigger asChild>
					<button
						type="button"
						aria-label="like"
						disabled={likeMutation.isLoading}
						className={`text-xs px-2 gap-1 leading-[1.3] py-1 border transition-colors rounded-md h-full select-none order-1 items-end flex justify-center ${
							currentStatus === "like"
								? "bg-main text-white border-main/50 hover:bg-main/90"
								: "hover:bg-main/10 hover:border-main/50 dark:text-[#f5315c] text-main"
						}`}
						onClick={
							isSignedIn
								? () => {
										toggleLike("like");
										setHoverCardOpen(false);
								  }
								: () => push("/sign-up")
						}
					>
						<div className="h-4 w-4 flex items-center justify-center">
							<Heart size={14} />
						</div>
						<span className="h-fit">
							{buttonCounts.likeCount}{" "}
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
			{buttonCounts.heartCount ? (
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
					<span className="h-fit">❤️ {buttonCounts.heartCount}</span>
				</button>
			) : null}
			{buttonCounts.laughCount ? (
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
					<span className="h-fit">😂 {buttonCounts.laughCount}</span>
				</button>
			) : null}
			{buttonCounts.cryCount ? (
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
					<span className="h-fit">😭 {buttonCounts.cryCount}</span>
				</button>
			) : null}
			{buttonCounts.surpriseCount ? (
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
					<span className="h-fit">😮 {buttonCounts.surpriseCount}</span>
				</button>
			) : null}
		</>
	);
}
