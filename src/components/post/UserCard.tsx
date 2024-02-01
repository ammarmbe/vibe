import { useQuery } from "@tanstack/react-query";
import FollowButton from "../FollowButton";
import { User } from "@/lib/types";
import Image from "next/image";
import Spinner from "../Spinner";
import { useAuth } from "@clerk/nextjs";

export default function PostCard({ username }: { username: string }) {
	const { userId: currentUserId } = useAuth();

	const { data: user, isLoading: userLoading } = useQuery({
		queryKey: ["user", username],
		queryFn: async () =>
			(await (await fetch(`/api/user?username=${username}`)).json()) as User,
	});

	if (userLoading) {
		return (
			<div className="flex h-[100px] items-center justify-center w-[150px]">
				<Spinner size="lg" />
			</div>
		);
	}

	if (user)
		return (
			<div className="flex flex-col gap-2.5">
				<div
					style={{ gridTemplateColumns: "auto 1fr" }}
					className="grid gap-x-2.5 mr-2"
				>
					<Image
						src={user.image}
						alt={`${user.name}'s profile picture`}
						width={24}
						height={24}
						className={`rounded-full ${!user.bio && "self-center"}`}
					/>
					<div className="flex flex-col">
						<div className="flex items-center gap-2.5">
							<div className={`flex-grow ${!user.bio && "self-center"}`}>
								<h2 className="font-semibold text-sm leading-tight text-foreground">
									{user.name}
								</h2>
								<p className="leading-tight text-sm text-foreground/70">
									@{user.username}
								</p>
								<p className="text-xs mt-1.5 empty:mt-0">{user.bio}</p>
							</div>
						</div>
					</div>
				</div>
				{currentUserId !== user.id ? (
					<FollowButton
						userId={user.id}
						username={user.username}
						followed={parseInt(user.followedByUser) === 1}
						className="!w-full !rounded-sm"
					/>
				) : null}
			</div>
		);
}
