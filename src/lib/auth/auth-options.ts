import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

/**
 * NPA Authentication Configuration
 * 
 * DEV NOTE (REQUIRED):
 * "Authentication establishes patient ownership and trust.
 * This flow must remain calm, minimal, and compliant.
 * No medical claims or analytics belong at login."
 * 
 * SECURITY REQUIREMENTS (NON-NEGOTIABLE):
 * - HTTPS enforced (via deployment)
 * - Rate limiting on login attempts (via middleware)
 * - Secure, HTTP-only cookies
 * - Session expiration enforced
 * - No auth secrets in client code
 * - No PHI stored in auth tables
 */

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: { subscription: true },
        });

        if (!user) {
          // Log failed login attempt (user not found)
          await logFailedLogin(credentials.email.toLowerCase(), req);
          throw new Error("No account found with this email");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValidPassword) {
          // Log failed login attempt (wrong password)
          await logFailedLogin(user.email, req, user.id, user.npaId);
          throw new Error("Invalid password");
        }

        // Check if account is disabled/suspended
        if (user.isDisabled || user.npaStatus === "SUSPENDED") {
          await logFailedLogin(user.email, req, user.id, user.npaId, "Account disabled");
          throw new Error("This account has been disabled. Please contact support.");
        }

        // Log successful login
        await logSuccessfulLogin(user.id, user.npaId, req);

        // Update last access time
        await prisma.user.update({
          where: { id: user.id },
          data: { lastAccessAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          npaId: user.npaId,
          subscriptionStatus: user.subscription?.status || "inactive",
          role: user.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.npaId = user.npaId;
        token.subscriptionStatus = user.subscriptionStatus;
        token.role = user.role;
      }

      // Handle session updates (e.g., after subscription change)
      if (trigger === "update" && session?.subscriptionStatus) {
        token.subscriptionStatus = session.subscriptionStatus;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.npaId = token.npaId as string;
        session.user.subscriptionStatus = token.subscriptionStatus as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  events: {
    // Log signout events
    async signOut({ token }) {
      if (token?.id && token?.npaId) {
        try {
          await prisma.identityAuditLog.create({
            data: {
              userId: token.id as string,
              npaId: token.npaId as string,
              action: "LOGOUT",
              metadata: { method: "user_initiated" },
            },
          });
        } catch (error) {
          console.error("Failed to log signout:", error);
        }
      }
    },
  },
};

// Helper function to log successful login
async function logSuccessfulLogin(
  userId: string,
  npaId: string | null,
  req: any
) {
  try {
    const metadata = getRequestMetadata(req);
    await prisma.identityAuditLog.create({
      data: {
        userId,
        npaId,
        action: "LOGIN",
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
        metadata: { success: true },
      },
    });
  } catch (error) {
    console.error("Failed to log login:", error);
  }
}

// Helper function to log failed login attempts
async function logFailedLogin(
  email: string,
  req: any,
  userId?: string,
  npaId?: string | null,
  reason?: string
) {
  try {
    const metadata = getRequestMetadata(req);
    await prisma.identityAuditLog.create({
      data: {
        userId: userId || null,
        npaId: npaId || null,
        action: "LOGIN_FAILED",
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
        metadata: {
          email,
          reason: reason || "Invalid credentials",
        },
      },
    });
  } catch (error) {
    console.error("Failed to log failed login:", error);
  }
}

// Extract request metadata for audit logging
function getRequestMetadata(req: any): { ipAddress: string | null; userAgent: string | null } {
  try {
    // In NextAuth, request info comes through differently
    const headers = req?.headers || {};
    const ipAddress =
      headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      headers["x-real-ip"] ||
      null;
    const userAgent = headers["user-agent"] || null;
    return { ipAddress, userAgent };
  } catch {
    return { ipAddress: null, userAgent: null };
  }
}

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    id: string;
    npaId?: string | null;
    subscriptionStatus: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      npaId?: string | null;
      subscriptionStatus: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    npaId?: string | null;
    subscriptionStatus: string;
    role: string;
  }
}
