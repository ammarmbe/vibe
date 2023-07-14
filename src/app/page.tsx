import Header from "@/components/header/Header";
import HomeFeed from "@/components/HomeFeed";
import NewPost from "@/components/newPost/NewPost";
import { auth } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = auth();

  return (
    <main className="max-w-3xl w-full mx-auto px-2.5">
      <Header />
      {userId && <NewPost />}
      <HomeFeed />
    </main>
  );
}
