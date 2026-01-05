import { CURRENCY } from "@food-rescue/config";

/**
 * Format a number as ILS currency
 * @param amount - The amount in shekels
 * @param includeSymbol - Whether to include the ₪ symbol (default: true)
 * @returns Formatted currency string (e.g., "₪42.00" or "42.00")
 */
export function formatCurrency(amount: number, includeSymbol = true): string {
  const formatted = amount.toFixed(2);
  return includeSymbol ? `${CURRENCY.SYMBOL}${formatted}` : formatted;
}

/**
 * Calculate discount percentage
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Discount percentage (e.g., 30 for 30% off)
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  discountedPrice: number
): number {
  if (originalPrice <= 0) return 0;
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount);
}

/**
 * Calculate discounted price from percentage
 * @param originalPrice - Original price
 * @param discountPercentage - Discount percentage (0-100)
 * @returns Discounted price
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number
): number {
  if (discountPercentage < 0 || discountPercentage > 100) {
    throw new Error("Discount percentage must be between 0 and 100");
  }
  return originalPrice * (1 - discountPercentage / 100);
}
