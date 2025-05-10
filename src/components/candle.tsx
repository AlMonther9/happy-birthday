"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CandleProps {
  index: number;
  blown: boolean;
  height?: number;
  color?: "pink" | "blue" | "yellow";
}

export default function Candle({
  index,
  blown,
  color = "pink",
}: CandleProps) {
  const [smokeParticles, setSmokeParticles] = useState<
    {
      id: number;
      x: number;
      y: number;
      opacity: number;
      scale: number;
      duration: number;
    }[]
  >([]);

  // Generate smoke particles when candle is blown
  useEffect(() => {
    if (blown) {
      const newParticles = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 30,
        y: -(50 + Math.random() * 50),
        opacity: 0.7 + Math.random() * 0.3,
        scale: 0.8 + Math.random() * 1.2,
        duration: 1.5 + Math.random() * 1.5,
      }));
      setSmokeParticles(newParticles);
    } else {
      setSmokeParticles([]);
    }
  }, [blown]);

  // Color variations - ensure these are properly defined
  const candleColors = {
    pink: "from-pink-300 to-pink-400",
    blue: "from-cyan-300 to-cyan-400",
    yellow: "from-amber-300 to-amber-400",
  };

  const flameColors = {
    pink: "from-yellow-200 via-yellow-400 to-orange-500",
    blue: "from-blue-200 via-yellow-300 to-orange-400",
    yellow: "from-yellow-100 via-yellow-300 to-orange-400",
  };

  return (
    <div className="relative">
      {/* Candle body */}
      <motion.div
        className={cn(
          "relative rounded-lg transition-all duration-700",
          blown
            ? "h-6 bg-gradient-to-b from-gray-200 to-gray-300"
            : `bg-gradient-to-b ${candleColors[color]}`
        )}
        style={{
          width: "20px",
          height: blown ? "24px" : "74px",
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
      >
        {/* Candle wick */}
        <div className="absolute -top-1 left-1/2 w-[2px] h-3 bg-gray-800 -translate-x-1/2 rounded-full" />
      </motion.div>

      {/* Flame */}
      <AnimatePresence>
        {!blown && (
          <motion.div
            className="absolute -top-8 left-1/2 w-6 h-10 -translate-x-1/2 z-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Inner flame (white core) */}
            <motion.div
              className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-5 bg-white rounded-full opacity-90"
              animate={{
                height: [5, 6, 5],
                width: [2, 3, 2],
                y: [0, -1, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Outer flame */}
            <motion.div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-5 h-8 bg-gradient-to-t ${flameColors[color]} rounded-t-full rounded-b-lg opacity-90 shadow-glow-yellow`}
              animate={{
                scale: [1, 1.1, 1],
                rotate: ["-3deg", "3deg", "-3deg"],
                y: [0, -1, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smoke effect */}
      <AnimatePresence>
        {blown &&
          smokeParticles.map((particle) => (
            <motion.div
              key={`smoke-${index}-${particle.id}`}
              className="absolute -top-4 left-1/2 w-4 h-4 -translate-x-1/2 rounded-full bg-gradient-radial from-gray-300/70 to-transparent"
              initial={{ opacity: particle.opacity, y: 0, x: 0, scale: 0.5 }}
              animate={{
                opacity: 0,
                y: particle.y,
                x: particle.x,
                scale: particle.scale,
                rotate: Math.random() * 360,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: particle.duration,
                ease: "easeOut",
              }}
            />
          ))}
      </AnimatePresence>
    </div>
  );
}
