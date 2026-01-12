"use client";

import { use, useEffect, useState } from "react";
import {
  StoreHero,
  TabsNav,
  SurpriseBagCard,
  MenuItemCard,
  ReviewsSection,
  cn
} from "@food-rescue/ui";
import { createBrowserClient } from "@food-rescue/database";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShoppingBag, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  photo_urls?: string[];
  created_at: string;
  customer?: {
    id: string;
    full_name: string | null;
  } | null;
}

interface StorePageProps {
  params: Promise<{ id: string }>;
}

export default function StorePage({ params }: StorePageProps) {
  const { id } = use(params);
  const [store, setStore] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    reviewCount: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("surprise_bag");
  const { addItem } = useCart();
  const [supabase] = useState(() => createBrowserClient());

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: Number(item.discount_price),
      quantity: 1,
      imageUrl: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      storeId: store.id,
      storeName: store.name,
      type: item.type as 'surprise_bag' | 'specific_item',
    });
  };

  useEffect(() => {
    let mounted = true;

    async function fetchStoreData() {
      console.log("Fetching store data start for ID:", id);
      try {
        setLoading(true);
        
        // Safety timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Fetch timeout")), 5000)
        );

        // Fetch store details
        const storePromise = supabase
          .from("stores")
          .select("*")
          .eq("id", id)
          .single();

        // Fetch all items for this store
        const itemsPromise = supabase
          .from("items")
          .select("*")
          .eq("store_id", id);

        const results: any[] = await Promise.all([
          Promise.race([storePromise, timeoutPromise]),
          Promise.race([itemsPromise, timeoutPromise])
        ]);

        if (!mounted) return;

        const { data: storeData, error: storeError } = results[0];
        const { data: itemsData, error: itemsError } = results[1];

        if (storeError) throw storeError;
        if (itemsError) throw itemsError;

        setStore(storeData);
        setItems(itemsData || []);
        console.log("Store data fetched successfully");
      } catch (error: any) {
        console.error("Error fetching store data:", error.message || error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchStoreData();
    return () => { mounted = false; };
  }, [id, supabase]);

  // Fetch reviews for this store
  useEffect(() => {
    let mounted = true;

    async function fetchReviews() {
      try {
        setReviewsLoading(true);

        // Fetch reviews for orders from this store
        const { data: reviewsData, error } = await supabase
          .from("reviews")
          .select(`
            id,
            rating,
            comment,
            photo_urls,
            created_at,
            order:orders!inner (
              item:items!inner (
                store_id
              )
            ),
            customer:profiles (
              id,
              full_name
            )
          `)
          .eq("order.item.store_id", id)
          .order("created_at", { ascending: false });

        if (!mounted) return;

        if (error) {
          console.error("Error fetching reviews:", error);
          return;
        }

        // Transform the data
        const transformedReviews: Review[] = (reviewsData || []).map((r: any) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          photo_urls: r.photo_urls || [],
          created_at: r.created_at,
          customer: r.customer,
        }));

        setReviews(transformedReviews);

        // Calculate stats
        const totalReviews = transformedReviews.length;
        const avgRating = totalReviews > 0
          ? transformedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;

        // Calculate distribution
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        transformedReviews.forEach((r) => {
          const rating = r.rating as 1 | 2 | 3 | 4 | 5;
          if (distribution[rating] !== undefined) {
            distribution[rating]++;
          }
        });

        setReviewStats({
          averageRating: avgRating,
          reviewCount: totalReviews,
          ratingDistribution: distribution,
        });
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        if (mounted) {
          setReviewsLoading(false);
        }
      }
    }

    if (store) {
      fetchReviews();
    }

    return () => { mounted = false; };
  }, [id, store, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Store not found</h1>
        <Link href="/" className="text-blue-400 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to marketplace
        </Link>
      </div>
    );
  }

  const surpriseBags = items.filter(item => item.type === "surprise_bag");
  const menuItems = items.filter(item => item.type === "specific_item");

  const tabs = [
    { id: "surprise_bag", label: "שקיות הפתעה", icon: "🎁" },
    { id: "specific_item", label: "פריטים בודדים", icon: "🍽️" },
    { id: "reviews", label: `ביקורות (${reviewStats.reviewCount})`, icon: "⭐" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4">
        <Link 
          href="/" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-white hover:bg-black/40 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </div>

      {/* Store Hero */}
      <StoreHero
        name={store.name}
        description={store.description}
        imageUrl={store.image_url}
        logoUrl={store.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(store.name)}&background=random`}
        rating={reviewStats.reviewCount > 0 ? reviewStats.averageRating : undefined}
        reviewCount={reviewStats.reviewCount}
        isOpen={store.status === "active"}
      />

      {/* Sticky Tabs */}
      <TabsNav
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "surprise_bag" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {surpriseBags.length > 0 ? (
                  surpriseBags.map((bag) => (
                    <SurpriseBagCard
                      key={bag.id}
                      name={bag.name}
                      description={bag.description}
                      imageUrl={bag.image_url}
                      originalPrice={Number(bag.original_price)}
                      discountPrice={Number(bag.discount_price)}
                      quantity={bag.quantity}
                      onAddToCart={() => handleAddToCart(bag)}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 mb-4 text-slate-500">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-400">אין שקיות הפתעה זמינות כרגע</h3>
                    <p className="text-slate-600 mt-2">בדוק שוב מאוחר יותר או עיין בפריטים בודדים!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "specific_item" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.length > 0 ? (
                  menuItems.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      name={item.name}
                      description={item.description}
                      imageUrl={item.image_url}
                      originalPrice={Number(item.original_price)}
                      discountPrice={Number(item.discount_price)}
                      quantity={item.quantity}
                      onAddToCart={() => handleAddToCart(item)}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 mb-4 text-slate-500">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-400">אין פריטים בודדים זמינים</h3>
                    <p className="text-slate-600 mt-2">החנות עדיין לא הוסיפה פריטים ספציפיים.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-2xl">
                <ReviewsSection
                  reviews={reviews}
                  averageRating={reviewStats.averageRating}
                  reviewCount={reviewStats.reviewCount}
                  ratingDistribution={reviewStats.ratingDistribution}
                  isLoading={reviewsLoading}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

