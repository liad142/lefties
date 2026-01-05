/**
 * Validate Israeli phone number
 * @param phone - Phone number to validate
 * @returns True if valid Israeli phone number
 */
export function isValidIsraeliPhone(phone: string): boolean {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");

  // Israeli phone numbers are typically 9-10 digits
  // Mobile: 05X-XXX-XXXX (10 digits)
  // Landline: 0X-XXX-XXXX (9 digits)
  if (cleaned.length < 9 || cleaned.length > 10) {
    return false;
  }

  // Must start with 0
  if (!cleaned.startsWith("0")) {
    return false;
  }

  return true;
}

/**
 * Format Israeli phone number for display
 * @param phone - Phone number to format
 * @returns Formatted phone number (e.g., "050-123-4567")
 */
export function formatIsraeliPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    // Mobile: 050-123-4567
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 9) {
    // Landline: 03-123-4567
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
  }

  return phone;
}

/**
 * Validate email address
 * @param email - Email to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize user input (prevent XSS)
 * @param input - User input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
