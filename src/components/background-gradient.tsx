"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function BackgroundGradient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-cyan-50 to-purple-50" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-pink-200/20 to-pink-300/20 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-cyan-200/20 to-cyan-300/20 blur-3xl"
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-purple-200/10 to-purple-300/10 blur-3xl"
        animate={{
          x: [0, 15, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-radial-vignette opacity-30" />
    </div>
  );
}
