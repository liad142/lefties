-- Migration: Add Reviews System with 5-Star Rating
-- Created: 2026-01-05
-- Description: Implements reviews table, updates stores table with rating aggregates, and sets up RLS policies

-- =====================================================
-- 1. CREATE REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_reviews_store_id ON reviews(store_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- =====================================================
-- 2. UPDATE STORES TABLE (Add Rating Aggregates)
-- =====================================================
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,1) DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0 CHECK (review_count >= 0);

-- Create index for sorting stores by rating
CREATE INDEX idx_stores_average_rating ON stores(average_rating DESC);

-- =====================================================
-- 3. SECURITY - ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read reviews (public)
CREATE POLICY "Public reviews"
ON reviews
FOR SELECT
USING (true);

-- Policy: Users can only create reviews for their own orders
CREATE POLICY "Rate own orders"
ON reviews
FOR INSERT
WITH CHECK (auth.uid() = customer_id);

-- Policy: Users can update their own reviews (optional - for edit functionality)
CREATE POLICY "Update own reviews"
ON reviews
FOR UPDATE
USING (auth.uid() = customer_id)
WITH CHECK (auth.uid() = customer_id);

-- Policy: Users can delete their own reviews (optional - for delete functionality)
CREATE POLICY "Delete own reviews"
ON reviews
FOR DELETE
USING (auth.uid() = customer_id);

-- =====================================================
-- 4. HELPER FUNCTION - Update Store Rating Aggregates
-- =====================================================
-- This function recalculates average_rating and review_count for a store
-- It will be triggered automatically when reviews are inserted/updated/deleted

CREATE OR REPLACE FUNCTION update_store_rating_aggregates()
RETURNS TRIGGER AS $$
BEGIN
    -- Determine which store_id to update based on operation
    DECLARE
        target_store_id UUID;
    BEGIN
        IF TG_OP = 'DELETE' THEN
            target_store_id := OLD.store_id;
        ELSE
            target_store_id := NEW.store_id;
        END IF;

        -- Recalculate and update store aggregates
        UPDATE stores
        SET
            average_rating = COALESCE(
                (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE store_id = target_store_id),
                0
            ),
            review_count = COALESCE(
                (SELECT COUNT(*) FROM reviews WHERE store_id = target_store_id),
                0
            )
        WHERE id = target_store_id;

        RETURN NULL;
    END;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. TRIGGERS - Auto-update store ratings
-- =====================================================

-- Trigger: After a review is inserted
CREATE TRIGGER trigger_update_store_rating_on_insert
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_store_rating_aggregates();

-- Trigger: After a review is updated (if user edits their rating)
CREATE TRIGGER trigger_update_store_rating_on_update
AFTER UPDATE ON reviews
FOR EACH ROW
WHEN (OLD.rating IS DISTINCT FROM NEW.rating)
EXECUTE FUNCTION update_store_rating_aggregates();

-- Trigger: After a review is deleted
CREATE TRIGGER trigger_update_store_rating_on_delete
AFTER DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_store_rating_aggregates();

-- =====================================================
-- 6. COMMENTS (Documentation)
-- =====================================================
COMMENT ON TABLE reviews IS 'Customer reviews with 5-star ratings for orders';
COMMENT ON COLUMN reviews.order_id IS 'One review per order (enforced by UNIQUE constraint)';
COMMENT ON COLUMN reviews.rating IS 'Star rating from 1-5';
COMMENT ON COLUMN reviews.comment IS 'Optional text review (max 500 chars enforced at application layer)';
COMMENT ON COLUMN stores.average_rating IS 'Calculated average of all reviews (1 decimal precision)';
COMMENT ON COLUMN stores.review_count IS 'Total number of reviews for this store';
