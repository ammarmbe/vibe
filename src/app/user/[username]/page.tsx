import UserPage from "@/components/UserPage";
import { User } from "@/lib/types";
import { Metadata } from "next/types";

interface Props {
	params: {
		username: string;
	};
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const user = (await (
		await fetch(`https://vibe.ambe.dev/api/user?username=${params.username}`)
	).json()) as User;

	return {
		title: user?.name ? `${user?.name} – Vibe` : "Vibe",
		description:
			"Vibe is a social media web app all about connecting with people who share your interests, and it's the perfect place to share your thoughts, photos, and videos.",
		metadataBase: new URL("https://vibe.ambe.dev"),
		openGraph: {
			description: user?.bio
				? user?.bio
				: "Vibe is a social media web app all about connecting with people who share your interests, and it's the perfect place to share your thoughts, photos, and videos.",
		},
	};
}

export default function Page({ params }: Props) {
	return <UserPage username={params.username} />;
}
