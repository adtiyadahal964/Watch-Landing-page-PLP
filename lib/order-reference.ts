import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const secret = () => process.env.ORDER_SIGNING_SECRET || process.env.GOOGLE_PRIVATE_KEY || "";

export function createOrderReference(orderId: string) {
  if (!secret()) throw new Error("Server configuration is incomplete: ORDER_SIGNING_SECRET");
  const signature = createHmac("sha256", secret()).update(orderId).digest("base64url");
  return `${orderId}.${signature}`;
}

export function verifyOrderReference(reference: string | undefined) {
  if (!reference || !secret()) return null;
  const separator = reference.lastIndexOf(".");
  if (separator < 1) return null;
  const orderId = reference.slice(0, separator);
  const signature = reference.slice(separator + 1);
  const expected = createHmac("sha256", secret()).update(orderId).digest("base64url");
  const suppliedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (suppliedBuffer.length !== expectedBuffer.length || !timingSafeEqual(suppliedBuffer, expectedBuffer)) return null;
  return /^HIMA-\d{8}-[A-F0-9]{8}$/.test(orderId) ? orderId : null;
}
