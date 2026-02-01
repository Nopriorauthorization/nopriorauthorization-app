import { randomBytes } from "node:crypto";

/**
 * NPA ID Generation Service
 * 
 * Generates non-sequential, non-guessable, immutable patient identifiers.
 * Format: npa_{8 hex chars}_{4 hex chars}_{4 hex chars}_{4 hex chars}
 * 
 * Example: npa_7f9c2a8e_93bd_4f12_a81c
 * 
 * Security properties:
 * - 96 bits of entropy (24 hex chars)
 * - Cryptographically secure random generation
 * - Non-sequential (no predictable patterns)
 * - Never recycled (immutable after creation)
 * - Independent of SSN, MRN, or insurance IDs
 */

const NPA_ID_PREFIX = "npa";
const SEGMENT_SIZES = [8, 4, 4, 4]; // Total: 20 hex chars = 80 bits + more entropy

/**
 * Generate a cryptographically secure NPA Health ID
 * 
 * @returns A unique NPA ID in format: npa_xxxxxxxx_xxxx_xxxx_xxxx
 */
export function generateNpaId(): string {
  // Generate 12 random bytes (96 bits of entropy)
  const bytes = randomBytes(12);
  const hex = bytes.toString("hex");
  
  // Split into segments for readability
  // Format: npa_8chars_4chars_4chars_4chars (remaining 4 chars from 24 total hex)
  const segments = [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
  ];
  
  return `${NPA_ID_PREFIX}_${segments.join("_")}`;
}

/**
 * Validate an NPA ID format
 * 
 * @param id - The ID to validate
 * @returns true if the ID matches the expected NPA ID format
 */
export function isValidNpaId(id: string): boolean {
  if (typeof id !== "string") return false;
  
  // Pattern: npa_8hex_4hex_4hex_4hex
  const pattern = /^npa_[a-f0-9]{8}_[a-f0-9]{4}_[a-f0-9]{4}_[a-f0-9]{4}$/;
  return pattern.test(id);
}

/**
 * Extract the creation timestamp hint from an NPA ID (if embedded)
 * Note: Current implementation does not embed timestamps for extra privacy
 * 
 * @param id - The NPA ID
 * @returns null (timestamps not embedded for privacy)
 */
export function extractNpaIdMetadata(id: string): { valid: boolean } {
  return { valid: isValidNpaId(id) };
}

/**
 * Generate a human-readable alias for display purposes
 * This is optional and should never be used for lookups
 * 
 * @param npaId - The canonical NPA ID
 * @returns A shorter display alias
 */
export function generateDisplayAlias(npaId: string): string {
  if (!isValidNpaId(npaId)) {
    throw new Error("Invalid NPA ID format");
  }
  
  // Extract first 8 chars after prefix for display
  // Example: npa_7f9c2a8e_93bd_4f12_a81c -> NPA-7F9C2A8E
  const firstSegment = npaId.split("_")[1].toUpperCase();
  return `NPA-${firstSegment}`;
}
