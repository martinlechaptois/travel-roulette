"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  useZoomPan,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { geoEqualEarth } from "d3-geo";
import Tooltip from "./Tooltip";
import DartAnimation from "./DartAnimation";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  selectedCountry: string | null;
  isFlashing: boolean;
  isDartFlying: boolean;
  dartTarget: { x: number; y: number } | null;
  onDartLanded: () => void;
}

export default function WorldMap({
  selectedCountry,
  isFlashing,
  isDartFlying,
  dartTarget,
  onDartLanded,
}: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [flashOn, setFlashOn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  // Flashing effect
  useEffect(() => {
    if (!isFlashing) {
      setFlashOn(false);
      return;
    }
    let count = 0;
    const interval = setInterval(() => {
      setFlashOn((prev) => !prev);
      count++;
      if (count >= 6) {
        clearInterval(interval);
        setFlashOn(true); // end highlighted
      }
    }, 250);
    return () => clearInterval(interval);
  }, [isFlashing]);

  const getFill = (geoName: string) => {
    if (geoName === selectedCountry) {
      if (isFlashing) return flashOn ? "#00ff41" : "#1a2e1a";
      return "#00ff41";
    }
    return "#1a2e1a";
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      onMouseMove={handleMouseMove}
    >
      <ComposableMap
        projectionConfig={{ scale: 147 }}
        className="w-full h-full"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={() => setHoveredCountry(geo.properties.name)}
                onMouseLeave={() => setHoveredCountry("")}
                style={{
                  default: {
                    fill: getFill(geo.properties.name),
                    stroke: "rgba(0,255,65,0.15)",
                    strokeWidth: 0.5,
                    outline: "none",
                    transition: "fill 0.15s ease",
                  },
                  hover: {
                    fill:
                      geo.properties.name === selectedCountry
                        ? "#00ff41"
                        : "#00cc33",
                    stroke: "#00ff41",
                    strokeWidth: 0.75,
                    outline: "none",
                    cursor: "pointer",
                  },
                  pressed: {
                    fill: "#00ff41",
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>

      {isDartFlying && dartTarget && containerRef.current && (
        <DartAnimation
          targetX={dartTarget.x}
          targetY={dartTarget.y}
          containerWidth={containerRef.current.clientWidth}
          containerHeight={containerRef.current.clientHeight}
          onComplete={onDartLanded}
        />
      )}

      <Tooltip countryName={hoveredCountry} position={mousePos} />
    </div>
  );
}

/**
 * Get screen coordinates for a country centroid given the map container dimensions.
 * Uses the same projection as ComposableMap default (geoEqualEarth).
 */
export function getCountryCentroidScreen(
  lat: number,
  lng: number,
  containerWidth: number,
  containerHeight: number
): { x: number; y: number } {
  const projection = geoEqualEarth()
    .scale(147)
    .translate([containerWidth / 2, containerHeight / 2]);
  const coords = projection([lng, lat]);
  if (!coords) return { x: containerWidth / 2, y: containerHeight / 2 };
  return { x: coords[0], y: coords[1] };
}
