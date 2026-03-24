"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DartAnimationProps {
  targetX: number;
  targetY: number;
  containerWidth: number;
  containerHeight: number;
  onComplete: () => void;
}

/**
 * Generate a smooth SVG path with circular arcs between random waypoints,
 * ending at the target. Uses cubic bezier curves for fluid motion.
 */
function generateSmoothPath(
  targetX: number,
  targetY: number,
  containerWidth: number,
  containerHeight: number
): string {
  const margin = 60;
  const w = containerWidth - margin * 2;
  const h = containerHeight - margin * 2;

  // Start from top center
  const startX = containerWidth / 2;
  const startY = -20;

  // Generate 3-4 waypoints spread across the map
  const waypointCount = 3 + Math.floor(Math.random() * 2);
  const waypoints: { x: number; y: number }[] = [];

  for (let i = 0; i < waypointCount; i++) {
    // Distribute waypoints in different quadrants for variety
    const angle = ((i / waypointCount) * Math.PI * 2) + (Math.random() * 0.8 - 0.4);
    const radius = 0.25 + Math.random() * 0.2;
    const cx = containerWidth / 2 + Math.cos(angle) * w * radius;
    const cy = containerHeight / 2 + Math.sin(angle) * h * radius;
    waypoints.push({
      x: Math.max(margin, Math.min(containerWidth - margin, cx)),
      y: Math.max(margin, Math.min(containerHeight - margin, cy)),
    });
  }

  // End at target
  waypoints.push({ x: targetX, y: targetY });

  const allPoints = [{ x: startX, y: startY }, ...waypoints];

  // Build smooth cubic bezier path
  let path = `M ${allPoints[0].x} ${allPoints[0].y}`;

  for (let i = 1; i < allPoints.length; i++) {
    const prev = allPoints[i - 1];
    const curr = allPoints[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;

    // Create sweeping arcs by offsetting control points perpendicular to the line
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;

    // Alternate arc direction for a weaving pattern
    const arcDirection = i % 2 === 0 ? 1 : -1;
    const arcStrength = len * (0.3 + Math.random() * 0.25) * arcDirection;

    const cp1x = prev.x + dx * 0.3 + nx * arcStrength;
    const cp1y = prev.y + dy * 0.3 + ny * arcStrength;
    const cp2x = prev.x + dx * 0.7 + nx * arcStrength * 0.6;
    const cp2y = prev.y + dy * 0.7 + ny * arcStrength * 0.6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }

  return path;
}

function Rocket() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 0 8px rgba(0,255,65,0.6))" }}
    >
      {/* Flame */}
      <ellipse cx="32" cy="58" rx="5" ry="6" fill="#ff6600" opacity="0.9">
        <animate attributeName="ry" values="6;8;5;7;6" dur="0.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.6;0.9" dur="0.2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="32" cy="57" rx="3" ry="4" fill="#ffcc00" opacity="0.8">
        <animate attributeName="ry" values="4;6;3;5;4" dur="0.25s" repeatCount="indefinite" />
      </ellipse>
      {/* Rocket body */}
      <path
        d="M32 4 C32 4 22 18 22 36 L22 44 L42 44 L42 36 C42 18 32 4 32 4Z"
        fill="#00ff41"
        stroke="#00cc33"
        strokeWidth="1"
      />
      {/* Window */}
      <circle cx="32" cy="24" r="5" fill="#0a0f0a" stroke="#00cc33" strokeWidth="1.5" />
      <circle cx="32" cy="24" r="3" fill="#1a2e1a" opacity="0.8" />
      {/* Left fin */}
      <path d="M22 36 L14 48 L22 44 Z" fill="#00cc33" />
      {/* Right fin */}
      <path d="M42 36 L50 48 L42 44 Z" fill="#00cc33" />
      {/* Nozzle */}
      <rect x="27" y="44" width="10" height="4" rx="1" fill="#00cc33" />
    </svg>
  );
}

function Explosion({ x, y, onComplete }: { x: number; y: number; onComplete: () => void }) {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 30 + Math.random() * 40;
      return {
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        size: 4 + Math.random() * 6,
        color: ["#00ff41", "#00cc33", "#ffcc00", "#ff6600"][Math.floor(Math.random() * 4)],
        delay: Math.random() * 0.1,
      };
    });
  }, []);

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 20,
          height: 20,
          left: -10,
          top: -10,
          background: "radial-gradient(circle, #ffffff, #00ff41, transparent)",
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 6, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onAnimationComplete={onComplete}
      />
      <motion.div
        className="absolute rounded-full border-2 border-neon"
        style={{ width: 10, height: 10, left: -5, top: -5 }}
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 8, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: -p.size / 2,
            top: -p.size / 2,
            backgroundColor: p.color,
            boxShadow: `0 0 6px ${p.color}`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 + Math.random() * 0.3, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/**
 * Trail dots that fade behind the rocket path.
 */
function Trail({ path, duration }: { path: string; duration: number }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
      <motion.path
        d={path}
        fill="none"
        stroke="#00ff41"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 0 4px rgba(0,255,65,0.4))" }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#00ff41"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="4 8"
        opacity="0.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration, ease: "easeInOut" }}
      />
    </svg>
  );
}

export default function DartAnimation({
  targetX,
  targetY,
  containerWidth,
  containerHeight,
  onComplete,
}: DartAnimationProps) {
  const [phase, setPhase] = useState<"flying" | "exploding">("flying");
  const rocketRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const prevPos = useRef<{ x: number; y: number } | null>(null);

  const svgPath = useMemo(
    () => generateSmoothPath(targetX, targetY, containerWidth, containerHeight),
    [targetX, targetY, containerWidth, containerHeight]
  );

  const duration = 5;

  // Use offsetPath for smooth curved motion with auto-rotation
  const motionStyle = useMemo(
    () => ({
      offsetPath: `path('${svgPath}')`,
      offsetRotate: "auto 90deg",
    }),
    [svgPath]
  );

  return (
    <>
      {phase === "flying" && (
        <Trail path={svgPath} duration={duration} />
      )}

      <AnimatePresence>
        {phase === "flying" && (
          <motion.div
            ref={rocketRef}
            className="absolute top-0 left-0 z-40 pointer-events-none"
            style={{
              ...motionStyle,
              x: -20,
              y: -20,
            }}
            initial={{ offsetDistance: "0%", scale: 0.6, opacity: 0.8 }}
            animate={{ offsetDistance: "100%", scale: 1, opacity: 1 }}
            transition={{
              duration,
              ease: [0.25, 0.1, 0.25, 1],
              scale: { duration: 0.5, ease: "easeOut" },
              opacity: { duration: 0.3 },
            }}
            onAnimationComplete={() => setPhase("exploding")}
          >
            <Rocket />
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "exploding" && (
        <Explosion x={targetX} y={targetY} onComplete={onComplete} />
      )}
    </>
  );
}
