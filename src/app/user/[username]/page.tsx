import Header from "@/components/Header/Header";
import { Metadata } from "next/types";
import getQueryClient from "@/lib/utils";
import User from "@/components/UserPage/User";

interface Props {
	params: {
		username: string;
	};
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const user = await (
		await fetch(`${process.env.URL}/api/user?username=${params.username}`)
	).json();

	return {
		title: user.name ? `${user.name} – Vibe` : "Vibe",
		description:
			"Vibe is a social media web app all about connecting with people who share your interests, and it's the perfect place to share your thoughts, photos, and videos.",
		metadataBase: new URL("https://vibe.ambe.dev"),
		openGraph: {
			description: user.bio
				? user.bio
				: "Vibe is a social media web app all about connecting with people who share your interests, and it's the perfect place to share your thoughts, photos, and videos.",
		},
	};
}

export default async function Page({ params }: Props) {
	const queryClient = getQueryClient();

	queryClient.prefetchQuery({
		queryKey: ["user", params.username],
		queryFn: async () => {
			const res = await fetch(
				`${process.env.URL}/api/user?username=${params.username}`,
			);
			return res.json();
		},
	});

	return (
		<main className="max-w-2xl h-full flex flex-col w-full mx-auto px-2.5">
			<Header />
			<User username={params.username} />
		</main>
	);
}
