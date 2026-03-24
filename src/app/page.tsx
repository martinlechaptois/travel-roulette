"use client";

import { useState, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import WorldMap, { getCountryCentroidScreen } from "@/components/WorldMap";
import DartButton from "@/components/DartButton";
import CountryPopup from "@/components/CountryPopup";
import RecentPicks, { saveRecentPick } from "@/components/RecentPicks";
import { getRandomCountry, Country } from "@/lib/countries";

type Phase = "idle" | "flying" | "flashing" | "done";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [showPopup, setShowPopup] = useState(false);
  const [dartTarget, setDartTarget] = useState<{ x: number; y: number } | null>(
    null
  );
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleThrow = useCallback(() => {
    setShowPopup(false);
    const country = getRandomCountry();
    setSelectedCountry(country);

    const container = mapContainerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const target = getCountryCentroidScreen(
        country.lat,
        country.lng,
        rect.width,
        rect.height
      );
      setDartTarget(target);
    }

    setPhase("flying");
  }, []);

  const handleDartLanded = useCallback(() => {
    setPhase("flashing");
    setTimeout(() => {
      setPhase("done");
      setShowPopup(true);
      setSelectedCountry((c) => {
        if (c) saveRecentPick(c);
        return c;
      });
    }, 1600);
  }, []);

  const handleClosePopup = useCallback(() => {
    setShowPopup(false);
  }, []);

  const handleRecentSelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    setShowPopup(true);
    setPhase("done");
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Map takes full screen */}
      <div ref={mapContainerRef} className="absolute inset-0">
        <WorldMap
          selectedCountry={selectedCountry?.name ?? null}
          isFlashing={phase === "flashing"}
          isDartFlying={phase === "flying"}
          dartTarget={dartTarget}
          onDartLanded={handleDartLanded}
        />
      </div>

      {/* Top overlay: title + button */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 pointer-events-none">
        <div>
          <h1 className="text-xl md:text-4xl font-bold text-neon glow-neon">
            Travel Roulette
          </h1>
          <p className="text-gray-400 text-[10px] md:text-xs mt-0.5">
            Throw a dart. Discover the world.
          </p>
        </div>
        <div className="pointer-events-auto">
          <DartButton
            onThrow={handleThrow}
            disabled={phase === "flying" || phase === "flashing"}
          />
        </div>
      </div>

      {/* Bottom overlay: recent picks */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 md:px-6 pb-4 pointer-events-none">
        <div className="pointer-events-auto">
          <RecentPicks
            onSelect={handleRecentSelect}
            currentCode={selectedCountry?.code}
          />
        </div>
      </div>

      <AnimatePresence>
        {showPopup && selectedCountry && (
          <CountryPopup country={selectedCountry} onClose={handleClosePopup} />
        )}
      </AnimatePresence>
    </div>
  );
}
