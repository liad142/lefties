import type { Database } from "@food-rescue/database/types";

type Store = Database["public"]["Tables"]["stores"]["Row"];

/**
 * Check if a store is active and can accept orders
 * @param store - The store to check
 * @returns True if the store is active
 */
export function isStoreActive(store: Store): boolean {
  return store.is_approved === true;
}

/**
 * Calculate distance between two geographic points (simplified)
 * This is a placeholder - in production, use PostGIS ST_Distance
 * @param location1 - First location
 * @param location2 - Second location
 * @returns Distance in meters (placeholder)
 */
export function calculateDistance(location1: unknown, location2: unknown): number {
  // TODO: Implement actual PostGIS distance calculation
  // For now, return a placeholder value
  return 0;
}
