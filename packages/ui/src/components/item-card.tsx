"use client";

import * as React from "react";

interface ItemCardProps {
  name: string;
  description: string | null;
  originalPrice: number;
  discountPrice: number;
  quantity: number;
  storeName: string;
  tags: string[];
  imageUrl?: string | null;
}

const TAG_LABELS: Record<string, string> = {
  meaty: "בשרי",
  dairy: "חלבי",
  vegan: "טבעוני",
  vegetarian: "צמחוני",
  gluten_free: "ללא גלוטן",
  kosher: "כשר",
  halal: "חלאל",
};

const TAG_COLORS: Record<string, string> = {
  meaty: "bg-red-100 text-red-700",
  dairy: "bg-blue-100 text-blue-700",
  vegan: "bg-green-100 text-green-700",
  vegetarian: "bg-emerald-100 text-emerald-700",
  gluten_free: "bg-amber-100 text-amber-700",
  kosher: "bg-purple-100 text-purple-700",
  halal: "bg-teal-100 text-teal-700",
};

export function ItemCard({
  name,
  description,
  originalPrice,
  discountPrice,
  quantity,
  storeName,
  tags,
  imageUrl,
}: ItemCardProps) {
  const discountPercentage = Math.round(
    ((originalPrice - discountPrice) / originalPrice) * 100
  );

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer animate-scale-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-100 flex items-center justify-center">
            <div className="text-6xl opacity-40 transform group-hover:scale-110 transition-transform duration-500">
              🍱
            </div>
          </div>
        )}

        {/* Discount Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full shadow-lg">
            <span className="text-sm font-bold">-{discountPercentage}%</span>
          </div>
        </div>

        {/* Quantity Badge */}
        {quantity <= 3 && (
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm text-orange-600 px-3 py-1.5 rounded-full shadow-lg">
              <span className="text-xs font-semibold">נשארו {quantity} בלבד!</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Store Name */}
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-sm text-gray-500 font-medium">{storeName}</span>
        </div>

        {/* Item Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  TAG_COLORS[tag] || "bg-gray-100 text-gray-700"
                }`}
              >
                {TAG_LABELS[tag] || tag}
              </span>
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl font-bold text-primary">
            ₪{discountPrice.toFixed(0)}
          </span>
          <span className="text-lg text-gray-400 line-through font-medium">
            ₪{originalPrice.toFixed(0)}
          </span>
        </div>

        {/* Order Button */}
        <button
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
            isHovered
              ? "bg-gradient-to-r from-primary to-primary-dark shadow-lg shadow-primary/30 transform scale-105"
              : "bg-primary"
          }`}
        >
          הוסף לסל 🛒
        </button>
      </div>
    </div>
  );
}
