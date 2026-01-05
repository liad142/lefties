import { NextResponse } from "next/server";
import { createBrowserClient } from "@food-rescue/database";

/**
 * GET /api/items
 * Fetch all available items with their store information
 */
export async function GET() {
  try {
    const supabase = createBrowserClient();

    const { data, error } = await supabase
      .from("items")
      .select(`
        *,
        stores (
          name,
          location,
          address,
          is_kosher
        )
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching items:", error);
      return NextResponse.json(
        { error: "Failed to fetch items" },
        { status: 500 }
      );
    }

    return NextResponse.json({ items: data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
