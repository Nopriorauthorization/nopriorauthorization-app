import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    // Protect UI routes only — NEVER APIs
    "/((?!api|_next|favicon.ico).*)",
  ],
};
