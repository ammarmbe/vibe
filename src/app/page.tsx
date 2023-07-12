import Header from "@/components/header/Header";
import NewPost from "@/components/newPost/NewPost";

export default function Home() {
  return (
    <main className="max-w-3xl w-full mx-auto px-2.5">
      <Header />
      <NewPost />
    </main>
  );
}
