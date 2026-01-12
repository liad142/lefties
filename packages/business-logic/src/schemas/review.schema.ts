import { z } from "zod";

/**
 * Full review schema matching the database table
 */
export const reviewSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  store_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().max(500, "Comment must be 500 characters or less").optional().nullable(),
  photo_urls: z.array(z.string().url()).max(3, "Maximum 3 photos allowed").default([]),
  created_at: z.string().datetime().optional(),
});

/**
 * Schema for creating a new review
 * Only requires order_id, rating, and optional comment
 * store_id and customer_id will be derived from the order and auth session
 */
export const createReviewSchema = z.object({
  order_id: z.string().uuid("Invalid order ID"),
  rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
  comment: z.string().max(500, "Comment must be 500 characters or less").trim().optional(),
  photo_urls: z.array(z.string().url()).max(3, "Maximum 3 photos allowed").optional().default([]),
});

/**
 * Schema for updating an existing review (optional - for edit functionality)
 */
export const updateReviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5").optional(),
  comment: z.string().max(500, "Comment must be 500 characters or less").trim().optional(),
}).refine(
  (data) => data.rating !== undefined || data.comment !== undefined,
  { message: "At least one field (rating or comment) must be provided" }
);

/**
 * Schema for querying reviews by store
 */
export const getStoreReviewsSchema = z.object({
  store_id: z.string().uuid("Invalid store ID"),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
});

// Type exports
export type Review = z.infer<typeof reviewSchema>;
export type CreateReview = z.infer<typeof createReviewSchema>;
export type UpdateReview = z.infer<typeof updateReviewSchema>;
export type GetStoreReviews = z.infer<typeof getStoreReviewsSchema>;
