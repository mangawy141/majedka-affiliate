/**
 * Admin authentication: bcrypt password hashing and JWT sessions (jose).
 */

import bcrypt from "bcryptjs";
import * as jose from "jose";

const BCRYPT_ROUNDS = 12;

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length >= 32) {
    return new TextEncoder().encode(secret);
  }
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "[auth] JWT_SECRET missing or short — using a dev-only key. Set JWT_SECRET in .env.local.",
    );
    return new TextEncoder().encode(
      "dev-only-32-char-secret-key!!!!!!",
    );
  }
  throw new Error(
    "JWT_SECRET must be set to a strong secret (at least 32 characters)",
  );
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signAdminToken(
  adminId: string,
  expiresIn: string = "24h",
): Promise<string> {
  const key = getJwtSecretKey();
  return new jose.SignJWT({ sub: adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function verifyAdminToken(
  token: string | null | undefined,
): Promise<string | null> {
  if (!token?.trim()) return null;
  try {
    const key = getJwtSecretKey();
    const { payload } = await jose.jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    const sub = payload.sub;
    return typeof sub === "string" ? sub : null;
  } catch {
    return null;
  }
}

export interface AdminSession {
  adminId: string;
  username: string;
  createdAt: Date;
  expiresAt: Date;
}

export async function validateCredentials(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return verifyPassword(password, hashedPassword);
}
