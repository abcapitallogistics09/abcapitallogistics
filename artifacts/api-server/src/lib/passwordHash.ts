import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

/** Hash a plain-text password using scrypt. Returns `salt:hash`. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/** Verify a plain-text password against a stored `salt:hash` string. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  try {
    const hashBuf = Buffer.from(hash, "hex");
    const verify = scryptSync(password, salt, 64);
    return timingSafeEqual(hashBuf, verify);
  } catch {
    return false;
  }
}
