"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Camera,
  Trash2,
  Send,
  Sparkles,
  CheckCircle2,
  ImagePlus
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: {
    rating: number;
    comment: string;
    photos: File[];
  }) => Promise<void>;
  storeName: string;
  orderDetails?: {
    itemName: string;
    itemImage?: string;
  };
}

// Interactive Star Rating Component
function StarRating({
  rating,
  onRatingChange,
  size = "lg"
}: {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const ratingLabels = ["", "גרוע", "לא טוב", "בסדר", "טוב", "מעולה!"];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onRatingChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-all duration-200",
                (hoverRating || rating) >= star
                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                  : "fill-transparent text-zinc-600"
              )}
            />
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {(hoverRating || rating) > 0 && (
          <motion.span
            key={hoverRating || rating}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-lg font-bold text-amber-400"
          >
            {ratingLabels[hoverRating || rating]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// Photo Upload Component
function PhotoUploader({
  photos,
  onPhotosChange,
  maxPhotos = 3,
}: {
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
  maxPhotos?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  React.useEffect(() => {
    // Generate preview URLs
    const urls = photos.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    // Cleanup
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = [...photos, ...files].slice(0, maxPhotos);
    onPhotosChange(newPhotos);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Camera className="w-4 h-4" />
        <span>הוסף תמונות (עד {maxPhotos})</span>
      </div>

      <div className="flex gap-3 flex-wrap">
        {/* Photo Previews */}
        {previews.map((preview, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative group"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-zinc-700">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <Trash2 className="w-3 h-3 text-white" />
            </button>
          </motion.div>
        ))}

        {/* Add Photo Button */}
        {photos.length < maxPhotos && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-zinc-700 hover:border-emerald-500 flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-emerald-400 transition-colors"
          >
            <ImagePlus className="w-6 h-6" />
            <span className="text-xs">הוסף</span>
          </motion.button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

export function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  storeName,
  orderDetails,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, comment, photos });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        // Reset state
        setRating(0);
        setComment("");
        setPhotos([]);
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset state
      setRating(0);
      setComment("");
      setPhotos([]);
      setIsSuccess(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-zinc-900 rounded-3xl shadow-2xl z-[101] overflow-hidden"
          >
            {/* Success State */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-20 h-20 mx-auto bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">תודה על הביקורת!</h3>
                <p className="text-zinc-400">הביקורת שלך עוזרת לאחרים לגלות מקומות נהדרים</p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="relative p-6 pb-4 border-b border-zinc-800">
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>

                  <div className="flex items-center gap-3 pr-12">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">איך היה?</h2>
                      <p className="text-sm text-zinc-400">{storeName}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Order Item Preview (if provided) */}
                  {orderDetails && (
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                      {orderDetails.itemImage && (
                        <img
                          src={orderDetails.itemImage}
                          alt={orderDetails.itemName}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      )}
                      <span className="text-sm text-zinc-300 font-medium">
                        {orderDetails.itemName}
                      </span>
                    </div>
                  )}

                  {/* Star Rating */}
                  <div className="py-4">
                    <StarRating rating={rating} onRatingChange={setRating} />
                  </div>

                  {/* Comment */}
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">
                      ספר לנו עוד (אופציונלי)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="מה אהבת? מה אפשר לשפר?"
                      maxLength={500}
                      rows={3}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                    <div className="text-xs text-zinc-500 text-left">
                      {comment.length}/500
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <PhotoUploader
                    photos={photos}
                    onPhotosChange={setPhotos}
                    maxPhotos={3}
                  />
                </div>

                {/* Footer */}
                <div className="p-6 pt-0 space-y-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={rating === 0 || isSubmitting}
                    className={cn(
                      "w-full h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300",
                      rating > 0
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-black hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        שלח ביקורת
                      </>
                    )}
                  </Button>

                  <button
                    onClick={handleClose}
                    className="w-full py-3 text-zinc-500 text-sm hover:text-zinc-400 transition-colors"
                  >
                    אולי אחר כך
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
