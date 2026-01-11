"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StoreCard } from "@food-rescue/ui";
import { Timer, Star, Rocket, Search, Filter, Map as MapIcon, Loader2 } from "lucide-react";
import { cn } from "@food-rescue/ui";
import { createBrowserClient } from "@food-rescue/database";
import Link from "next/link";

const CATEGORIES = ["הכל", "טבעוני", "מאפיה", "סושי", "מתחת ל-20₪", "המבורגר", "פיצה"];

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
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createBrowserClient());

  useEffect(() => {
    let mounted = true;
    
    async function fetchStores() {
      console.log("Fetching stores start...");
      try {
        setLoading(true);
        
        // Safety timeout of 5 seconds
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Fetch timeout")), 5000)
        );

        const fetchPromise = supabase
          .from("stores")
          .select(`
            *,
            items (
              quantity
            )
          `)
          .eq("status", "active");

        const { data, error }: any = await Promise.race([fetchPromise, timeoutPromise]);

        if (!mounted) return;
        if (error) throw error;

        console.log("Stores fetched successfully:", data?.length);

        // Process stores to add some visual defaults since DB is empty for images
        const processedStores = (data || []).map((store: any) => {
          const itemsLeft = store.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
          return {
            id: store.id,
            storeName: store.name,
            image: store.image_url || (store.name.includes("Vegan") 
              ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80"
              : "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80"),
            distance: "מדיזנגוף 1.2 ק\"מ",
            rating: 4.8,
            itemsLeft: itemsLeft,
            totalItems: Math.max(itemsLeft + 5, 10), // Mock total
            pickupTime: "19:00 - 21:00",
            discountTag: "-50%",
          };
        });

        setStores(processedStores);
      } catch (err) {
        console.error("Error fetching stores:", err);
      } finally {
        if (mounted) {
          console.log("Setting loading to false");
          setLoading(false);
        }
      }
    }

    fetchStores();
    return () => { mounted = false; };
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  // Distribution for different sections
  const urgentDeals = stores.slice(0, 2);
  const compactStores = stores; // Use all for now as we only have 2 in DB
  const prominentStore = stores[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24 overflow-x-hidden">
      {/* 1. Hero Discovery Section */}
      <section className="relative h-[50vh] md:h-[60vh] max-h-[600px] min-h-[400px] w-full overflow-hidden">
        <div className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {urgentDeals.length > 0 ? urgentDeals.map((deal) => (
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
                      <span>נסגר ב-{deal.pickupTime.split(' - ')[1]}</span>
                      <span>{deal.discountTag} הנחה</span>
                    </div>
                    <Link href={`/store/${deal.id}`}>
                      <button className="bg-white text-black px-8 py-4 rounded-2xl font-black text-lg shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all">
                        הצילו עכשיו
                      </button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          )) : (
            <div className="w-full flex items-center justify-center bg-zinc-900 h-full">
               <p className="text-zinc-500 font-bold">אין מבצעים פעילים כרגע</p>
            </div>
          )}
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {urgentDeals.map((_, i) => (
            <div key={i} className={cn("h-1 rounded-full transition-all duration-300", i === 0 ? "w-8 bg-white" : "w-2 bg-white/30")} />
          ))}
        </div>
      </section>

      {/* Main Content Area */}
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
          {/* Section A: Ending Soon */}
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
              {compactStores.map((store) => (
                <motion.div key={store.id} variants={itemVariants} className="snap-start shrink-0">
                  <Link href={`/store/${store.id}`}>
                    <StoreCard {...store} variant="compact" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section B: Best Rated */}
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
              {stores.map((store) => (
                <motion.div key={store.id} variants={itemVariants} className="snap-start w-[75%] md:w-[40%] lg:w-[25%] shrink-0">
                  <Link href={`/store/${store.id}`}>
                    <StoreCard {...store} variant="standard" className="h-full" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section C: Prominent Highlight */}
          {prominentStore && (
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
                <Link href={`/store/${prominentStore.id}`}>
                  <StoreCard 
                    {...prominentStore}
                    variant="prominent"
                  />
                </Link>
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
};

