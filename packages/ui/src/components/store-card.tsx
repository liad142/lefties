"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Clock, MapPin, Plus } from "lucide-react";
import { cn } from "../lib/utils";

export interface StoreCardProps {
  id: string;
  storeName: string;
  image: string;
  distance: string;
  rating: number;
  itemsLeft: number;
  totalItems: number;
  pickupTime: string;
  discountTag?: string;
  className?: string;
  variant?: "compact" | "standard" | "prominent";
  onAddToCart?: (id: string) => void;
}

export const StoreCard = ({
  id,
  storeName,
  image,
  distance,
  rating,
  itemsLeft,
  totalItems,
  pickupTime,
  discountTag,
  className,
  variant = "standard",
  onAddToCart,
}: StoreCardProps) => {
  // ... existing logic ...
  const stockPercentage = Math.min(100, (itemsLeft / totalItems) * 100);
  
  const getBarColor = () => {
    if (stockPercentage <= 20) return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]";
    if (stockPercentage <= 50) return "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]";
    return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]";
  };

  const isCompact = variant === "compact";
  const isProminent = variant === "prominent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-[2rem] bg-zinc-900 shadow-2xl transition-all duration-500",
        isCompact ? "aspect-square w-40 md:w-48 shrink-0 rounded-[1.5rem]" : "aspect-[4/5] w-full",
        isProminent && "aspect-[16/9] w-full rounded-[2.5rem]",
        className
      )}
    >
      {/* Background Image with Zoom Effect */}
      <motion.div
        className="absolute inset-0 z-0"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/40 transition-colors duration-500" />
        <img
          src={image}
          alt={storeName}
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Top Floating Badges */}
      <div className={cn("absolute z-20 flex flex-col gap-2 items-end", isCompact ? "top-3 right-3" : "top-6 right-6")}>
        {discountTag && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl",
              isCompact ? "px-2 py-0.5 rounded-lg" : "px-4 py-1.5 rounded-2xl"
            )}
          >
            <span className={cn("text-white font-black tracking-tighter", isCompact ? "text-xs" : "text-lg")}>
              {discountTag}
            </span>
          </motion.div>
        )}
        
        {!isCompact && (
          <div className="backdrop-blur-xl bg-black/30 border border-white/10 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-lg">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-white font-bold text-sm">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Bottom Info Overlay */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent",
        isCompact ? "p-3 pt-8" : "p-8 pt-20"
      )}>
        <div className="flex flex-col gap-2 rtl text-right">
          {/* Store Name */}
          <h3 className={cn(
            "font-black text-white leading-tight tracking-tight drop-shadow-md",
            isCompact ? "text-sm line-clamp-1" : "text-3xl",
            isProminent && "text-4xl"
          )}>
            {storeName}
          </h3>

          {!isCompact && (
            <>
              {/* Metadata Row */}
              <div className="flex items-center justify-end gap-4 text-white/80 font-medium text-sm">
                <div className="flex items-center gap-1.5">
                  <span>{pickupTime}</span>
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="w-1 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-1.5">
                  <span>{distance}</span>
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              {/* Stock Indicator / Hot Bar */}
              <div className="mt-2 space-y-2">
                <div className="flex justify-between items-end text-[11px] font-bold uppercase tracking-widest text-white/60">
                  <span>{Math.round(stockPercentage)}%</span>
                  <span>{itemsLeft} יחידות נותרו</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stockPercentage}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className={cn("h-full rounded-full transition-all duration-500", getBarColor())}
                  />
                </div>
              </div>
            </>
          )}

          {isCompact && (
            <div className="flex justify-between items-center">
               <span className="text-[10px] font-bold text-white/60">{itemsLeft} נותרו</span>
               <div className="flex items-center gap-1">
                 <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                 <span className="text-white font-bold text-[10px]">{rating.toFixed(1)}</span>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action: Add to Cart Button */}
      {!isCompact && (
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(id);
          }}
          className={cn(
            "absolute z-30 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_8px_30px_rgb(16,185,129,0.4)] hover:bg-emerald-400 transition-colors",
            isProminent ? "bottom-8 left-8 h-16 w-16" : "bottom-6 left-6 h-12 w-12"
          )}
        >
          <Plus className={cn("stroke-[3]", isProminent ? "w-10 h-10" : "w-7 h-7")} />
        </motion.button>
      )}
    </motion.div>
  );
};

