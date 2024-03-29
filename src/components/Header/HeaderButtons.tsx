"use client";
import React, { useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import {
	ClerkLoaded,
	ClerkLoading,
	SignInButton,
	SignOutButton,
	SignUpButton,
	useUser,
} from "@clerk/nextjs";
import NotificationButton from "./NotificationButton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
const EditProfile = dynamic(() => import("../EditProfile"), {
	ssr: false,
});
import Link from "@/components/Link";
import { LogOut, PencilIcon, User2 } from "lucide-react";
import dynamic from "next/dynamic";

export default function AccountButton() {
	const { user } = useUser();
	const [showBorderTop, setShowBorderTop] = useState(false);
	const [borderBottom, setBorderBottom] = useState<"signOut" | "edit" | "">("");

	return !user ? (
		<>
			<SignInButton>
				<button
					aria-label="Sign in"
					className="border rounded-md hover:border-ring hover:bg-accent transition-colors px-2.5 py-1"
					type="button"
				>
					Sign in
				</button>
			</SignInButton>
			<SignUpButton>
				<button
					aria-label="Sign up"
					className="border rounded-md hover:bg-main/5 hover:border-main/50 text-main transition-colors px-2.5 py-1"
					type="button"
				>
					Sign up
				</button>
			</SignUpButton>
		</>
	) : (
		<>
			<ClerkLoading />
			<ClerkLoaded>
				<NotificationButton />
				<Popover>
					<PopoverTrigger className="border shadow-sm hover:shadow-none font-medium text-sm hover:bg-accent flex gap-1.5 items-end hover:border-ring transition-colors px-2.5 py-1.5 rounded-md h-full">
						<div className="h-5 flex items-center justify-center">
							<Image
								src={user.imageUrl}
								alt="Account options"
								width={16}
								height={16}
								className="rounded-full"
							/>
						</div>
						<p className="h-fit leading-[1.3]">{user.fullName}</p>
					</PopoverTrigger>
					<PopoverContent className="flex flex-col p-0 border-0 w-[150px]">
						<Link
							href={`/user/${user.username}`}
							onMouseEnter={() => setShowBorderTop(true)}
							onMouseLeave={() => setShowBorderTop(false)}
							className="rounded-t-md border-b-0 text-sm transition-colors hover:bg-accent hover:border-ring border p-2.5 flex items-end justify-center gap-1.5 leading-[1.3]"
						>
							<div className="h-5 w-5 flex items-center justify-center">
								<User2 size={16} />
							</div>
							<span className="h-fit">View profile</span>
						</Link>
						<div
							className={`border-b border-dashed transition-all ${
								showBorderTop && "border-ring !border-solid"
							}`}
						/>

						<Dialog>
							<DialogTrigger
								aria-label="Edit profile"
								onMouseEnter={() => {
									setShowBorderTop(true);
									setBorderBottom("edit");
								}}
								onMouseLeave={() => {
									setShowBorderTop(false);
									setBorderBottom("");
								}}
								className="border-y-0 text-sm transition-colors hover:bg-accent hover:border-ring border p-2.5 flex items-end justify-center gap-1.5 leading-[1.3]"
							>
								<div className="h-5 w-5 flex items-center justify-center">
									<PencilIcon size={16} />
								</div>
								<span className="h-fit">Edit profile</span>
							</DialogTrigger>
							<DialogContent className="p-0 border-0 !w-[360px]">
								<EditProfile />
							</DialogContent>
						</Dialog>
						<div
							className={`border-b border-dashed transition-all ${
								borderBottom === "signOut" && "border-danger/50 !border-solid"
							} ${borderBottom === "edit" && "border-ring !border-solid"}`}
						/>
						<SignOutButton>
							<button
								type="button"
								aria-label="Sign out"
								onMouseEnter={() => setBorderBottom("signOut")}
								onMouseLeave={() => setBorderBottom("")}
								className="text-danger hover:bg-danger/5 text-sm rounded-b-md border-t-0 transition-colors hover:border-danger/50 border p-2.5 flex items-end justify-center gap-1.5 leading-[1.3]"
							>
								<div className="h-5 w-5 flex items-center justify-center">
									<LogOut size={16} />
								</div>
								<span className="h-fit">Sign out</span>
							</button>
						</SignOutButton>
					</PopoverContent>
				</Popover>
			</ClerkLoaded>
		</>
	);
}
