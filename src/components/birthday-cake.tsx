"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Candle from "@/components/candle";

interface BirthdayCakeProps {
  blown: boolean;
  name: string;
}

const CakeLayer = ({
  delay,
  className,
  children,
}: {
  delay: number;
  className: string;
  children?: React.ReactNode;
}) => (
  <motion.div
    className={className}
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, duration: 0.5 }}
  >
    {children}
  </motion.div>
);

export default function BirthdayCake({ blown, name }: BirthdayCakeProps) {
  const [nameOnCake, setNameOnCake] = useState("");

  useEffect(() => {
    setNameOnCake(name.length > 10 ? `${name.substring(0, 10)}...` : name);
  }, [name]);

  // Generate decorative elements
  const sprinkles = useMemo(() => Array.from({ length: 30 }), []);
  const candleColors = useMemo(() => ["pink", "blue", "yellow"] as const, []);

  return (
    <div className="relative mx-auto w-full max-w-[300px] h-[280px] md:h-[320px]">
      {/* Plate */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] h-[30px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-full shadow-lg z-10" />

      {/* Cake */}
      <div className="absolute bottom-[25px] left-1/2 -translate-x-1/2 w-[240px]">
        {/* Bottom Layer */}
        <CakeLayer
          delay={0.1}
          className="absolute bottom-0 w-full h-[70px] bg-gradient-to-b from-pink-300 to-pink-400 rounded-b-[30px] rounded-t-[10px] shadow-md overflow-hidden"
        >
          {/* Texture for bottom layer */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`texture-bottom-${i}`}
                className="absolute w-full h-[1px] bg-white"
                style={{ top: `${i * 8 + 10}px` }}
              />
            ))}
          </div>

          {/* Bottom decorations */}
          <div className="absolute bottom-[10px] left-0 w-full flex justify-around">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`dot-bottom-${i}`}
                className="w-[8px] h-[8px] rounded-full bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              />
            ))}
          </div>
        </CakeLayer>

        {/* Middle Layer */}
        <CakeLayer
          delay={0.2}
          className="absolute bottom-[65px] left-1/2 -translate-x-1/2 w-[200px] h-[50px] bg-gradient-to-b from-cyan-200 to-cyan-300 rounded-[10px] shadow-md overflow-hidden"
        >
          {/* Texture for middle layer */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`texture-middle-${i}`}
                className="absolute w-full h-[1px] bg-white"
                style={{ top: `${i * 8 + 5}px` }}
              />
            ))}
          </div>

          {/* Middle decorations */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-around">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`dot-middle-${i}`}
                className="w-[6px] h-[6px] rounded-full bg-pink-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              />
            ))}
          </div>
        </CakeLayer>

        {/* Top Layer with frosting */}
        <CakeLayer
          delay={0.3}
          className="absolute bottom-[110px] left-1/2 -translate-x-1/2 w-[160px] h-[50px] bg-gradient-to-b from-pink-200 to-pink-300 rounded-[10px] shadow-md overflow-hidden"
        >
          {/* Name on cake */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <span className="text-sm font-bold text-pink-700">
              {nameOnCake}
            </span>
          </motion.div>

          {/* Frosting drips */}
          <div className="absolute -top-[2px] left-0 w-full overflow-visible">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={`drip-${i}`}
                className="absolute top-0 w-[15px] h-[20px] bg-white rounded-b-full"
                style={{ left: `${i * 10 + 5}%` }}
                initial={{ height: 0 }}
                animate={{ height: 8 + Math.random() * 12 }}
                transition={{ delay: 1 + i * 0.05, duration: 0.5 }}
              />
            ))}
          </div>
        </CakeLayer>
      </div>

      {/* Candles - Fix the positioning and display */}
      <div className="absolute bottom-44 left-1/2 -translate-x-1/2 flex justify-between w-[160px] z-10">
        {candleColors.map((color, index) => (
          <Candle
            key={`candle-${index}`}
            index={index}
            blown={blown}
            color={color as "pink" | "blue" | "yellow"}
          />
        ))}
      </div>

      {/* Sprinkles */}
      <div className="absolute bottom-[30px] left-0 w-full">
        {sprinkles.map((_, i) => {
          const size = 2 + Math.random() * 4;
          const color = ["#f472b6", "#22d3ee", "#fcd34d", "#a78bfa"][
            Math.floor(Math.random() * 4)
          ];
          return (
            <motion.div
              key={`sprinkle-${i}`}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                backgroundColor: color,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + Math.random(), duration: 0.3 }}
            />
          );
        })}
      </div>
    </div>
  );
}
