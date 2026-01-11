"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Check,
  Leaf,
  MapPin,
  Clock,
  Share2,
  Home,
  Copy,
  Sparkles,
  Trophy,
  TreePine,
  Droplets
} from "lucide-react";
import Link from "next/link";
import { cn } from "@food-rescue/ui";

// Mock order data (in real app, this would come from URL params or context)
const MOCK_ORDER = {
  id: "FR-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
  stores: [
    {
      id: "1",
      name: "מאפית הסופגנייה הזהובה",
      address: "דיזנגוף 99, תל אביב",
      pickupTime: "18:00 - 19:00",
      items: 2,
      total: 35,
    },
  ],
  totalAmount: 35,
  totalItems: 2,
};

// Animated counter component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v * 10) / 10);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 2,
      ease: "easeOut",
    });

    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));

    return () => {
      animation.stop();
      unsubscribe();
    };
  }, [value, count, rounded]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}

// Confetti particle component
function Confetti() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: ["#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6"][Math.floor(Math.random() * 5)],
    size: 4 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: "100vh",
            opacity: 0,
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Generate a simple QR-like pattern (visual only)
function QRCodePattern({ value }: { value: string }) {
  const gridSize = 9;
  const cells = Array.from({ length: gridSize * gridSize }, (_, i) => {
    // Create a deterministic pattern based on the value
    const hash = value.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);
    const cellHash = (hash * (i + 1)) % 100;
    return cellHash > 40;
  });

  return (
    <div
      className="grid bg-white p-3 rounded-xl"
      style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gap: 2 }}
    >
      {cells.map((filled, i) => (
        <div
          key={i}
          className={cn(
            "aspect-square rounded-[2px]",
            filled ? "bg-zinc-900" : "bg-transparent"
          )}
        />
      ))}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Stop confetti after 4 seconds
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Environmental impact calculations
  const kgFoodSaved = MOCK_ORDER.totalItems * 0.5;
  const co2Saved = MOCK_ORDER.totalItems * 1.2;
  const waterSaved = MOCK_ORDER.totalItems * 25;

  const copyOrderId = () => {
    navigator.clipboard.writeText(MOCK_ORDER.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-32 overflow-hidden">
      {/* Confetti celebration */}
      {showConfetti && <Confetti />}

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px]" />
      </div>

      <main className="relative max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Success Header */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
          className="text-center space-y-6"
        >
          {/* Animated checkmark */}
          <div className="relative mx-auto w-28 h-28">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.4 }}
              className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-[0_0_60px_rgba(16,185,129,0.4)]"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Check className="w-14 h-14 text-white" strokeWidth={3} />
            </motion.div>
            {/* Pulse rings */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 bg-emerald-500 rounded-full"
            />
          </div>

          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-black"
            >
              ההזמנה בוצעה בהצלחה!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-zinc-400"
            >
              הצלת אוכל וחסכת כסף - גיבור/ה אמיתי/ת!
            </motion.p>
          </div>

          {/* Order ID */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={copyOrderId}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <span className="text-zinc-500 text-sm">מס׳ הזמנה:</span>
            <span className="font-mono font-bold">{MOCK_ORDER.id}</span>
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4 text-zinc-500" />
            )}
          </motion.button>
        </motion.div>

        {/* Environmental Impact Card */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950/50 via-amber-900/30 to-emerald-950/50 rounded-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

          <div className="relative p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">ההשפעה הסביבתית שלך</h3>
                <p className="text-sm text-zinc-400">תודה שהצלת אוכל היום!</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400">
                  <AnimatedCounter value={kgFoodSaved} />
                </div>
                <div className="text-xs text-zinc-500 mt-1">ק״ג אוכל נחסך</div>
              </div>

              <div className="text-center p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <TreePine className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-blue-400">
                  <AnimatedCounter value={co2Saved} />
                </div>
                <div className="text-xs text-zinc-500 mt-1">ק״ג CO₂ נמנע</div>
              </div>

              <div className="text-center p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-cyan-400">
                  <AnimatedCounter value={waterSaved} suffix="L" />
                </div>
                <div className="text-xs text-zinc-500 mt-1">ליטר מים נחסך</div>
              </div>
            </div>

            {/* Share button */}
            <button className="w-full py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-2xl border border-zinc-700/50 flex items-center justify-center gap-2 transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="font-medium">שתף את ההשפעה שלך</span>
            </button>
          </div>
        </motion.section>

        {/* Pickup Details */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            פרטי איסוף
          </h3>

          {MOCK_ORDER.stores.map((store) => (
            <div
              key={store.id}
              className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 overflow-hidden"
            >
              <div className="p-5 space-y-4">
                {/* Store info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-2xl shrink-0">
                    🥯
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{store.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-zinc-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-emerald-400 mt-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">איסוף: {store.pickupTime}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-zinc-950 rounded-2xl p-4">
                  <div className="text-center mb-3">
                    <p className="text-sm text-zinc-400">הצג קוד זה בחנות לאיסוף</p>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-32 h-32">
                      <QRCodePattern value={`${MOCK_ORDER.id}-${store.id}`} />
                    </div>
                  </div>
                </div>

                {/* Order summary for this store */}
                <div className="flex justify-between items-center pt-2 border-t border-zinc-800/50">
                  <span className="text-sm text-zinc-500">{store.items} פריטים</span>
                  <span className="font-bold">₪{store.total}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.section>

        {/* Important Notes */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-amber-950/30 rounded-2xl border border-amber-900/30 p-4"
        >
          <h4 className="font-bold text-amber-400 mb-2">שימו לב</h4>
          <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
            <li>הגיעו בזמן שנקבע לאיסוף</li>
            <li>הציגו את קוד ה-QR לצוות החנות</li>
            <li>הביאו תיק או מיכל לנשיאת המוצרים</li>
          </ul>
        </motion.section>
      </main>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/50 p-4 pb-8">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Link href="/" className="flex-1">
            <button className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 rounded-2xl font-bold flex items-center justify-center gap-2 border border-zinc-800 transition-colors">
              <Home className="w-5 h-5" />
              חזרה לדף הבית
            </button>
          </Link>
          <button className="w-14 h-14 bg-emerald-500 hover:bg-emerald-400 rounded-2xl flex items-center justify-center transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Share2 className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
