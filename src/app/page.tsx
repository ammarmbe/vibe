import Feed from "@/components/Feed";
import Spinner from "@/components/Spinner";
import Header from "@/components/header/Header";
import NewPost from "@/components/newPost/NewPost";
import { ClerkLoaded, ClerkLoading, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  if (user && !user.unsafeMetadata.username) {
    redirect("/new-user");
  }

  return (
    <main className="max-w-3xl h-full flex flex-col w-full mx-auto px-2.5">
      <ClerkLoading>
        <div className="w-full flex h-full items-center justify-center">
          <Spinner size="xl" />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <Header />
        {user && <NewPost />}
        <Feed />
      </ClerkLoaded>
    </main>
  );
}
