"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Leaf,
  Sparkles,
  CreditCard,
  Smartphone,
  ChevronDown,
  Check,
  ShoppingBag,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { cn } from "@food-rescue/ui";

// Time slots for pickup
const TIME_SLOTS = [
  { id: "1", label: "17:00 - 18:00", available: true },
  { id: "2", label: "18:00 - 19:00", available: true },
  { id: "3", label: "19:00 - 20:00", available: true },
  { id: "4", label: "20:00 - 21:00", available: false },
];

// Payment methods
const PAYMENT_METHODS = [
  { id: "apple", label: "Apple Pay", icon: Smartphone, recommended: true },
  { id: "card", label: "Credit Card", icon: CreditCard, recommended: false },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { storeGroups, totalAmount, totalItems, clearCart } = useCart();
  const [selectedTimes, setSelectedTimes] = useState<Record<string, string>>({});
  const [selectedPayment, setSelectedPayment] = useState("apple");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate environmental impact (mock calculations)
  const kgFoodSaved = (totalItems * 0.5).toFixed(1);
  const co2Saved = (totalItems * 1.2).toFixed(1);
  const moneySaved = (totalAmount * 0.5).toFixed(0);

  const handleTimeSelect = (storeId: string, timeId: string) => {
    setSelectedTimes(prev => ({ ...prev, [storeId]: timeId }));
  };

  const allTimesSelected = storeGroups.every(group => selectedTimes[group.storeId]);

  const handleCheckout = async () => {
    if (!allTimesSelected) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clear cart and navigate to success
    clearCart();
    router.push("/checkout/success");
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Empty cart state
  if (storeGroups.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-24 h-24 mx-auto bg-zinc-900 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-zinc-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">העגלה שלך ריקה</h1>
            <p className="text-zinc-500">הוסף פריטים כדי להמשיך לתשלום</p>
          </div>
          <Link href="/">
            <button className="px-8 py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 transition-colors">
              חזרה לחנות
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <button className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">סיום הזמנה</h1>
            <p className="text-xs text-zinc-500">{totalItems} פריטים</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Environmental Impact Preview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 p-6 border border-emerald-800/50"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">ההשפעה שלך</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-black text-white mb-1">{kgFoodSaved}</div>
                <div className="text-xs text-emerald-300/70">ק״ג אוכל נחסך</div>
              </div>
              <div className="text-center border-x border-emerald-700/30">
                <div className="text-3xl font-black text-white mb-1">{co2Saved}</div>
                <div className="text-xs text-emerald-300/70">ק״ג CO₂ נמנע</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-white mb-1">₪{moneySaved}</div>
                <div className="text-xs text-emerald-300/70">חיסכון</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Store Groups */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {storeGroups.map((group, groupIndex) => (
            <div
              key={group.storeId}
              className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 overflow-hidden"
            >
              {/* Store Header */}
              <div className="p-4 border-b border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xl">
                    🏪
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{group.storeName}</h3>
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <MapPin className="w-3 h-3" />
                      <span>דיזנגוף 99, תל אביב</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 space-y-3">
                {group.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                      <img
                        src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-zinc-500">כמות: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">₪{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pickup Time Selection */}
              <div className="p-4 bg-zinc-900/50 border-t border-zinc-800/50">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-bold">בחר שעת איסוף</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => slot.available && handleTimeSelect(group.storeId, slot.id)}
                      disabled={!slot.available}
                      className={cn(
                        "relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        selectedTimes[group.storeId] === slot.id
                          ? "bg-emerald-500 text-black"
                          : slot.available
                            ? "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
                            : "bg-zinc-900 text-zinc-600 cursor-not-allowed"
                      )}
                    >
                      {selectedTimes[group.storeId] === slot.id && (
                        <Check className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4" />
                      )}
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.section>

        {/* Payment Method */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-4"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-500" />
            אמצעי תשלום
          </h3>

          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 border",
                  selectedPayment === method.id
                    ? "bg-zinc-800 border-emerald-500/50"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  selectedPayment === method.id ? "bg-emerald-500/20" : "bg-zinc-800"
                )}>
                  <method.icon className={cn(
                    "w-5 h-5",
                    selectedPayment === method.id ? "text-emerald-400" : "text-zinc-400"
                  )} />
                </div>
                <span className="flex-1 text-right font-medium">{method.label}</span>
                {method.recommended && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
                    מומלץ
                  </span>
                )}
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selectedPayment === method.id
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-zinc-600"
                )}>
                  {selectedPayment === method.id && (
                    <Check className="w-3 h-3 text-black" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Order Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-4"
        >
          <h3 className="font-bold mb-4">סיכום הזמנה</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>סכום ביניים</span>
              <span>₪{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>חיסכון</span>
              <span>-₪{moneySaved}</span>
            </div>
            <div className="h-px bg-zinc-800" />
            <div className="flex justify-between text-lg font-black">
              <span>סה״כ לתשלום</span>
              <span>₪{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/50 p-4 pb-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleCheckout}
            disabled={!allTimesSelected || isProcessing}
            className={cn(
              "w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300",
              allTimesSelected && !isProcessing
                ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            )}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                מעבד תשלום...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                אישור והזמנה • ₪{totalAmount.toFixed(0)}
              </>
            )}
          </button>

          {!allTimesSelected && (
            <p className="text-center text-xs text-zinc-500 mt-2">
              בחר שעת איסוף לכל החנויות
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
