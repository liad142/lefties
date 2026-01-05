import { ITEM_STATUS } from "@food-rescue/config";
import type { Database } from "@food-rescue/database/types";

type Item = Database["public"]["Tables"]["items"]["Row"];

/**
 * Check if an item is available for purchase
 * @param item - The item to check
 * @returns True if the item is available
 */
export function isItemAvailable(item: Item): boolean {
  return item.status === ITEM_STATUS.AVAILABLE && item.quantity > 0;
}

/**
 * Calculate remaining quantity after purchase
 * @param currentQuantity - Current quantity in stock
 * @param purchaseQuantity - Quantity being purchased
 * @returns Remaining quantity
 */
export function calculateRemainingQuantity(
  currentQuantity: number,
  purchaseQuantity: number
): number {
  return Math.max(0, currentQuantity - purchaseQuantity);
}

/**
 * Determine item status based on quantity
 * @param quantity - Item quantity
 * @returns Item status
 */
export function determineItemStatus(quantity: number): typeof ITEM_STATUS[keyof typeof ITEM_STATUS] {
  return quantity > 0 ? ITEM_STATUS.AVAILABLE : ITEM_STATUS.SOLD_OUT;
}
