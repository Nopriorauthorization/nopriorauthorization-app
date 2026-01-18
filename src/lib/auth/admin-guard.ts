/**
 * Admin Authorization Guard
 * 
 * SECURITY RULE: All /admin/* routes require role === "ADMIN"
 * This helper provides server-side authorization checks.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

/**
 * Verify current session belongs to an ADMIN user
 * Redirects to login if unauthorized
 * 
 * @param callbackUrl - URL to redirect back to after login
 * @returns Admin user object with role
 */
export async function requireAdmin(callbackUrl: string = "/admin") {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
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
    redirect("/"); // Non-admins redirected to homepage
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
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
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
    return null;
  }

  return user;
}
