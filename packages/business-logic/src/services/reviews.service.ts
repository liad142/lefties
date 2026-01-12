import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@food-rescue/database/types";
import { ORDER_STATUS } from "@food-rescue/config";

type Review = Database["public"]["Tables"]["reviews"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];

export interface CreateReviewInput {
  order_id: string;
  rating: number;
  comment?: string;
  photo_urls?: string[];
}

export interface CreateReviewResult {
  success: boolean;
  review?: Review;
  error?: string;
}

/**
 * Create a review for a completed order
 * This function handles all business logic validation and database operations
 * The store's average_rating and review_count will be automatically updated by database triggers
 *
 * @param supabase - Supabase client instance
 * @param userId - The authenticated user's ID
 * @param input - Review data (order_id, rating, comment)
 * @returns Result object with success status, review data, or error message
 */
export async function createReview(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: CreateReviewInput
): Promise<CreateReviewResult> {
  try {
    // 1. Fetch the order to validate ownership and status
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, customer_id, store_id, item_id, status")
      .eq("id", input.order_id)
      .single();

    if (orderError || !order) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    // 2. Validate that the user owns this order
    if ((order as any).customer_id !== userId) {
      return {
        success: false,
        error: "You can only review your own orders",
      };
    }

    // 3. Validate that the order is completed
    if ((order as any).status !== ORDER_STATUS.COMPLETED) {
      return {
        success: false,
        error: "You can only review completed orders",
      };
    }

    // 4. Check if a review already exists for this order
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("order_id", input.order_id)
      .maybeSingle();

    if (existingReview) {
      return {
        success: false,
        error: "You have already reviewed this order",
      };
    }

    // 5. Insert the review
    // Note: store's average_rating and review_count will be automatically updated by database triggers
    const { data: review, error: insertError } = await (supabase
      .from("reviews") as any)
      .insert({
        order_id: input.order_id,
        store_id: (order as any).store_id,
        customer_id: userId,
        rating: input.rating,
        comment: input.comment || null,
        photo_urls: input.photo_urls || [],
      })
      .select()
      .single();

    if (insertError || !review) {
      return {
        success: false,
        error: insertError?.message || "Failed to create review",
      };
    }

    return {
      success: true,
      review,
    };
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      success: false,
      error: "An unexpected error occurred while creating the review",
    };
  }
}

/**
 * Check if a user can review a specific order
 * @param supabase - Supabase client instance
 * @param userId - The authenticated user's ID
 * @param orderId - The order ID to check
 * @returns True if the user can review this order
 */
export async function canReviewOrder(
  supabase: SupabaseClient<Database>,
  userId: string,
  orderId: string
): Promise<boolean> {
  // Fetch order and check if review exists
  const [orderResult, reviewResult] = await Promise.all([
    supabase
      .from("orders")
      .select("customer_id, status")
      .eq("id", orderId)
      .single(),
    supabase
      .from("reviews")
      .select("id")
      .eq("order_id", orderId)
      .maybeSingle(),
  ]);

  const order = orderResult.data;
  const existingReview = reviewResult.data;

  // User can review if:
  // 1. Order exists and belongs to them
  // 2. Order is completed
  // 3. No review exists yet
  return (
    order !== null &&
    (order as any).customer_id === userId &&
    (order as any).status === ORDER_STATUS.COMPLETED &&
    existingReview === null
  );
}

/**
 * Get reviews for a specific store with pagination
 * @param supabase - Supabase client instance
 * @param storeId - The store ID
 * @param limit - Number of reviews to fetch
 * @param offset - Offset for pagination
 * @returns Array of reviews with customer profiles
 */
export async function getStoreReviews(
  supabase: SupabaseClient<Database>,
  storeId: string,
  limit: number = 20,
  offset: number = 0
) {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      photo_urls,
      created_at,
      customer:profiles!customer_id (
        id,
        full_name
      )
    `)
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch reviews: ${error.message}`);
  }

  return data;
}

/**
 * Calculate rating distribution for a store
 * @param supabase - Supabase client instance
 * @param storeId - The store ID
 * @returns Object with counts for each rating (1-5)
 */
export async function getRatingDistribution(
  supabase: SupabaseClient<Database>,
  storeId: string
) {
  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("store_id", storeId);

  if (error) {
    throw new Error(`Failed to fetch rating distribution: ${error.message}`);
  }

  // Initialize distribution
  const distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  // Count ratings
  data.forEach((review) => {
    const rating = (review as any).rating as 1 | 2 | 3 | 4 | 5;
    distribution[rating]++;
  });

  return distribution;
}
