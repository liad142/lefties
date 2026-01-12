-- Migration: Add Photos Support to Reviews
-- Created: 2026-01-11
-- Description: Adds photo_urls column to reviews table for storing uploaded images

-- =====================================================
-- 1. ADD PHOTOS COLUMN TO REVIEWS
-- =====================================================
-- Using JSONB array to store multiple photo URLs
-- Example: ["https://storage.supabase.co/...", "https://..."]

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS photo_urls JSONB DEFAULT '[]'::jsonb;

-- Create GIN index for efficient querying of reviews with photos
CREATE INDEX IF NOT EXISTS idx_reviews_has_photos
ON reviews USING GIN (photo_urls)
WHERE photo_urls != '[]'::jsonb;

-- =====================================================
-- 2. STORAGE BUCKET FOR REVIEW PHOTOS (Run in Supabase Dashboard)
-- =====================================================
-- Note: Execute these in Supabase SQL Editor or Dashboard

-- Create storage bucket for review photos
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('review-photos', 'review-photos', true)
-- ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload photos
-- CREATE POLICY "Users can upload review photos"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'review-photos' AND
--   auth.role() = 'authenticated'
-- );

-- Policy: Public read access for review photos
-- CREATE POLICY "Public read access for review photos"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'review-photos');

-- Policy: Users can delete their own review photos
-- CREATE POLICY "Users can delete own review photos"
-- ON storage.objects FOR DELETE
-- USING (
--   bucket_id = 'review-photos' AND
--   auth.uid()::text = (storage.foldername(name))[1]
-- );

-- =====================================================
-- 3. COMMENTS (Documentation)
-- =====================================================
COMMENT ON COLUMN reviews.photo_urls IS 'JSON array of photo URLs uploaded with the review (max 3 photos)';
