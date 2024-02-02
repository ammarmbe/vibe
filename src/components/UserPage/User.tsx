"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { PencilIcon, UserPlus2 } from "lucide-react";
const EditProfile = dynamic(() => import("../EditProfile"), {
	ssr: false,
});
const FollowButton = dynamic(() => import("../FollowButton"), {
	ssr: false,
});
import { useAuth } from "@clerk/nextjs";
import Posts from "./Posts";
import { User } from "@/lib/types";
import Spinner from "../Spinner";
import dynamic from "next/dynamic";
import Link from "next/link";

export default function Page({ username }: { username: string }) {
	const { userId } = useAuth();

	const { data: user, isLoading } = useQuery({
		queryKey: ["user", username],
		queryFn: async () => {
			const res = await fetch(`/api/user?username=${username}`);
			return res.json() as Promise<User>;
		},
	});

	function formatFollowerCount() {
		if (user) {
			const followerCount = parseInt(user.followers);
			if (followerCount >= 1000000) {
				return `${`00${followerCount / 1000000}`.slice(-3)}M`;
			}
			if (followerCount >= 1000) {
				return `${`00${followerCount / 1000}`.slice(-3)}K`;
			}
			return `000${followerCount}`.slice(-4);
		}
	}

	if (isLoading) {
		return (
			<div className="mx-auto py-10">
				<Spinner size="xl" />
			</div>
		);
	}

	if (user)
		return (
			<>
				<div
					style={{ gridTemplateColumns: "auto 1fr" }}
					className="rounded-md grid gap-x-2.5 border p-2.5 mb-2.5 shadow-sm"
				>
					<Image
						src={user.image}
						alt={`${user.name}'s profile picture`}
						width={32}
						height={32}
						className={`rounded-full ${!user.bio && "self-center"}`}
					/>
					<div className="flex flex-col">
						<div className="flex items-center gap-2.5">
							<div className={`flex-grow ${!user.bio && "self-center"}`}>
								<h2 className="font-semibold text-lg leading-tight">
									{user.name}
									{parseInt(user.followsUser) ? (
										<span className="font-normal bg-secondary text-xs py-1 px-1.5 rounded-md ml-1.5">
											follows you
										</span>
									) : null}
								</h2>
								<p className="leading-tight text-muted-foreground">
									@{user.username}
								</p>
								<p className="text-sm mt-1.5 empty:mt-0">{user.bio}</p>
							</div>
							<div className="flex flex-col h-full justify-end items-center">
								<p className="font-bold mb-1.5 flex items-center text-center text-lg leading-none">
									{formatFollowerCount()}
								</p>
								{userId === user.id ? (
									<>
										<Dialog>
											<DialogTrigger className="py-1 px-2.5 border w-fit h-fit rounded-md text-xs hover:bg-accent hover:border-ring transition-colors flex items-end justify-center gap-1 leading-[1.2]">
												<div className="h-4 w-4 flex items-center justify-center">
													<PencilIcon size={12} />
												</div>
												<span className="h-fit">Edit</span>
											</DialogTrigger>
											<DialogContent className="p-0 border-0 !w-[360px]">
												<EditProfile />
											</DialogContent>
										</Dialog>
									</>
								) : userId ? (
									<FollowButton
										userId={user.id}
										username={user.username}
										followed={parseInt(user.followedByUser) === 1}
									/>
								) : (
									<Link
										href="/sign-up"
										className="py-1 px-2.5 border w-fit h-fit rounded-md text-xs flex items-end justify-center gap-1 leading-[1.2] bg-main text-white border-main/50 hover:bg-main/90"
									>
										<div className="h-4 w-4 flex items-center justify-center">
											<UserPlus2 size={12} />
										</div>
										<span className="h-fit">Follow</span>
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
				<Posts userId={user.id} />
			</>
		);
}
