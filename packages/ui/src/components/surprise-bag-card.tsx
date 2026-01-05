import * as React from "react";
import { Clock, Package, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

interface SurpriseBagCardProps {
  name: string;
  description?: string;
  imageUrl?: string;
  originalPrice: number;
  discountPrice: number;
  quantity: number;
  pickupTime?: string;
  onAddToCart?: () => void;
  className?: string;
}

export const SurpriseBagCard = ({
  name,
  description,
  imageUrl,
  originalPrice,
  discountPrice,
  quantity,
  pickupTime,
  onAddToCart,
  className,
}: SurpriseBagCardProps) => {
  const savings = originalPrice - discountPrice;
  const progress = Math.min((quantity / 10) * 100, 100); // Assuming 10 is max for visual

  return (
    <Card className={cn("group overflow-hidden bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all duration-300", className)}>
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800'} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        <Badge className="absolute top-4 right-4 bg-blue-500 text-white border-none font-bold">
          Surprise Bag 🎁
        </Badge>
        
        {savings > 0 && (
          <div className="absolute bottom-4 left-4 bg-green-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            Save ₪{savings.toFixed(0)}
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {name}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2 mt-1">
            {description}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{pickupTime || 'Today, 19:00 - 21:00'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Package className="w-4 h-4 text-blue-400" />
              <span>{quantity} left</span>
            </div>
          </div>

          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-slate-500 text-xs line-through">₪{originalPrice.toFixed(2)}</span>
            <span className="text-2xl font-black text-white">₪{discountPrice.toFixed(2)}</span>
          </div>
          <Button 
            onClick={onAddToCart}
            disabled={quantity === 0}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {quantity === 0 ? "Sold Out" : "Claim Bag"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

