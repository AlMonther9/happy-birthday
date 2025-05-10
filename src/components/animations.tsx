"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useMobile } from "@/hooks/use-mobile";

interface AnimationsProps {
  blown: boolean;
  wishSent: boolean;
}

export default function Animations({ blown, wishSent }: AnimationsProps) {
  const [stars, setStars] = useState<
    { id: number; top: string; left: string; size: number; duration: number }[]
  >([]);
  const [particles, setParticles] = useState<
    {
      id: number;
      x: number;
      y: number;
      size: number;
      color: string;
      duration: number;
    }[]
  >([]);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useMobile();

  // Create stars
  useEffect(() => {
    const starCount = isMobile ? 100 : 150;
    const newStars = Array.from({ length: starCount }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      duration: 2 + Math.random() * 3,
    }));

    setStars(newStars);
  }, [isMobile]);

  // Handle confetti when candles are blown
  useEffect(() => {
    if (blown) {
      // Trigger confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#ec4899", "#0ea5e9", "#f59e0b", "#8b5cf6"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#ec4899", "#0ea5e9", "#f59e0b", "#8b5cf6"],
        });
      }, 250);

      // Create floating particles
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 5 + Math.random() * 10,
        color: ["#ec4899", "#0ea5e9", "#f59e0b", "#8b5cf6"][
          Math.floor(Math.random() * 4)
        ],
        duration: 3 + Math.random() * 7,
      }));

      setParticles(newParticles);

      return () => clearInterval(interval);
    }
  }, [blown]);

  // Handle special effects when wish is sent
  useEffect(() => {
    if (wishSent) {
      // Magical sparkle effect
      const createSparkles = () => {
        const canvas = confettiCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const sparkles: {
          x: number;
          y: number;
          size: number;
          vx: number;
          vy: number;
          alpha: number;
          color: string;
        }[] = [];

        for (let i = 0; i < 100; i++) {
          sparkles.push({
            x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
            y: window.innerHeight / 2 + (Math.random() - 0.5) * 200,
            size: 1 + Math.random() * 3,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            alpha: 1,
            color: ["#ec4899", "#0ea5e9", "#f59e0b", "#8b5cf6"][
              Math.floor(Math.random() * 4)
            ],
          });
        }

        let animationFrame: number;

        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          let stillAlive = false;

          for (const sparkle of sparkles) {
            if (sparkle.alpha <= 0) continue;

            stillAlive = true;
            sparkle.x += sparkle.vx;
            sparkle.y += sparkle.vy;
            sparkle.alpha -= 0.01;

            ctx.beginPath();
            ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
            ctx.fillStyle =
              sparkle.color +
              Math.floor(sparkle.alpha * 255)
                .toString(16)
                .padStart(2, "0");
            ctx.fill();
          }

          if (stillAlive) {
            animationFrame = requestAnimationFrame(animate);
          }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
      };

      const cleanup = createSparkles();
      return cleanup;
    }
  }, [wishSent]);

  return (
    <>
      {/* Stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-yellow-100 animate-twinkle"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <AnimatePresence>
        {blown &&
          particles.map((particle) => (
            <motion.div
              key={`particle-${particle.id}`}
              className="fixed rounded-full z-10 pointer-events-none"
              style={{
                backgroundColor: particle.color,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: particle.duration,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
      </AnimatePresence>

      {/* Balloons */}
      <AnimatePresence>
        {blown && (
          <>
            {Array.from({ length: isMobile ? 6 : 10 }).map((_, index) => (
              <motion.div
                key={`balloon-${index}`}
                className="fixed pointer-events-none z-10"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  bottom: "-50px",
                }}
                initial={{ y: 0, opacity: 1 }}
                animate={{
                  y: -window.innerHeight * 1.2,
                  x: Math.random() * 100 - 50,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  ease: "easeOut",
                  delay: index * 0.2,
                }}
              >
                {/* Balloon */}
                <div
                  className="relative w-12 h-16 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${
                      ["#ec4899", "#0ea5e9", "#f59e0b", "#8b5cf6"][index % 4]
                    }, ${
                      ["#be185d", "#0369a1", "#d97706", "#6d28d9"][index % 4]
                    })`,
                  }}
                />
                {/* String */}
                <div className="absolute top-[95%] left-1/2 w-[1px] h-10 bg-gray-400" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Canvas for special effects */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 pointer-events-none z-20"
        style={{ opacity: wishSent ? 1 : 0 }}
      />
    </>
  );
}
