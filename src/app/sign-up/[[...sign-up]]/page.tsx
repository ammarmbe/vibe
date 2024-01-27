import { SignUp } from "@clerk/nextjs";

export default function Page() {
	return (
		<main className="flex items-center justify-center w-full h-full">
			<SignUp />
		</main>
	);
}
