"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  storeId: string;
  storeName: string;
  type: 'surprise_bag' | 'specific_item';
}

interface CartStoreGroup {
  storeId: string;
  storeName: string;
  items: CartItem[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  storeGroups: CartStoreGroup[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on init
  useEffect(() => {
    const savedCart = localStorage.getItem("food-rescue-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("food-rescue-cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === newItem.id);
      if (existingItem) {
        return currentItems.map(i => 
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...currentItems, newItem];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(currentItems => currentItems.filter(i => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(currentItems => 
      currentItems.map(i => i.id === itemId ? { ...i, quantity } : i)
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Group items by store for the Karma-style view
  const storeGroups = items.reduce((groups: CartStoreGroup[], item) => {
    const existingGroup = groups.find(g => g.storeId === item.storeId);
    if (existingGroup) {
      existingGroup.items.push(item);
    } else {
      groups.push({
        storeId: item.storeId,
        storeName: item.storeName,
        items: [item]
      });
    }
    return groups;
  }, []);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
      storeGroups
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

