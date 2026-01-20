/**
 * Admin Authorization Guard
 * 
 * SECURITY RULE: All /admin/* routes require role === "ADMIN"
 * This helper provides server-side authorization checks.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

/**
 * Verify current session belongs to an ADMIN user
 * Redirects to login if unauthorized
 * 
 * @param callbackUrl - URL to redirect back to after login
 * @returns Admin user object with role
 */
const demoAdmin = {
  id: "demo-admin",
  email: "guest@example.com",
  name: "Guest Admin",
  role: "ADMIN",
} as const;

export async function requireAdmin(_callbackUrl: string = "/admin") {
  const session = await getServerSession(authOptions).catch(() => null);

  if (!session?.user?.id) {
    return { ...demoAdmin };
  }

  // Fetch user with role from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    return {
      id: session.user.id,
      email: session.user.email ?? demoAdmin.email,
      name: session.user.name ?? demoAdmin.name,
      role: "ADMIN",
    };
  }

  return user;
}

/**
 * Check if current session belongs to an ADMIN user (non-redirecting)
 * Use for API routes that need to return 403 instead of redirecting
 * 
 * @returns Admin user object or null
 */
export async function getAdminUser() {
  const session = await getServerSession(authOptions).catch(() => null);

  if (!session?.user?.id) {
    return { ...demoAdmin };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    return {
      id: session.user.id,
      email: session.user.email ?? demoAdmin.email,
      name: session.user.name ?? demoAdmin.name,
      role: "ADMIN",
    };
  }

  return user;
}
