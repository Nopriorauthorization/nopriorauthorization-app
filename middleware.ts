// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (process.env.INTERNAL_ACCESS_BYPASS === "true") return true;
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// ✅ Exclude /api/vault routes from middleware entirely
export const config = {
  matcher: [
    "/((?!api/vault|api/stripe/webhook|_next|favicon.ico).*)",
  ],
};
