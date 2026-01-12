import * as React from "react";
import { Star } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

interface StoreHeroProps {
  name: string;
  description?: string;
  imageUrl?: string;
  logoUrl?: string;
  rating?: number;
  reviewCount?: number;
  isOpen: boolean;
  className?: string;
}

export const StoreHero = ({
  name,
  description,
  imageUrl,
  logoUrl,
  rating,
  reviewCount = 0,
  isOpen,
  className,
}: StoreHeroProps) => {
  return (
    <div className={cn("relative h-64 md:h-80 w-full overflow-hidden", className)}>
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200'})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-end pb-8">
        <div className="flex items-end gap-6">
          {/* Floating Logo */}
          {logoUrl && (
            <div className="hidden sm:block w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-slate-900 overflow-hidden bg-white shadow-2xl shrink-0 -mb-4">
              <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Store Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                {name}
              </h1>
              <Badge 
                variant={isOpen ? "success" : "destructive"}
                className="px-3 py-1 text-sm font-bold uppercase tracking-wider animate-pulse"
              >
                {isOpen ? "Open Now" : "Closed"}
              </Badge>
            </div>

            {description && (
              <p className="text-slate-300 text-sm md:text-base max-w-2xl line-clamp-2">
                {description}
              </p>
            )}

            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <Star className={cn("w-4 h-4", rating ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-slate-400")} />
                {rating ? (
                  <>
                    <span className="font-bold">{rating.toFixed(1)}</span>
                    <span className="text-slate-400 text-xs font-medium">
                      ({reviewCount} ביקורות)
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400 text-xs font-medium">אין ביקורות עדיין</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

