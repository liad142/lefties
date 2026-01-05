"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface TabsNavProps {
  tabs: { id: string; label: string; icon?: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export const TabsNav = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}: TabsNavProps) => {
  return (
    <div className={cn("sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 w-full", className)}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-8 h-16">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative h-full flex items-center gap-2 text-sm font-semibold transition-colors duration-200",
                  isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-1 rounded-t-full shadow-[0_-4px_12px_rgba(59,130,246,0.5)]",
                      tab.id === 'surprise_bag' ? "bg-blue-500" : "bg-orange-500"
                    )}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

