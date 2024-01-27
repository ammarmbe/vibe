"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import LoadingBar from "react-top-loading-bar";

export default function Loading() {
	const [progress, setProgress] = useState(0);
	const pathname = usePathname();

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setProgress(100);
	}, [pathname]);

	useEffect(() => {
		const startLoading = () => {
			setProgress(30);
		};

		window.addEventListener("myCustomEvent", startLoading);

		return () => {
			window.removeEventListener("myCustomEvent", startLoading);
		};
	});

	return (
		<LoadingBar progress={progress} onLoaderFinished={() => setProgress(0)} />
	);
}
