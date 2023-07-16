import { authMiddleware } from "@clerk/nextjs";
import { db } from "./lib/db";
import { User } from "./lib/types";
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

  if (!userId) return;

  const user = (
    await db.execute("SELECT * FROM users WHERE id = :userId", { userId })
  ).rows[0] as User;

  if (user && user.username) {
    const url = request.nextUrl.clone();
    if (url.pathname == "/new-user" || url.pathname == "/api/user/username")
      return;
    url.pathname = "/new-user";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
