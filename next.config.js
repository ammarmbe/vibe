/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.clerk.com",
			},
		],
	},
	experimental: {
		missingSuspenseWithCSRBailout: false,
	},
};

module.exports = nextConfig;
