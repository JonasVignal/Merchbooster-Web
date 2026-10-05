import crypto from "crypto";

export const ADMIN_COOKIE = "admin_session";
const SECRET = process.env.NEXTAUTH_SECRET || "supersecret";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function createAdminToken(): string {
  const payload = `admin:${Date.now() + MAX_AGE_SECONDS * 1000}`;
  const signature = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}.${signature}`).toString("base64url");
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [payload, signature] = decoded.split(".");
    if (!payload || !signature) return false;

    const expectedSignature = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    if (signature !== expectedSignature) return false;

    const expiresAt = Number(payload.split(":")[1]);
    return Number.isFinite(expiresAt) && Date.now() < expiresAt;
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE_MAX_AGE = MAX_AGE_SECONDS;
