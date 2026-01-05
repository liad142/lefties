import * as React from "react";
import { Plus, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface MenuItemCardProps {
  name: string;
  description?: string;
  imageUrl?: string;
  originalPrice: number;
  discountPrice: number;
  quantity: number;
  onAddToCart?: () => void;
  className?: string;
}

export const MenuItemCard = ({
  name,
  description,
  imageUrl,
  originalPrice,
  discountPrice,
  quantity,
  onAddToCart,
  className,
}: MenuItemCardProps) => {
  const isSoldOut = quantity === 0;

  return (
    <Card 
      className={cn(
        "group relative flex bg-slate-900 border-slate-800 hover:border-orange-500/50 transition-all duration-300 overflow-hidden",
        isSoldOut && "grayscale opacity-80",
        className
      )}
    >
      <CardContent className="flex-1 p-4 flex gap-4">
        {/* Square Image Container */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden shadow-lg border border-slate-800">
          <img 
            src={imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400'} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-white text-[10px] sm:text-xs font-black uppercase tracking-widest border border-white/40 px-2 py-1 rotate-[-12deg]">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Item Info */}
        <div className="flex flex-col justify-between flex-1 py-1">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
              {name}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white">₪{discountPrice.toFixed(2)}</span>
              {originalPrice > discountPrice && (
                <span className="text-slate-500 text-xs line-through">₪{originalPrice.toFixed(2)}</span>
              )}
            </div>

            <Button
              size="icon"
              disabled={isSoldOut}
              onClick={onAddToCart}
              className={cn(
                "h-10 w-10 rounded-full shadow-lg transition-all duration-300",
                isSoldOut 
                  ? "bg-slate-800 text-slate-600" 
                  : "bg-orange-500 hover:bg-orange-400 text-white hover:scale-110 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
              )}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Hover Effect Border Glow */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500/20 pointer-events-none transition-colors" />
    </Card>
  );
};

