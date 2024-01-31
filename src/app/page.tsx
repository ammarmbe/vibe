import Feed from "@/components/Feed";
import Header from "@/components/header/Header";
import NewPost from "@/components/NewPost";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
	const user = await currentUser();

	return (
		<main className="max-w-2xl h-full flex flex-col w-full mx-auto px-2.5">
			<Header />
			{user && <NewPost />}
			<Feed />
		</main>
	);
}
