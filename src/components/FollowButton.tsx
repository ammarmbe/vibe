"use client";
import { client } from "@/lib/ReactQueryProvider";
import { User } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { UserPlus2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function FollowButton({
	userId,
	followed,
	username,
	className,
}: {
	userId: string;
	followed: boolean;
	username: string;
	className?: string;
}) {
	const { isSignedIn } = useAuth();
	const { push } = useRouter();
	const { userId: currentUserId } = useAuth();
	const [following, setFollowing] = React.useState(followed);

	const notificationMutation = useMutation({
		mutationFn: async () =>
			await fetch(`/api/notification/followedUser?userId=${userId}`, {
				method: "POST",
			}),
		onSuccess: () => {
			client.invalidateQueries(["notifications", userId]);
		},
	});

	const followMutation = useMutation({
		mutationFn: async () =>
			await fetch(`/api/follow?userId=${userId}&followed=${followed}`, {
				method: "POST",
			}),
		onMutate: () => {
			setFollowing(!following);
		},
		onError: () => {
			setFollowing(followed);
		},
		onSuccess: () => {
			if (userId !== currentUserId && !followed) notificationMutation.mutate();

			client.setQueryData(["user", username], (data: User | undefined) => {
				if (data) {
					return {
						...data,
						followedByUser: followed ? "0" : "1",
						followers: followed
							? (parseInt(data.followers) - 1).toString()
							: (parseInt(data.followers) + 1).toString(),
					};
				}
			});
		},
	});

	return (
		<button
			type="button"
			name="Follow"
			disabled={followMutation.isLoading}
			className={`${className} py-1 px-2.5 border w-fit h-fit rounded-md text-xs flex items-end justify-center gap-1 leading-[1.2] ${
				following
					? "bg-main text-white border-main/50 hover:bg-main/90"
					: "border-main/20 hover:bg-main/10 dark:border-main/50 hover:border-main/50 text-main"
			}`}
			onClick={
				isSignedIn ? () => followMutation.mutate() : () => push("/sign-up")
			}
		>
			<div className="h-4 w-4 flex items-center justify-center">
				<UserPlus2 size={12} />
			</div>
			<span className="h-fit">{following ? "Following" : "Follow"}</span>
		</button>
	);
}
