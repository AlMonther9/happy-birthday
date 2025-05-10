"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hand } from "lucide-react";

interface CakeTooltipProps {
  shown: boolean;
  gender?: "male" | "female";
}

export default function CakeTooltip({
  shown,
  gender = "male",
}: CakeTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (shown) {
      const timer = setTimeout(() => {
        setIsVisible(true);

        // Hide after 5 seconds
        const hideTimer = setTimeout(() => {
          setIsVisible(false);
        }, 5000);

        return () => clearTimeout(hideTimer);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [shown]);

  // Gender-specific text
  const tooltipText =
    gender === "female"
      ? "انقري على الكيكة لإطفاء الشموع"
      : "انقر على الكيكة لإطفاء الشموع";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm">
            <Hand className="h-4 w-4 text-white" />
            <span className="text-sm whitespace-nowrap">{tooltipText}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
