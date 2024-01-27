import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LinkHandler({
	href,
	children,
	className,
	onMouseEnter,
	onMouseLeave,
}: {
	href: string;
	children: React.ReactNode;
	className?: string;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}) {
	const pathname = usePathname();

	return (
		<Link
			href={href}
			className={className}
			onClick={() => {
				if (href !== pathname)
					window.dispatchEvent(new Event("myCustomEvent", { bubbles: true }));
			}}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{children}
		</Link>
	);
}
