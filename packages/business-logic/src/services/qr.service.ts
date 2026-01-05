import crypto from "crypto";

/**
 * Generate a unique QR code hash for an order
 * @param orderId - The order ID
 * @param customerId - The customer ID
 * @returns A unique hash string
 */
export function generateQRCodeHash(orderId: string, customerId: string): string {
  const timestamp = Date.now().toString();
  const data = `${orderId}-${customerId}-${timestamp}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Verify a QR code hash
 * @param hash - The QR code hash to verify
 * @param orderId - The order ID to verify against
 * @returns True if the hash is valid
 */
export function verifyQRCodeHash(hash: string, storedHash: string): boolean {
  return hash === storedHash;
}
