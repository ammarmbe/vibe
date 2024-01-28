import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "About Acme";
export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

export default async function Image() {
	const interSemiBold = fetch(
		new URL("../../public/JetBrainsMono-ExtraBoldItalic.ttf", import.meta.url),
	).then((res) => res.arrayBuffer());

	return new ImageResponse(
		<div
			style={{
				fontSize: 278,
				background: "transparent",
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "#d42148",
			}}
		>
			V
		</div>,
		{
			...size,
			fonts: [
				{
					name: "JetBrains Mono",
					data: await interSemiBold,
					style: "italic",
					weight: 800,
				},
			],
		},
	);
}
