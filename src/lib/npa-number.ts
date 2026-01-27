/**
 * NPA Number Generation Utility
 * 
 * Generates unique, non-sequential, non-guessable NPA Numbers
 * Format: NPA-XXXX-XXXX (e.g., NPA-8472-39XQ)
 * 
 * Rules:
 * - Human-readable
 * - Non-sequential (no incrementing numbers)
 * - Non-guessable (cryptographically random)
 * - Immutable once issued
 * - One per user (lifetime)
 */

import { randomBytes } from 'crypto';

// Character set for NPA numbers (excludes ambiguous characters: 0, O, I, 1, L)
const CHARSET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

/**
 * Generates a single segment of the NPA number
 * @param length - Number of characters in the segment
 * @returns A random string of specified length
 */
function generateSegment(length: number): string {
  const bytes = randomBytes(length);
  let result = '';
  
  for (let i = 0; i < length; i++) {
    // Use modulo to map byte to charset index
    result += CHARSET[bytes[i] % CHARSET.length];
  }
  
  return result;
}

/**
 * Generates a complete NPA Number
 * Format: NPA-XXXX-XXXX
 * 
 * @returns A unique NPA Number string
 */
export function generateNpaNumber(): string {
  const segment1 = generateSegment(4);
  const segment2 = generateSegment(4);
  
  return `NPA-${segment1}-${segment2}`;
}

/**
 * Validates an NPA Number format
 * @param npaNumber - The NPA number to validate
 * @returns boolean indicating if format is valid
 */
export function isValidNpaNumberFormat(npaNumber: string): boolean {
  const pattern = /^NPA-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/;
  return pattern.test(npaNumber);
}

/**
 * Masks an NPA Number for partial display
 * Shows only the last 4 characters
 * @param npaNumber - The full NPA number
 * @returns Masked version like "NPA-****-39XQ"
 */
export function maskNpaNumber(npaNumber: string): string {
  if (!isValidNpaNumberFormat(npaNumber)) {
    return 'Invalid NPA Number';
  }
  
  const lastSegment = npaNumber.slice(-4);
  return `NPA-****-${lastSegment}`;
}
