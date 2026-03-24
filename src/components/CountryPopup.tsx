"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Country } from "@/lib/countries";
import WeatherForecast from "./WeatherForecast";
import FunFact from "./FunFact";
import SlackMessage from "./SlackMessage";

interface CountryPopupProps {
  country: Country;
  onClose: () => void;
}

const infoItems = (country: Country) => [
  { icon: "🏛️", label: "Capital", value: country.capital },
  { icon: "👥", label: "Population", value: country.population },
  { icon: "🌍", label: "Region", value: country.region },
];

export default function CountryPopup({ country, onClose }: CountryPopupProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    // Focus the close button on open
    const firstButton = modalRef.current?.querySelector<HTMLElement>("button");
    firstButton?.focus();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal — bottom sheet on mobile, centered on desktop */}
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Details about ${country.name}`}
        className="relative bg-[#0d1a0d] border border-neon/20 border-glow max-w-lg w-full md:w-[90vw] max-h-[90vh] md:max-h-[85vh] overflow-y-auto p-5 md:p-6 outline-none scrollbar-thin rounded-t-2xl md:rounded-2xl"
        style={{ WebkitOverflowScrolling: "touch" }}
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        {/* Drag handle on mobile */}
        <div className="md:hidden flex justify-center mb-3">
          <div className="w-10 h-1 bg-gray-600 rounded-full" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close country details"
          className="absolute top-4 right-4 text-gray-400 hover:text-neon transition-colors text-xl cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <span className="text-4xl md:text-5xl">{country.flag}</span>
          <h2 className="text-xl md:text-2xl font-bold text-neon">
            {country.name}
          </h2>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5">
          {infoItems(country).map((item, i) => (
            <motion.div
              key={item.label}
              className="bg-[#0a150a] rounded-lg p-2.5 md:p-3 border border-neon/10"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
            >
              <div className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider mb-1">
                {item.icon} {item.label}
              </div>
              <div className="text-gray-200 text-xs md:text-sm">
                {item.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Weather forecast */}
        <div className="mb-5">
          <h3 className="text-base md:text-lg font-bold text-gray-200 mb-3">
            🌤️ 14-Day Forecast
          </h3>
          <WeatherForecast lat={country.lat} lng={country.lng} />
        </div>

        <div className="border-t border-neon/10 my-4" />

        <div className="mb-4">
          <FunFact fact={country.funFact} />
        </div>

        <div className="border-t border-neon/10 my-4" />

        <SlackMessage country={country} />
      </motion.div>
    </motion.div>
  );
}
