import { NextRequest, NextResponse } from "next/server";
import { createBrowserClient } from "@food-rescue/database";
import { createReviewSchema } from "@food-rescue/business-logic";
import { createReview } from "@food-rescue/business-logic";

/**
 * POST /api/reviews
 * Create a new review for a completed order
 *
 * Request Body:
 * {
 *   "order_id": "uuid",
 *   "rating": 1-5,
 *   "comment": "optional text (max 500 chars)"
 * }
 *
 * Responses:
 * - 201: Review created successfully
 * - 400: Invalid input or business logic violation
 * - 401: Unauthorized (not logged in)
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = createBrowserClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to submit a review." },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createReviewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const reviewData = validationResult.data;

    // Call the service to create the review
    const result = await createReview(supabase, user.id, {
      order_id: reviewData.order_id,
      rating: reviewData.rating,
      comment: reviewData.comment,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Review submitted successfully",
        review: result.review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error in POST /api/reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reviews?store_id=uuid&limit=20&offset=0
 * Fetch reviews for a specific store with pagination
 *
 * Query Parameters:
 * - store_id: UUID of the store (required)
 * - limit: Number of reviews to fetch (default: 20, max: 100)
 * - offset: Offset for pagination (default: 0)
 *
 * Responses:
 * - 200: Reviews fetched successfully
 * - 400: Missing or invalid parameters
 * - 500: Server error
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createBrowserClient();
    const { searchParams } = new URL(request.url);

    const storeId = searchParams.get("store_id");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    if (!storeId) {
      return NextResponse.json(
        { error: "Missing required parameter: store_id" },
        { status: 400 }
      );
    }

    // Validate limit and offset
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Limit must be between 1 and 100" },
        { status: 400 }
      );
    }

    if (offset < 0) {
      return NextResponse.json(
        { error: "Offset must be non-negative" },
        { status: 400 }
      );
    }

    // Fetch reviews with customer information
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
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
      console.error("Error fetching reviews:", error);
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: 500 }
      );
    }

    // Fetch store rating aggregates
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("average_rating, review_count")
      .eq("id", storeId)
      .single();

    const castedStore = store as any;

    if (storeError) {
      console.error("Error fetching store ratings:", storeError);
    }

    return NextResponse.json({
      reviews: data,
      store_ratings: castedStore || { average_rating: 0, review_count: 0 },
      pagination: {
        limit,
        offset,
        total: castedStore?.review_count || 0,
      },
    });
  } catch (error) {
    console.error("Unexpected error in GET /api/reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
