"use client";

import { StoreRescueCard } from "@/components/store-rescue-card";

const STORES = [
  {
    id: "perugino-dizengoff",
    storeName: "Perugino - Dizengoff",
    category: "Bakery & Sandwiches",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    logo: "https://ui-avatars.com/api/?name=P&background=fdfdfd&color=b5a26c",
    distance: "1.57 Km",
    rating: 4.3,
    itemsLeft: 2,
    pickupStart: "15:00",
    pickupEnd: "16:00",
    originalPrice: 100,
    rescuePrice: 50.00,
  },
  {
    id: "istanbul-delicious",
    storeName: "Istanbul Delicious (within Perugino store)",
    category: "Turkish & Bakery",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
    logo: "https://ui-avatars.com/api/?name=ID&background=0b1a32&color=fff",
    distance: "1.57 Km",
    rating: 3.7,
    itemsLeft: 4,
    pickupStart: "15:00",
    pickupEnd: "16:00",
    originalPrice: 100,
    rescuePrice: 50.00,
  },
  {
    id: "abulafia-kfar-saba",
    storeName: "Abulafia - Kfar Saba (evening)",
    category: "Bakery",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
    logo: "https://ui-avatars.com/api/?name=A&background=fff&color=000",
    distance: "16.22 Km",
    rating: 4.0,
    itemsLeft: 4,
    pickupStart: "19:00",
    pickupEnd: "23:50",
    originalPrice: 50,
    rescuePrice: 25.00,
  }
];

export default function RescueMarketplacePage() {
  return (
    <div className="px-4 py-6">
      <div className="max-w-md mx-auto space-y-4">
        {STORES.map((store) => (
          <StoreRescueCard key={store.id} {...store} />
        ))}
      </div>
    </div>
  );
}
