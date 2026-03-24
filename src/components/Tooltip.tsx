"use client";

import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  countryName: string;
  position: { x: number; y: number };
}

export default function Tooltip({ countryName, position }: TooltipProps) {
  return (
    <AnimatePresence>
      {countryName && (
        <motion.div
          role="tooltip"
          className="fixed z-50 bg-bg-dark/90 border border-neon/30 text-neon text-sm px-3 py-1.5 rounded font-mono pointer-events-none border-glow"
          style={{ left: position.x + 12, top: position.y - 8 }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.15 }}
        >
          {countryName}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
