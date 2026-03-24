"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Country } from "@/lib/countries";

const STORAGE_KEY = "travelRoulette_recentPicks";

export function saveRecentPick(country: Country) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const picks: Country[] = stored ? JSON.parse(stored) : [];
    const filtered = picks.filter((p) => p.code !== country.code);
    const updated = [country, ...filtered].slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable
  }
}

interface RecentPicksProps {
  onSelect: (country: Country) => void;
  currentCode?: string;
}

export default function RecentPicks({ onSelect, currentCode }: RecentPicksProps) {
  const [picks, setPicks] = useState<Country[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPicks(JSON.parse(stored));
    } catch {
      // localStorage unavailable
    }
  }, [currentCode]); // re-read when a new pick is made

  if (picks.length === 0) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-gray-600 text-[10px] uppercase tracking-wider">
        Recent picks
      </span>
      <div className="flex gap-2">
        <AnimatePresence mode="popLayout">
          {picks.map((pick) => (
            <motion.button
              key={pick.code}
              layoutId={`recent-${pick.code}`}
              onClick={() => onSelect(pick)}
              className="bg-[#0a150a] border border-neon/10 rounded-full px-3 py-1 text-xs text-gray-400 hover:text-neon hover:border-neon/30 transition-colors cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
            >
              {pick.flag} {pick.code}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
