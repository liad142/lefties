import { ORDER_STATUS } from "@food-rescue/config";
import type { Database } from "@food-rescue/database/types";

type Order = Database["public"]["Tables"]["orders"]["Row"];

/**
 * Calculate total price for an order
 * @param itemPrice - Price per item
 * @param quantity - Quantity ordered
 * @returns Total price
 */
export function calculateOrderTotal(itemPrice: number, quantity: number): number {
  return itemPrice * quantity;
}

/**
 * Check if an order can be cancelled
 * @param order - The order to check
 * @returns True if the order can be cancelled
 */
export function canCancelOrder(order: Order): boolean {
  return order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.CONFIRMED;
}

/**
 * Check if an order can be marked as ready
 * @param order - The order to check
 * @returns True if the order can be marked as ready
 */
export function canMarkOrderReady(order: Order): boolean {
  return order.status === ORDER_STATUS.CONFIRMED;
}

/**
 * Check if an order can be completed
 * @param order - The order to check
 * @returns True if the order can be completed
 */
export function canCompleteOrder(order: Order): boolean {
  return order.status === ORDER_STATUS.READY;
}

/**
 * Validate order status transition
 * @param currentStatus - Current order status
 * @param newStatus - New order status
 * @returns True if the transition is valid
 */
export function isValidStatusTransition(
  currentStatus: Order["status"],
  newStatus: Order["status"]
): boolean {
  const validTransitions: Record<Order["status"], Order["status"][]> = {
    [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.READY, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.READY]: [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.COMPLETED]: [],
    [ORDER_STATUS.CANCELLED]: [],
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}
