"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Plus, Minus, Trash2, Apple, CreditCard, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  storeId: string;
  storeName: string;
}

interface CartStoreGroup {
  storeId: string;
  storeName: string;
  items: CartItem[];
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  storeGroups: CartStoreGroup[];
  totalAmount: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export const CartDrawer = ({ 
  isOpen, 
  onClose,
  storeGroups,
  totalAmount,
  onUpdateQuantity,
  onRemoveItem
}: CartDrawerProps) => {

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 text-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-bold uppercase tracking-tight">Your Cart</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {storeGroups.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <ShoppingCart className="w-16 h-16" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <Button onClick={onClose} variant="outline" className="rounded-full">Start Rescuing Food</Button>
                </div>
              ) : (
                storeGroups.map((group) => (
                  <div key={group.storeId} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <h3 className="font-bold text-lg text-emerald-400">{group.storeName}</h3>
                      <button className="text-xs text-pink-500 font-bold uppercase hover:underline">Edit</button>
                    </div>

                    <div className="space-y-4">
                      {group.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate">{item.name}</h4>
                            <p className="text-zinc-500 text-xs">₪{item.price.toFixed(2)} per item</p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-3 bg-zinc-900 rounded-lg p-1 px-2 border border-zinc-800">
                                <button 
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className="text-zinc-400 hover:text-white"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="text-zinc-400 hover:text-white"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="font-bold text-sm">₪{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-900">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex flex-col">
                          <span className="font-bold">Pick-up at the store</span>
                          <span className="text-zinc-500 text-xs">Pick up before: 21:45</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-blue-500" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {storeGroups.length > 0 && (
              <div className="p-6 bg-zinc-950 border-t border-zinc-900 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-zinc-400 text-sm">
                    <span>Summary</span>
                    <span>₪{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-black text-xl">
                    <span>Total</span>
                    <span>₪{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full h-14 bg-black hover:bg-zinc-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 border border-zinc-800">
                    <Apple className="w-6 h-6 fill-current" />
                    Buy with Pay
                  </Button>
                  
                  <Button className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-black rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <CreditCard className="w-6 h-6" />
                    ADD NEW PAYMENT METHOD
                  </Button>

                  <button className="w-full text-zinc-500 text-xs font-bold hover:text-zinc-400">
                    Add credits
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

