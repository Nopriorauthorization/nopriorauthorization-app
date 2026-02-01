import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/db";
import { generateNpaId, generateDisplayAlias } from "@/lib/npa-id";
import {
  logAccountCreated,
  logNpaIdGenerated,
  getIdentityRequestMetadata,
} from "@/lib/identity-audit";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate NPA Health ID - the anchor for all future records
    // This ID is immutable, non-sequential, and never recycled
    const npaId = generateNpaId();
    const npaIdAlias = generateDisplayAlias(npaId);

    // Create user with NPA ID
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name,
        npaId,
        npaIdAlias,
      },
    });

    // Get request metadata for audit logging
    const { ipAddress, userAgent } = getIdentityRequestMetadata(request);

    // Log identity events (fire-and-forget, non-blocking)
    await Promise.all([
      logAccountCreated(user.id, npaId, ipAddress, userAgent),
      logNpaIdGenerated(user.id, npaId, ipAddress, userAgent),
    ]);

    // Track analytics
    await prisma.analytics.create({
      data: {
        event: "user_signup",
        userId: user.id,
        metadata: { source: "web", hasNpaId: true },
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        userId: user.id,
        npaId: npaIdAlias, // Return human-readable alias for display
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
