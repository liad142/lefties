"use client";

import { ShoppingBag, Clock, Star } from "lucide-react";

interface StoreRescueCardProps {
  id: string;
  storeName: string;
  category: string;
  image: string;
  logo: string;
  distance: string;
  rating: number;
  itemsLeft: number;
  pickupStart: string;
  pickupEnd: string;
  originalPrice: number;
  rescuePrice: number;
}

export function StoreRescueCard({
  storeName,
  image,
  logo,
  distance,
  rating,
  itemsLeft,
  pickupStart,
  pickupEnd,
  rescuePrice,
}: StoreRescueCardProps) {
  const discount = 50; // Mocked as -50% in screenshot

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white border border-gray-100 group cursor-pointer mb-4" style={{ maxWidth: '100%' }}>
      {/* Top Section (Image) */}
      <div className="relative w-full overflow-hidden" style={{ height: '192px' }}>
        <img
          src={image}
          alt={storeName}
          className="h-full w-full object-cover"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        {/* Overlay Badge (Top Left): Distance */}
        <div className="absolute top-4 left-4">
          <div className="bg-white px-3 py-1 rounded-full text-[13px] font-semibold shadow-sm text-gray-800">
            {distance}
          </div>
        </div>

        {/* Overlay Badge (Top Right): Rating */}
        <div className="absolute top-4 right-4">
          <div className="bg-white px-3 py-1 rounded-full text-[13px] font-semibold shadow-sm flex items-center gap-1.5 text-gray-800">
            <Star className="w-4 h-4 fill-green-500 text-green-500" />
            {rating}
          </div>
        </div>

        {/* Center Logo & Discount Block */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 flex flex-col items-center">
          <div className="rounded-lg bg-white shadow-md p-1.5 border border-gray-50 flex items-center justify-center overflow-hidden" style={{ width: '64px', height: '64px' }}>
            <img
              src={logo}
              alt={storeName}
              className="w-full h-full object-contain"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div className="bg-yellow-400 text-black font-bold px-4 py-0.5 rounded-sm text-sm mt-1 shadow-sm">
            -{discount}%
          </div>
        </div>
      </div>

      {/* Middle Section (Title) */}
      <div className="pt-14 pb-4 px-4 text-center">
        <h3 className="font-bold text-[17px] text-gray-800 tracking-tight">
          {storeName}
        </h3>
      </div>

      {/* Bottom Section (Details Row) */}
      <div className="px-4 pb-4 flex items-center justify-between border-t border-gray-50 pt-3">
        <div className="flex items-center gap-1.5 text-gray-600 font-medium text-[13px]">
          <ShoppingBag size={18} className="text-gray-700" />
          <span>{itemsLeft} left</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-gray-600 font-medium text-[13px]">
          <Clock size={18} className="text-gray-700" />
          <span>{pickupStart}-{pickupEnd}</span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-[17px] font-bold text-gray-800">{rescuePrice.toFixed(2)}</span>
          <span className="text-[15px] font-semibold text-gray-800">₪</span>
        </div>
      </div>
    </div>
  );
}


