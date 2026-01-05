"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  ShoppingBasket,
  Leaf,
  User,
  Filter,
  Search,
  MapPin,
  ShoppingBag
} from "lucide-react";
import { CartProvider, useCart } from "@/context/CartContext";
import { CartDrawer } from "@food-rescue/ui";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems, storeGroups, totalAmount, updateQuantity, removeItem } = useCart();

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Main Content Area */}
      <main className="relative min-h-[calc(100vh-80px)]">
        {children}
      </main>

      {/* Mobile Bottom Navigation - App Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-2xl border-t border-white/5 z-50 h-20 shadow-[0_-2px_20px_rgba(0,0,0,0.5)]">
        <div className="flex justify-around items-center h-full px-4 max-w-md mx-auto">
          <Link href="/menu" className="flex flex-col items-center gap-1 group">
            <Menu size={24} className="text-zinc-500 group-hover:text-white transition-colors" />
            <span className="text-[11px] font-medium text-zinc-500 group-hover:text-white transition-colors">Menu</span>
          </Link>
          
          <Link href="/orders" className="flex flex-col items-center gap-1 group">
            <ShoppingBasket size={24} className="text-zinc-500 group-hover:text-white transition-colors" />
            <span className="text-[11px] font-medium text-zinc-500 group-hover:text-white transition-colors">Orders</span>
          </Link>
          
          <Link href="/" className="flex flex-col items-center gap-1 group">
            <div className="relative">
              <Leaf size={24} className="text-emerald-500 fill-emerald-500/20" />
            </div>
            <span className="text-[11px] font-bold text-emerald-500">Save food</span>
          </Link>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center gap-1 group relative"
          >
            <div className="relative">
              <ShoppingBag size={24} className={totalItems > 0 ? "text-emerald-400" : "text-zinc-500"} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                  {totalItems}
                </span>
              )}
            </div>
            <span className={totalItems > 0 ? "text-[11px] font-bold text-emerald-400" : "text-[11px] font-medium text-zinc-500"}>
              Carts
            </span>
          </button>
          
          <Link href="/profile" className="flex flex-col items-center gap-1 group">
            <User size={24} className="text-zinc-500 group-hover:text-white transition-colors" />
            <span className="text-[11px] font-medium text-zinc-500 group-hover:text-white transition-colors">Profile</span>
          </Link>
        </div>
      </nav>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        storeGroups={storeGroups}
        totalAmount={totalAmount}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <LayoutContent>{children}</LayoutContent>
    </CartProvider>
  );
}
