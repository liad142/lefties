// Application-wide constants

export const APP_NAME = "FoodRescueIL";

export const ROLES = {
  CUSTOMER: "customer",
  STORE_OWNER: "store_owner",
  ADMIN: "admin",
} as const;

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  READY: "ready",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const ITEM_STATUS = {
  AVAILABLE: "available",
  SOLD_OUT: "sold_out",
  EXPIRED: "expired",
} as const;

export const FOOD_TAGS = {
  MEATY: "meaty",
  DAIRY: "dairy",
  VEGAN: "vegan",
  VEGETARIAN: "vegetarian",
  GLUTEN_FREE: "gluten_free",
  KOSHER: "kosher",
} as const;

export const CURRENCY = {
  CODE: "ILS",
  SYMBOL: "₪",
} as const;

export const MAX_ITEM_QUANTITY = 50;
export const MIN_DISCOUNT_PERCENTAGE = 10;
export const MAX_DISCOUNT_PERCENTAGE = 90;
