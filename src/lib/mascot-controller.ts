import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MascotController {
  /**
   * Check if a mascot can be activated based on safety rules
   */
  static async canActivateMascot(mascotId: string): Promise<{ allowed: boolean; reason?: string }> {
    // Rule 1: Only one mascot can be active at a time
    const activeMascots = await prisma.featureFlag.findMany({
      where: {
        key: { startsWith: 'mascot-', endsWith: '-enabled' },
        enabled: true,
        type: 'MASCOT_CONTROL',
      },
    });

    if (activeMascots.length >= 1) {
      const isCurrentActive = activeMascots.some(flag => flag.key === `mascot-${mascotId}-enabled`);
      if (!isCurrentActive) {
        return { allowed: false, reason: 'Only one mascot can be active at a time' };
      }
    }

    return { allowed: true };
  }

  /**
   * Get active script for a mascot
   */
  static async getActiveScript(mascotId: string) {
    return await prisma.mascotScript.findFirst({
      where: {
        mascotId,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Check if audio is allowed for a mascot
   */
  static async isAudioAllowed(mascotId: string): Promise<boolean> {
    const flag = await prisma.featureFlag.findUnique({
      where: { key: `mascot-${mascotId}-audio` },
    });

    return flag?.enabled ?? true; // Default to true if not set
  }

  /**
   * Check if autoplay is allowed for a mascot
   */
  static async isAutoplayAllowed(mascotId: string): Promise<boolean> {
    const flag = await prisma.featureFlag.findUnique({
      where: { key: `mascot-${mascotId}-autoplay` },
    });

    // Safety rule: autoplay is NEVER allowed
    return false;
  }

  /**
   * Get mascot configuration for safe loading
   */
  static async getMascotConfig(mascotId: string) {
    const [isEnabled, audioAllowed, autoplayAllowed, activeScript] = await Promise.all([
      prisma.featureFlag.findUnique({ where: { key: `mascot-${mascotId}-enabled` } }),
      this.isAudioAllowed(mascotId),
      this.isAutoplayAllowed(mascotId),
      this.getActiveScript(mascotId),
    ]);

    return {
      enabled: isEnabled?.enabled ?? true,
      audioAllowed,
      autoplayAllowed: false, // Hard override for safety
      activeScript,
      safetyRules: {
        oneSpeaker: true,
        noAutoplay: true,
        safeLoading: true,
      },
    };
  }

  /**
   * Validate script content before activation
   */
  static validateScriptContent(scriptContent: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic validation
    if (!scriptContent) {
      errors.push('Script content is required');
    }

    // Check for autoplay settings
    if (scriptContent.autoplayEnabled) {
      errors.push('Autoplay is not allowed for safety reasons');
    }

    // Ensure single speaker
    if (scriptContent.multiSpeaker) {
      errors.push('Only single speaker configurations are allowed');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Log mascot interaction for audit
   */
  static async logInteraction(
    mascotId: string,
    action: string,
    userId?: string,
    metadata?: any
  ) {
    await prisma.accessLog.create({
      data: {
        actorId: userId,
        action,
        resourceType: 'mascot-interaction',
        resourceId: mascotId,
        metadata: {
          mascotId,
          ...metadata,
        },
      },
    });
  }
}