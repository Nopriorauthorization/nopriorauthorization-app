import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

// POST /api/vault/passcode/verify - Verify passcode for protected actions
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { passcode } = body;

    if (!passcode) {
      return NextResponse.json(
        { error: "Passcode required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { security: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If no passcode set, verification automatically passes
    if (!user.security?.vaultPasscodeHash) {
      return NextResponse.json({
        verified: true,
        message: "No passcode required",
      });
    }

    // Check if locked out
    if (
      user.security.passcodeLockedUntil &&
      user.security.passcodeLockedUntil > new Date()
    ) {
      const remainingMinutes = Math.ceil(
        (user.security.passcodeLockedUntil.getTime() - Date.now()) / 60000
      );
      return NextResponse.json(
        {
          error: `Too many attempts. Try again in ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}.`,
          lockedUntil: user.security.passcodeLockedUntil,
        },
        { status: 429 }
      );
    }

    // Verify passcode
    const isValid = await bcrypt.compare(
      passcode,
      user.security.vaultPasscodeHash
    );

    if (!isValid) {
      const attempts = user.security.passcodeAttempts + 1;
      const lockout = attempts >= MAX_ATTEMPTS;

      await prisma.userSecurity.update({
        where: { userId: user.id },
        data: {
          passcodeAttempts: attempts,
          passcodeLockedUntil: lockout
            ? new Date(Date.now() + LOCKOUT_MINUTES * 60000)
            : null,
        },
      });

      if (lockout) {
        return NextResponse.json(
          {
            error: `Too many attempts. Try again in ${LOCKOUT_MINUTES} minutes.`,
            attemptsRemaining: 0,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: "Incorrect passcode",
          attemptsRemaining: MAX_ATTEMPTS - attempts,
        },
        { status: 401 }
      );
    }

    // Reset attempts on success
    await prisma.userSecurity.update({
      where: { userId: user.id },
      data: {
        passcodeAttempts: 0,
        passcodeLockedUntil: null,
      },
    });

    return NextResponse.json({
      verified: true,
      message: "Passcode verified",
    });
  } catch (error) {
    console.error("Verify passcode error:", error);
    return NextResponse.json(
      { error: "Failed to verify passcode" },
      { status: 500 }
    );
  }
}
