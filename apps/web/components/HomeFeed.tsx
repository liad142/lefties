"use client";

import React from "react";
import { motion } from "framer-motion";
import { StoreCard } from "@food-rescue/ui";
import { Sparkles, Timer, Star, Rocket, Search, Filter, Map as MapIcon } from "lucide-react";
import { cn } from "@food-rescue/ui";

const CATEGORIES = ["הכל", "טבעוני", "מאפיה", "סושי", "מתחת ל-20₪", "המבורגר", "פיצה"];

const URGENT_DEALS = [
  {
    id: "hero-1",
    storeName: "בייקרי דיזנגוף",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
    distance: "400m",
    rating: 4.9,
    itemsLeft: 3,
    totalItems: 15,
    pickupTime: "נסגר ב-16:00",
    discountTag: "-70%",
  },
  {
    id: "hero-2",
    storeName: "סושי בר בזל",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&q=80",
    distance: "1.2km",
    rating: 4.7,
    itemsLeft: 5,
    totalItems: 20,
    pickupTime: "נסגר ב-15:30",
    discountTag: "-50%",
  },
];

const COMPACT_STORES = [
  { id: "c1", storeName: "לחמנינה", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", itemsLeft: 2, totalItems: 10, rating: 4.5, discountTag: "-30%", distance: "200m", pickupTime: "14:00" },
  { id: "c2", storeName: "ארקפה", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", itemsLeft: 1, totalItems: 8, rating: 4.2, discountTag: "-40%", distance: "800m", pickupTime: "15:00" },
  { id: "c3", storeName: "בוטיק סנטרל", image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400", itemsLeft: 4, totalItems: 12, rating: 4.8, discountTag: "-50%", distance: "1.1km", pickupTime: "16:00" },
  { id: "c4", storeName: "לה מולן", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", itemsLeft: 3, totalItems: 15, rating: 4.6, discountTag: "-60%", distance: "1.5km", pickupTime: "15:30" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
  },
};

export const HomeFeed = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24 overflow-x-hidden">
      {/* 1. Hero Discovery Section - Tightened Height */}
      <section className="relative h-[50vh] md:h-[60vh] max-h-[600px] min-h-[400px] w-full overflow-hidden">
        <div className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {URGENT_DEALS.map((deal) => (
            <div key={deal.id} className="relative h-full w-full flex-shrink-0 snap-center">
              <img
                src={deal.image}
                alt={deal.storeName}
                className="h-full w-full object-cover brightness-[0.6]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/40" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 pb-16 rtl text-right">
                <div className="max-w-screen-2xl mx-auto w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 max-w-2xl ml-auto"
                  >
                    <div className="inline-flex items-center gap-2 bg-red-500/90 px-4 py-1.5 rounded-full backdrop-blur-md">
                      <Timer className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest leading-none">מבצע דחוף - נגמר בקרוב</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] drop-shadow-2xl">
                      {deal.storeName}
                    </h2>
                    <div className="flex items-center justify-end gap-6 text-lg md:text-xl font-bold text-zinc-300">
                      <span>{deal.pickupTime}</span>
                      <span>{deal.discountTag} הנחה</span>
                    </div>
                    <button className="bg-white text-black px-8 py-4 rounded-2xl font-black text-lg shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all">
                      הצילו עכשיו
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {URGENT_DEALS.map((_, i) => (
            <div key={i} className={cn("h-1 rounded-full transition-all duration-300", i === 0 ? "w-8 bg-white" : "w-2 bg-white/30")} />
          ))}
        </div>
      </section>

      {/* Main Content Area - Max Width Constrained */}
      <div className="max-w-screen-2xl mx-auto">
        {/* 2. Sticky Filter Bar */}
        <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-zinc-950/80 border-b border-white/5 px-6 py-4 mb-8">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide rtl py-1">
            <div className="shrink-0 bg-zinc-900 p-3 rounded-2xl border border-white/10 hover:bg-zinc-800 transition-colors cursor-pointer">
              <Filter className="w-5 h-5 text-emerald-400" />
            </div>
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                className={cn(
                  "shrink-0 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 border",
                  i === 0 
                    ? "bg-white text-black border-white shadow-[0_10px_20px_rgba(255,255,255,0.1)]" 
                    : "bg-zinc-900 text-zinc-400 border-white/5 hover:border-white/20"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>

        <div className="space-y-16">
          {/* Section A: Ending Soon - Forced Compact Sizing */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="space-y-6"
          >
            <div className="px-6 flex items-center justify-between rtl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-xl">
                  <Timer className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">נגמר בקרוב ⏳</h3>
              </div>
              <button className="text-emerald-400 font-bold text-sm hover:underline">ראה הכל</button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto snap-x scrollbar-hide px-6 py-2 pb-4">
              {COMPACT_STORES.map((store) => (
                <motion.div key={store.id} variants={itemVariants} className="snap-start shrink-0">
                  <StoreCard {...store} variant="compact" />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section B: Best Rated - Standard Sizing (~1.5 visible) */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="space-y-6"
          >
            <div className="px-6 flex items-center justify-between rtl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-xl">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">הכי אהובים ⭐</h3>
              </div>
              <button className="text-emerald-400 font-bold text-sm hover:underline">ראה הכל</button>
            </div>
            
            <div className="flex gap-6 overflow-x-auto snap-x scrollbar-hide px-6 py-4">
              {URGENT_DEALS.map((store) => (
                <motion.div key={store.id} variants={itemVariants} className="snap-start w-[75%] md:w-[40%] lg:w-[25%] shrink-0">
                  <StoreCard {...store} variant="standard" className="h-full" />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section C: Prominent Highlight - Constrained width */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="space-y-6 px-6 pb-12"
          >
            <div className="flex items-center gap-3 rtl">
              <div className="p-2 bg-emerald-500/20 rounded-xl">
                <Rocket className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black tracking-tight">חדש באפליקציה 🚀</h3>
            </div>
            
            <div className="max-w-4xl rtl">
              <StoreCard 
                id="prominent-1"
                storeName="פיצה פרסקה - בעבודת יד"
                image="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200"
                distance="2.5km"
                rating={5.0}
                itemsLeft={12}
                totalItems={20}
                pickupTime="18:00 - 21:00"
                discountTag="-20%"
                variant="prominent"
              />
            </div>
          </motion.section>
        </div>
      </div>

      {/* Floating App Bar (Placeholder for Navigation) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-20 backdrop-blur-3xl bg-zinc-900/90 rounded-[2.5rem] border border-white/10 flex items-center justify-around px-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60]">
        <div className="p-3 bg-emerald-500 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
           <Search className="w-7 h-7 text-white" />
        </div>
        <MapIcon className="w-7 h-7 text-zinc-500" />
        <Timer className="w-7 h-7 text-zinc-500" />
        <div className="w-7 h-7 rounded-full bg-zinc-700" />
      </div>
    </div>
  );
};

