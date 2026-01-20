// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (process.env.INTERNAL_ACCESS_BYPASS === "true") {
          return true;
        }

        // ✅ PUBLIC routes — no login required
        const publicRoutes = [
          "/",
          "/home",
          "/about",
          "/pricing",
          "/characters",
          "/chat",
          "/login",
          "/signup",
          "/subscribe",
          "/api/chat",
          "/api/peppi",
          "/api/beau-tox",
          "/api/filla-grace",
          "/api/slim-t",
          "/api/harmony",
          "/api/auth",
          "/api/vault/features",
          "/api/vault/red-flags",
          "/api/vault/before-after",
          "/api/vault/trusted-circle",
          "/api/vault/provider-tracker",
          "/vault",
          "/vault/priority",
        ];

        if (
          publicRoutes.includes(pathname) ||
          pathname.startsWith("/_next") ||
          pathname.includes(".") ||
          pathname.startsWith("/characters") ||
          pathname.startsWith("/api/auth")
        ) {
          return true;
        }

        // 🔐 Require auth for everything else
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);
};

// ✅ Exclude public API routes from middleware entirely
export const config = {
  matcher: ["/((?!api/vault|api/stripe/webhook|_next|favicon.ico).*)"],
};
