"use client";

import { motion } from "framer-motion";

interface DartButtonProps {
  onThrow: () => void;
  disabled: boolean;
}

export default function DartButton({ onThrow, disabled }: DartButtonProps) {
  return (
    <motion.button
      onClick={onThrow}
      disabled={disabled}
      className={`bg-transparent border border-neon text-neon px-5 py-2 text-sm font-mono rounded-md border-glow transition-colors ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : "hover:bg-neon/10 cursor-pointer"
      }`}
      whileHover={disabled ? undefined : { scale: 1.05 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
    >
      🎯 Throw the Dart!
    </motion.button>
  );
}
