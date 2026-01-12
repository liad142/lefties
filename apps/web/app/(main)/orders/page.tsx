"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle2,
  Star,
  ChevronRight,
  MapPin,
  Calendar,
  Loader2,
  ShoppingBag,
  MessageSquarePlus
} from "lucide-react";
import Link from "next/link";
import { cn, ReviewModal } from "@food-rescue/ui";
import { createBrowserClient } from "@food-rescue/database";

// Order status enum
const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  READY: "ready",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

interface Order {
  id: string;
  store: {
    id: string;
    name: string;
    logo: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
  pickupTime: string;
  createdAt: string;
  hasReview: boolean;
  review?: {
    rating: number;
    comment: string;
  };
}

// Mock data for demonstration (in production, fetch from Supabase)
const MOCK_ORDERS: Order[] = [
  {
    id: "00000000-0000-0000-0001-000000000001",
    store: {
      id: "10000000-0000-0000-0000-000000000002",
      name: "Suzy's Vegan Heaven",
      logo: "https://ui-avatars.com/api/?name=Suzy&background=10b981&color=fff",
    },
    items: [
      { name: "Vegan Buddha Bowl", quantity: 1, price: 20 },
      { name: "Plant-Based Burger", quantity: 1, price: 22 },
    ],
    total: 42,
    status: ORDER_STATUS.COMPLETED,
    pickupTime: "18:00 - 19:00",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    hasReview: false,
  },
  {
    id: "00000000-0000-0000-0001-000000000002",
    store: {
      id: "10000000-0000-0000-0000-000000000003",
      name: "Golden Bakery",
      logo: "https://ui-avatars.com/api/?name=GB&background=f59e0b&color=fff",
    },
    items: [
      { name: "Surprise Pastry Box", quantity: 1, price: 25 },
    ],
    total: 25,
    status: ORDER_STATUS.COMPLETED,
    pickupTime: "17:00 - 18:00",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    hasReview: true,
    review: {
      rating: 5,
      comment: "Amazing pastries! Fresh and delicious.",
    },
  },
  {
    id: "00000000-0000-0000-0001-000000000003",
    store: {
      id: "10000000-0000-0000-0000-000000000002",
      name: "Suzy's Vegan Heaven",
      logo: "https://ui-avatars.com/api/?name=Suzy&background=10b981&color=fff",
    },
    items: [
      { name: "Fresh Salad Bowl", quantity: 2, price: 30 },
    ],
    total: 30,
    status: ORDER_STATUS.READY,
    pickupTime: "20:00 - 21:00",
    createdAt: new Date().toISOString(),
    hasReview: false,
  },
];

// Order status badge component
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; icon: typeof Clock }> = {
    [ORDER_STATUS.PENDING]: {
      label: "ממתין לאישור",
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      icon: Clock,
    },
    [ORDER_STATUS.CONFIRMED]: {
      label: "מאושר",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      icon: CheckCircle2,
    },
    [ORDER_STATUS.READY]: {
      label: "מוכן לאיסוף",
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      icon: Package,
    },
    [ORDER_STATUS.COMPLETED]: {
      label: "הושלם",
      color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
      icon: CheckCircle2,
    },
    [ORDER_STATUS.CANCELLED]: {
      label: "בוטל",
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      icon: Clock,
    },
  };

  const { label, color, icon: Icon } = config[status] || config[ORDER_STATUS.PENDING];

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border", color)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// Review status indicator
function ReviewIndicator({ hasReview, rating }: { hasReview: boolean; rating?: number }) {
  if (hasReview) {
    return (
      <div className="flex items-center gap-1 text-amber-400">
        {Array.from({ length: rating || 5 }).map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-current" />
        ))}
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
      <MessageSquarePlus className="w-3 h-3" />
      כתוב ביקורת
    </span>
  );
}

// Order card component
function OrderCard({
  order,
  onReviewClick,
}: {
  order: Order;
  onReviewClick: () => void;
}) {
  const isActive = order.status === ORDER_STATUS.READY || order.status === ORDER_STATUS.CONFIRMED;
  const canReview = order.status === ORDER_STATUS.COMPLETED && !order.hasReview;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return "לפני פחות משעה";
    if (diffHours < 24) return `לפני ${diffHours} שעות`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "אתמול";
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    return date.toLocaleDateString("he-IL");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-zinc-900/50 rounded-2xl border overflow-hidden transition-all duration-300",
        isActive
          ? "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          : "border-zinc-800/50"
      )}
    >
      {/* Active Order Indicator */}
      {isActive && (
        <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 px-4 py-2 border-b border-emerald-500/20">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            הזמנה פעילה
          </span>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={order.store.logo}
              alt={order.store.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-bold text-white">{order.store.name}</h3>
              <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Items */}
        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-zinc-400">
                {item.quantity}x {item.name}
              </span>
              <span className="text-zinc-300 font-medium">₪{item.price}</span>
            </div>
          ))}
        </div>

        {/* Pickup Info (for active orders) */}
        {isActive && (
          <div className="flex items-center gap-2 p-3 bg-zinc-800/50 rounded-xl mb-4 text-sm">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-400">איסוף:</span>
            <span className="text-white font-medium">{order.pickupTime}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
          <div className="text-lg font-bold text-white">₪{order.total}</div>

          {order.status === ORDER_STATUS.COMPLETED && (
            canReview ? (
              <button
                onClick={onReviewClick}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl text-sm font-bold transition-colors"
              >
                <Star className="w-4 h-4" />
                דרג את ההזמנה
              </button>
            ) : (
              <ReviewIndicator hasReview={order.hasReview} rating={order.review?.rating} />
            )
          )}

          {isActive && (
            <Link href={`/orders/${order.id}`}>
              <button className="flex items-center gap-1 text-emerald-400 text-sm font-bold hover:underline">
                פרטי הזמנה
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<typeof MOCK_ORDERS[0] | null>(null);

  const activeOrders = orders.filter(
    (o) => o.status === ORDER_STATUS.READY || o.status === ORDER_STATUS.CONFIRMED || o.status === ORDER_STATUS.PENDING
  );
  const historyOrders = orders.filter(
    (o) => o.status === ORDER_STATUS.COMPLETED || o.status === ORDER_STATUS.CANCELLED
  );
  const pendingReviewOrders = historyOrders.filter((o) => !o.hasReview && o.status === ORDER_STATUS.COMPLETED);

  const handleReviewClick = (order: typeof MOCK_ORDERS[0]) => {
    setSelectedOrder(order);
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (review: { rating: number; comment: string; photos: File[] }) => {
    if (!selectedOrder) return;

    const supabase = createBrowserClient();
    let photoUrls: string[] = [];

    try {
      // 1. Upload photos to Supabase Storage
      if (review.photos.length > 0) {
        for (const photo of review.photos) {
          const fileExt = photo.name.split('.').pop();
          const fileName = `${selectedOrder.id}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from('review-photos')
            .upload(fileName, photo, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) {
            console.error('Error uploading photo:', error);
            continue;
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('review-photos')
            .getPublicUrl(fileName);

          if (urlData?.publicUrl) {
            photoUrls.push(urlData.publicUrl);
          }
        }
      }

      // 2. Submit review to API
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          rating: review.rating,
          comment: review.comment || undefined,
          photo_urls: photoUrls.length > 0 ? photoUrls : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit review');
      }

      // 3. Update local state to mark as reviewed
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder?.id
            ? { ...o, hasReview: true, review: { rating: review.rating, comment: review.comment } }
            : o
        )
      );

      console.log('Review submitted successfully:', result);
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error; // Re-throw so the modal shows error state
    }
  };

  const tabs = [
    { id: "active", label: "פעילות", count: activeOrders.length },
    { id: "history", label: "היסטוריה", count: historyOrders.length },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">ההזמנות שלי</h1>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-4">
          <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "active" | "history")}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={cn(
                    "ml-2 px-2 py-0.5 rounded-full text-xs",
                    activeTab === tab.id ? "bg-zinc-200" : "bg-zinc-800"
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Pending Review Banner */}
        {pendingReviewOrders.length > 0 && activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-950/50 to-amber-900/30 rounded-2xl p-4 border border-amber-800/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-200">
                  {pendingReviewOrders.length} הזמנות ממתינות לביקורת
                </h3>
                <p className="text-sm text-amber-300/70">
                  עזור לאחרים לגלות מקומות נהדרים
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "active" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "active" ? 20 : -20 }}
              className="space-y-4"
            >
              {(activeTab === "active" ? activeOrders : historyOrders).length > 0 ? (
                (activeTab === "active" ? activeOrders : historyOrders).map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onReviewClick={() => handleReviewClick(order)}
                  />
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-400 mb-2">
                    {activeTab === "active" ? "אין הזמנות פעילות" : "אין היסטוריית הזמנות"}
                  </h3>
                  <p className="text-zinc-500 mb-6">
                    {activeTab === "active"
                      ? "הזמנות חדשות יופיעו כאן"
                      : "הזמנות שהושלמו יופיעו כאן"}
                  </p>
                  <Link href="/">
                    <button className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors">
                      גלה מקומות
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        storeName={selectedOrder?.store.name || ""}
        orderDetails={
          selectedOrder
            ? {
                itemName: selectedOrder.items.map((i) => i.name).join(", "),
              }
            : undefined
        }
      />
    </div>
  );
}
