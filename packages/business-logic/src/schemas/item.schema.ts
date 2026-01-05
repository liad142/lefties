import { z } from "zod";
import { ITEM_STATUS, FOOD_TAGS, MIN_DISCOUNT_PERCENTAGE, MAX_DISCOUNT_PERCENTAGE, MAX_ITEM_QUANTITY } from "@food-rescue/config";

export const itemSchema = z.object({
  id: z.string().uuid(),
  store_id: z.string().uuid(),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  original_price: z.number().positive("Price must be positive"),
  discount_price: z.number().positive("Discount price must be positive"),
  quantity: z.number().int().min(0).max(MAX_ITEM_QUANTITY),
  status: z.enum([ITEM_STATUS.AVAILABLE, ITEM_STATUS.SOLD_OUT, ITEM_STATUS.EXPIRED]).default(ITEM_STATUS.AVAILABLE),
  tags: z.array(
    z.enum([
      FOOD_TAGS.MEATY,
      FOOD_TAGS.DAIRY,
      FOOD_TAGS.VEGAN,
      FOOD_TAGS.VEGETARIAN,
      FOOD_TAGS.GLUTEN_FREE,
      FOOD_TAGS.KOSHER,
    ])
  ).default([]),
  image_url: z.string().url().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
}).refine(
  (data) => data.discount_price < data.original_price,
  {
    message: "Discount price must be less than original price",
    path: ["discount_price"],
  }
).refine(
  (data) => {
    const discountPercentage = ((data.original_price - data.discount_price) / data.original_price) * 100;
    return discountPercentage >= MIN_DISCOUNT_PERCENTAGE && discountPercentage <= MAX_DISCOUNT_PERCENTAGE;
  },
  {
    message: `Discount must be between ${MIN_DISCOUNT_PERCENTAGE}% and ${MAX_DISCOUNT_PERCENTAGE}%`,
    path: ["discount_price"],
  }
);

export const createItemSchema = itemSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateItemSchema = itemSchema
  .omit({
    id: true,
    store_id: true,
    created_at: true,
    updated_at: true,
  })
  .partial();

export type Item = z.infer<typeof itemSchema>;
export type CreateItem = z.infer<typeof createItemSchema>;
export type UpdateItem = z.infer<typeof updateItemSchema>;
