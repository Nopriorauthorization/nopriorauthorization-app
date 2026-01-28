import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

// GET /api/vault/passcode - Check if passcode is set
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { security: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hasPasscode = !!user.security?.vaultPasscodeHash;
    const passcodeSetAt = user.security?.passcodeSetAt || null;

    return NextResponse.json({
      hasPasscode,
      passcodeSetAt,
    });
  } catch (error) {
    console.error("Passcode status error:", error);
    return NextResponse.json(
      { error: "Failed to check passcode status" },
      { status: 500 }
    );
  }
}

// POST /api/vault/passcode - Set or update passcode
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { passcode, currentPasscode } = body;

    // Validate passcode format (6-8 digits)
    if (!passcode || !/^\d{6,8}$/.test(passcode)) {
      return NextResponse.json(
        { error: "Passcode must be 6-8 digits" },
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

    // If passcode already exists, require current passcode to change
    if (user.security?.vaultPasscodeHash) {
      if (!currentPasscode) {
        return NextResponse.json(
          { error: "Current passcode required to change passcode" },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(
        currentPasscode,
        user.security.vaultPasscodeHash
      );
      if (!isValid) {
        return NextResponse.json(
          { error: "Current passcode is incorrect" },
          { status: 401 }
        );
      }
    }

    // Hash the new passcode
    const hash = await bcrypt.hash(passcode, BCRYPT_ROUNDS);

    // Upsert security record
    await prisma.userSecurity.upsert({
      where: { userId: user.id },
      update: {
        vaultPasscodeHash: hash,
        passcodeSetAt: new Date(),
        passcodeAttempts: 0,
        passcodeLockedUntil: null,
      },
      create: {
        userId: user.id,
        vaultPasscodeHash: hash,
        passcodeSetAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vault passcode set successfully",
    });
  } catch (error) {
    console.error("Set passcode error:", error);
    return NextResponse.json(
      { error: "Failed to set passcode" },
      { status: 500 }
    );
  }
}

// DELETE /api/vault/passcode - Remove passcode (requires current passcode)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPasscode } = body;

    if (!currentPasscode) {
      return NextResponse.json(
        { error: "Current passcode required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { security: true },
    });

    if (!user || !user.security?.vaultPasscodeHash) {
      return NextResponse.json(
        { error: "No passcode set" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(
      currentPasscode,
      user.security.vaultPasscodeHash
    );
    if (!isValid) {
      return NextResponse.json(
        { error: "Current passcode is incorrect" },
        { status: 401 }
      );
    }

    // Remove passcode
    await prisma.userSecurity.update({
      where: { userId: user.id },
      data: {
        vaultPasscodeHash: null,
        passcodeSetAt: null,
        passcodeAttempts: 0,
        passcodeLockedUntil: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vault passcode removed",
    });
  } catch (error) {
    console.error("Remove passcode error:", error);
    return NextResponse.json(
      { error: "Failed to remove passcode" },
      { status: 500 }
    );
  }
}
