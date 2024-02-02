import EditProfile from "@/components/EditProfile";

export const runtime = "edge";

export default function Page() {
	return (
		<main className="max-w-2xl h-full flex flex-col items-center w-full mx-auto px-2.5 py-5">
			<EditProfile newUser={true} />
		</main>
	);
}
