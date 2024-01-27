import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { AuthObject } from "@clerk/nextjs/server";

export default authMiddleware({
	afterAuth: (auth, request) => {
		return middleware(auth, request);
	},
	publicRoutes: ["/", "/(.*)"],
});

async function middleware(auth: AuthObject, request: NextRequest) {
	const userId = auth.userId;
	const url = request.nextUrl.clone();

	if (!userId) return;

	const user = await clerkClient.users.getUser(userId);

	if (userId && !user.unsafeMetadata.username) {
		if (url.pathname === "/new-user" || url.pathname === "/api/user/username")
			return;
		url.pathname = "/new-user";
		return NextResponse.redirect(url);
	}
}

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
