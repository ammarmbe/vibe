import React from "react";
import HeaderButtons from "./HeaderButtons";
import HeaderTitle from "./HeaderTitle";
import { JetBrains_Mono } from "next/font/google";

export const jetBrains = JetBrains_Mono({
	subsets: ["latin"],
	style: ["italic", "normal"],
	weight: ["400", "500", "600", "700", "800"],
});

export default function Header() {
	return (
		<header className="pt-3 pb-2 flex items-center justify-between">
			<HeaderTitle />
			<nav className="flex gap-2.5 items-center">
				<HeaderButtons />
			</nav>
		</header>
	);
}
