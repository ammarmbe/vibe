import { SignOutButton, useUser } from "@clerk/nextjs";
import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "./ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DialogClose } from "@radix-ui/react-dialog";
import { Post, User } from "@/lib/types";
import { client } from "@/lib/ReactQueryProvider";
import { usePathname, useRouter } from "next/navigation";
import Spinner from "./Spinner";
import Link from "@/components/Link";

export default function EditProfile() {
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [usernameTaken, setUsernameTaken] = useState(false);
	const [usernameTooLong, setUsernameTooLong] = useState(false);
	const [bioTooLong, setBioTooLong] = useState(false);
	const [invalidUsername, setInvalidUsername] = useState(false);
	const { user } = useUser();
	const { push } = useRouter();
	const pathname = usePathname();

	const usernameMutation = useMutation({
		mutationFn: async () => {
			const status = (
				await fetch(`/api/user/username?username=${username}&bio=${bio}`, {
					method: "POST",
				})
			).status;

			if (status === 409) {
				throw new Error("Username already exists");
			}
			return;
		},
		onError(error: Error) {
			if (error.message === "Username already exists") {
				setUsernameTaken(true);
			}
		},
		onSuccess: async () => {
			await user?.update({
				username,
			});

			if (pathname.startsWith("/user")) {
				push(`/user/${username}`);
				return;
			}

			if (pathname.startsWith("/post")) {
				client.setQueryData(
					["comments"],
					(data: { pages: Post[][] } | undefined) => {
						if (!data) return;
						return {
							pages: data.pages.map((page) =>
								page.map((post) => {
									if (post.userId === user?.id) {
										return {
											...post,
											username,
										};
									}
									return post;
								}),
							),
						};
					},
				);

				client.invalidateQueries({
					predicate: (query) => query.queryKey[0] === "post",
				});
			}

			client.setQueryData(
				["homeFeed"],
				(data: { pages: Post[][] } | undefined) => {
					if (!data) return;
					return {
						pages: data.pages.map((page) =>
							page.map((post) => {
								if (post.userId === user?.id) {
									return {
										...post,
										username,
									};
								}
								return post;
							}),
						),
					};
				},
			);
		},
	});

	const { data, isLoading } = useQuery({
		queryKey: ["user", user?.username],
		queryFn: async () =>
			(await (
				await fetch(`/api/user?username=${user?.username}`)
			).json()) as User,
	});

	useEffect(() => {
		if (data?.username) {
			setUsername(data.username);
		}

		if (data?.bio) {
			setBio(data.bio);
		}
	}, [data]);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				if (username === "" || username.length > 16 || bio.length > 250) return;
				usernameMutation.mutate();
			}}
			className="flex gap-2.5 flex-col w-fit"
		>
			<Card className="w-[360px] h-[375px] bg-background">
				{isLoading ? (
					<div className="justify-center h-[375px] items-center flex">
						<Spinner size="xl" />
					</div>
				) : (
					<>
						<CardHeader>
							<CardTitle>Update your details</CardTitle>
							<CardDescription>
								You&apos;re signed in as{" "}
								<Link
									className="hover:underline"
									href={`/user/${user?.username}`}
								>
									{user?.fullName}
								</Link>
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col">
							<div className="grid w-full items-center gap-4">
								<div className="flex flex-col space-y-1.5">
									<Label htmlFor="username">Username</Label>
									<input
										type="text"
										placeholder="Username"
										id="username"
										required={true}
										value={username}
										autoComplete="off"
										onChange={(e) => {
											if (!e.target.value.match(/^\w*$/g)) {
												setInvalidUsername(true);
												return;
											}
											setInvalidUsername(false);

											setUsername(e.target.value?.toLocaleLowerCase());
											setUsernameTaken(false);
											if (e.target.value.length > 16) setUsernameTooLong(true);
											else setUsernameTooLong(false);
										}}
										className="border dark:bg-ring/10 dark:focus:border-foreground/25 focus:border-ring outline-none rounded-sm px-2 py-1"
									/>
									<p
										className={`text-sm text-danger ${
											!usernameTaken && "hidden"
										}`}
									>
										Username already exists.
									</p>
									<p
										className={`text-sm text-danger ${
											!usernameTooLong && "hidden"
										}`}
									>
										Username can&apos;t be longer than 16 characters.
									</p>
									<p
										className={`text-sm text-danger ${
											!invalidUsername && "hidden"
										}`}
									>
										Username can only include alphanumeric characters (a-z, 0-9)
										and underscores.
									</p>
								</div>

								<div className="flex flex-col relative space-y-1.5">
									<Label htmlFor="bio">Bio</Label>
									<textarea
										placeholder="Bio"
										autoComplete="off"
										id="bio"
										value={bio}
										onChange={(e) => {
											setBio(e.target.value);
											if (e.target.value.length > 250) setBioTooLong(true);
											else setBioTooLong(false);
										}}
										rows={3}
										className="border !h-fit dark:focus:border-foreground/25 dark:bg-ring/10 focus:border-ring outline-none rounded-sm px-2 py-1 resize-none"
									/>
									<p
										className={`text-sm text-danger ${!bioTooLong && "hidden"}`}
									>
										Your bio can&apos;t be longer than 250 characters.
									</p>
								</div>
							</div>
						</CardContent>
						<CardFooter className="w-full flex items-end justify-between">
							<DialogClose
								type="button"
								className="rounded-md border text-danger hover:bg-danger/5 hover:border-danger/50 transition-colors py-1.5 px-2.5"
							>
								Cancel
							</DialogClose>
							<DialogClose
								type="submit"
								className="rounded-md border hover:bg-main/10 transition-colors hover:border-main/50 text-main py-1.5 px-2.5"
							>
								Save
							</DialogClose>
						</CardFooter>
					</>
				)}
			</Card>
		</form>
	);
}
