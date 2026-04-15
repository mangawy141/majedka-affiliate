/**
 * Generate a unique, human-readable affiliate code
 * Format: AFF-XXXXX where X is name prefix + random chars
 */
export function generateAffiliateCode(name: string): string {
  // Get first 5 letters from name, uppercase, remove spaces
  const namePrefix = name
    .replace(/\s+/g, "")
    .toUpperCase()
    .slice(0, 5)
    .padEnd(5, "X");

  // Generate random 4-character suffix
  const randomSuffix = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()
    .padEnd(4, "0");

  return `AFF-${namePrefix}${randomSuffix}`;
}

/**
 * Custom code validation (admin can set custom codes)
 */
export function validateAffiliateCode(code: string): boolean {
  // Code should be 3-20 chars, alphanumeric with hyphens
  return /^[A-Z0-9\-]{3,20}$/.test(code.toUpperCase());
}

/**
 * Generate a cleaner custom code from user input
 */
export function sanitizeAffiliateCode(code: string): string {
  return code
    .toUpperCase()
    .replace(/[^A-Z0-9\-]/g, "")
    .slice(0, 20);
}
