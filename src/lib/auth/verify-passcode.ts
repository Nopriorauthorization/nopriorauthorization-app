import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export type PasscodeVerifyResult = {
  verified: boolean;
  error?: string;
  lockedUntil?: Date;
  attemptsRemaining?: number;
};

/**
 * Verify a user's vault passcode
 * Returns { verified: true } if passcode is correct or if user has no passcode set
 * Returns error information if verification fails
 */
export async function verifyPasscode(
  userId: string,
  passcode: string | undefined
): Promise<PasscodeVerifyResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { security: true },
  });

  if (!user) {
    return { verified: false, error: "User not found" };
  }

  // If no passcode set, verification automatically passes
  if (!user.security?.vaultPasscodeHash) {
    return { verified: true };
  }

  // Passcode is required but not provided
  if (!passcode) {
    return { verified: false, error: "Vault passcode required" };
  }

  // Check if locked out
  if (
    user.security.passcodeLockedUntil &&
    user.security.passcodeLockedUntil > new Date()
  ) {
    return {
      verified: false,
      error: "Too many attempts. Please try again later.",
      lockedUntil: user.security.passcodeLockedUntil,
    };
  }

  // Verify passcode
  const isValid = await bcrypt.compare(passcode, user.security.vaultPasscodeHash);

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
      return {
        verified: false,
        error: `Too many attempts. Try again in ${LOCKOUT_MINUTES} minutes.`,
        attemptsRemaining: 0,
      };
    }

    return {
      verified: false,
      error: "Incorrect passcode",
      attemptsRemaining: MAX_ATTEMPTS - attempts,
    };
  }

  // Reset attempts on success
  await prisma.userSecurity.update({
    where: { userId: user.id },
    data: {
      passcodeAttempts: 0,
      passcodeLockedUntil: null,
    },
  });

  return { verified: true };
}

/**
 * Check if a user has a passcode set
 */
export async function hasPasscodeSet(userId: string): Promise<boolean> {
  const security = await prisma.userSecurity.findUnique({
    where: { userId },
    select: { vaultPasscodeHash: true },
  });

  return !!security?.vaultPasscodeHash;
}
