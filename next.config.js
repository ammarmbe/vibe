const withSerwist = require("@serwist/next").default({
	swSrc: "src/app/sw.ts",
	swDest: "public/sw.js",
	cacheOnFrontEndNav: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = withSerwist({
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.clerk.com",
			},
		],
	},
});

module.exports = nextConfig;
