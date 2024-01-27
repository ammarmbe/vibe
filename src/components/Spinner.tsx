export default function Spinner({ size }: { size: "sm" | "md" | "lg" | "xl" }) {
	const sizeClasses = {
		sm: "w-5 h-5",
		md: "w-7 h-7",
		lg: "w-8 h-8",
		xl: "w-9 h-9",
	};

	return (
		<div
			className={`${sizeClasses[size]} border-4 border-dashed rounded-full animate-spin border-main`}
		/>
	);
}
