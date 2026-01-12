"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, User, Image as ImageIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  photo_urls?: string[];
  created_at: string;
  customer?: {
    id: string;
    full_name: string | null;
  } | null;
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
  ratingDistribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  isLoading?: boolean;
}

// Star display component
function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "xs" | "sm" | "md" }) {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-zinc-600"
          )}
        />
      ))}
    </div>
  );
}

// Rating bar component
function RatingBar({ count, total, stars }: { count: number; total: number; stars: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-3 text-zinc-500">{stars}</span>
      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-amber-400 rounded-full"
        />
      </div>
      <span className="w-8 text-xs text-zinc-500">{count}</span>
    </div>
  );
}

// Individual review card
function ReviewCard({ review }: { review: Review }) {
  const [showPhotos, setShowPhotos] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "היום";
    if (diffDays === 1) return "אתמול";
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    if (diffDays < 30) return `לפני ${Math.floor(diffDays / 7)} שבועות`;
    return date.toLocaleDateString("he-IL");
  };

  const hasPhotos = review.photo_urls && review.photo_urls.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
            <User className="w-5 h-5 text-zinc-500" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-white">
              {review.customer?.full_name || "לקוח אנונימי"}
            </h4>
            <span className="text-xs text-zinc-500">{formatDate(review.created_at)}</span>
          </div>
        </div>
        <StarDisplay rating={review.rating} size="xs" />
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-sm text-zinc-300 leading-relaxed mb-3">{review.comment}</p>
      )}

      {/* Photos */}
      {hasPhotos && (
        <div className="space-y-2">
          <button
            onClick={() => setShowPhotos(!showPhotos)}
            className="flex items-center gap-2 text-xs text-emerald-400 hover:underline"
          >
            <ImageIcon className="w-3 h-3" />
            {review.photo_urls!.length} תמונות
            <ChevronDown
              className={cn("w-3 h-3 transition-transform", showPhotos && "rotate-180")}
            />
          </button>

          <AnimatePresence>
            {showPhotos && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 overflow-x-auto pb-2"
              >
                {review.photo_urls!.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Review photo ${index + 1}`}
                    className="w-24 h-24 rounded-xl object-cover border border-zinc-700"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

export function ReviewsSection({
  reviews,
  averageRating,
  reviewCount,
  ratingDistribution,
  isLoading,
}: ReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header with overall rating */}
      <div className="flex items-start gap-6">
        {/* Big Rating Display */}
        <div className="text-center">
          <div className="text-5xl font-black text-white mb-1">
            {averageRating.toFixed(1)}
          </div>
          <StarDisplay rating={Math.round(averageRating)} size="md" />
          <p className="text-xs text-zinc-500 mt-1">{reviewCount} ביקורות</p>
        </div>

        {/* Rating Distribution */}
        {ratingDistribution && (
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((stars) => (
              <RatingBar
                key={stars}
                stars={stars}
                count={ratingDistribution[stars as 1 | 2 | 3 | 4 | 5]}
                total={reviewCount}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {displayedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </AnimatePresence>

          {reviews.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-3 text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center justify-center gap-1"
            >
              {showAll ? "הצג פחות" : `הצג עוד ${reviews.length - 3} ביקורות`}
              <ChevronDown
                className={cn("w-4 h-4 transition-transform", showAll && "rotate-180")}
              />
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-zinc-900 rounded-full flex items-center justify-center mb-3">
            <Star className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-zinc-500">עדיין אין ביקורות למקום הזה</p>
          <p className="text-sm text-zinc-600">היה הראשון לכתוב ביקורת!</p>
        </div>
      )}
    </section>
  );
}
