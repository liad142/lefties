"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ShoppingBasket,
  Leaf,
  User,
  Filter,
  Search,
  MapPin
} from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Mobile Top Navigation - Icon Bar Style */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="flex h-14">
          <button className="flex-1 flex items-center justify-center border-r border-gray-50 hover:bg-gray-50 transition-colors">
            <Filter size={24} className="text-gray-400" />
          </button>
          <button className="flex-1 flex items-center justify-center border-r border-gray-50 hover:bg-gray-50 transition-colors">
            <Search size={24} className="text-gray-400" />
          </button>
          <button className="flex-1 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <MapPin size={24} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-14 relative min-h-[calc(100vh-80px)]">
        {children}
      </main>

      {/* Mobile Bottom Navigation - App Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 h-20 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex justify-around items-center h-full px-4 max-w-md mx-auto">
          <Link href="/menu" className="flex flex-col items-center gap-1 group">
            <Menu size={24} className="text-gray-400 group-hover:text-gray-600" />
            <span className="text-[11px] font-medium text-gray-400 group-hover:text-gray-600">Menu</span>
          </Link>
          
          <Link href="/orders" className="flex flex-col items-center gap-1 group">
            <ShoppingBasket size={24} className="text-gray-400 group-hover:text-gray-600" />
            <span className="text-[11px] font-medium text-gray-400 group-hover:text-gray-600">Orders</span>
          </Link>
          
          <Link href="/" className="flex flex-col items-center gap-1 group">
            <div className="relative">
              <Leaf size={24} className="text-green-600 fill-green-600" />
            </div>
            <span className="text-[11px] font-bold text-green-700">Save food</span>
          </Link>
          
          <Link href="/profile" className="flex flex-col items-center gap-1 group">
            <User size={24} className="text-gray-400 group-hover:text-gray-600" />
            <span className="text-[11px] font-medium text-gray-400 group-hover:text-gray-600">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
