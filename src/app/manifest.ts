import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Vibe",
		short_name: "Vibe",
		theme_color: "#cf202f",
		background_color: "#cf202f",
		display: "standalone",
		orientation: "portrait",
		scope: "/",
		start_url: "/",
		icons: [
			{
				src: "images/icon-72x72.png",
				sizes: "72x72",
				type: "image/png",
			},
			{
				src: "images/icon-96x96.png",
				sizes: "96x96",
				type: "image/png",
			},
			{
				src: "images/icon-128x128.png",
				sizes: "128x128",
				type: "image/png",
			},
			{
				src: "images/icon-144x144.png",
				sizes: "144x144",
				type: "image/png",
			},
			{
				src: "images/icon-152x152.png",
				sizes: "152x152",
				type: "image/png",
			},
			{
				src: "images/icon-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "images/icon-384x384.png",
				sizes: "384x384",
				type: "image/png",
			},
			{
				src: "images/icon-512x512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
	};
}
