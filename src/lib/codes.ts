/**
 * Affiliate code generation, slugging, and validation.
 * Human-readable labels (e.g. "Ahmed X", "Majed Dash Ahmed X 10") live in `name`;
 * `code` is the unique tracking slug stored in URLs and APIs.
 */

const MAX_CODE_LEN = 80;

/**
 * URL-safe slug from arbitrary input (Latin letters, digits, spaces → hyphen).
 */
export function generateCodeSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, MAX_CODE_LEN);
}

/**
 * Normalizes user-entered code for storage (unique key).
 */
export function normalizeStoredCode(raw: string): string {
  return generateCodeSlug(raw);
}

/**
 * Auto-generate a unique-looking code from a display name.
 */
export function generateAutoCode(name: string): string {
  const slug = generateCodeSlug(name) || "aff";
  const suffix = Date.now().toString(36);
  const base = `${slug}-${suffix}`;
  return base.substring(0, MAX_CODE_LEN);
}

/**
 * Validates manual or generated code input before normalization.
 */
export function validateCodeFormat(code: string): {
  valid: boolean;
  message?: string;
} {
  if (!code || code.trim().length === 0) {
    return { valid: false, message: "الكود مطلوب" };
  }

  const trimmed = code.trim();

  if (trimmed.length > MAX_CODE_LEN) {
    return {
      valid: false,
      message: `الكود يجب أن لا يتجاوز ${MAX_CODE_LEN} حرفاً`,
    };
  }

  const normalized = normalizeStoredCode(trimmed);

  if (normalized.length < 3) {
    return {
      valid: false,
      message: "الكود يجب أن يتضمن 3 أحرف لاتينية أو أرقام على الأقل بعد التنسيق",
    };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    return {
      valid: false,
      message: "صيغة الكود غير صالحة — استخدم أحرفاً لاتينية وأرقاماً وشرطات",
    };
  }

  return { valid: true };
}

/** @deprecated Prefer normalizeStoredCode */
export function normalizeCode(code: string): string {
  return normalizeStoredCode(code);
}

export function generateCodeSuggestions(name: string): string[] {
  const slug = generateCodeSlug(name) || "partner";
  const short = Date.now().toString(36).slice(-4);

  return [
    slug,
    `${slug}-pro`,
    `${slug}-vip`,
    `${slug}-${short}`,
  ].map((s) => s.substring(0, MAX_CODE_LEN));
}
