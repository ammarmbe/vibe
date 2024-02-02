import React from "react";
import HeaderButtons from "./HeaderButtons";
import HeaderTitle from "./HeaderTitle";
import { JetBrains_Mono } from "next/font/google";
import getQueryClient from "@/lib/utils";

export const jetBrains = JetBrains_Mono({
	subsets: ["latin"],
	style: ["italic", "normal"],
	weight: ["400", "500", "600", "700", "800"],
});

export default function Header({ feed }: { feed?: "Home" | "Following" }) {
	const queryClient = getQueryClient();

	queryClient.prefetchInfiniteQuery({
		queryKey: ["notifications"],
		queryFn: async ({ pageParam = 4294967295 }) => {
			const res = await fetch(`/api/notifications?notificationId=${pageParam}`);
			return await res.json();
		},
	});

	return (
		<header className="pt-3 pb-2 flex items-center justify-between">
			<HeaderTitle feed={feed} />
			<nav className="flex gap-2 items-center">
				<HeaderButtons />
			</nav>
		</header>
	);
}
