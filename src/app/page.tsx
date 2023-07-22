import Feed from "@/components/Feed";
import Header from "@/components/header/Header";
import NewPost from "@/components/newPost/NewPost";
import { auth } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = auth();

  return (
    <main className="max-w-3xl h-full flex flex-col w-full mx-auto px-2.5">
      <Header />
      {userId && <NewPost />}
      <Feed />
    </main>
  );
}
