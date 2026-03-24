"use client";

import { motion } from "framer-motion";

interface FunFactProps {
  fact: string;
}

export default function FunFact({ fact }: FunFactProps) {
  return (
    <motion.div
      className="bg-[#0a150a] border border-neon/10 rounded-lg p-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <div className="text-neon text-sm font-bold uppercase tracking-wider">
        🚀 Mission Briefing
      </div>
      <p className="text-gray-300 text-sm mt-2 leading-relaxed">{fact}</p>
    </motion.div>
  );
}
