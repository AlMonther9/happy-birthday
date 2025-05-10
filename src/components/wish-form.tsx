"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

interface WishFormProps {
  onWishSent: (wish: string) => void;
  gender?: "male" | "female";
}

export default function WishForm({
  onWishSent,
  gender = "male",
}: WishFormProps) {
  const [wish, setWish] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 200;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setWish(value);
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wish.trim()) return;

    setIsSubmitting(true);

    // Simulate sending delay for better UX
    setTimeout(() => {
      onWishSent(wish);
      setIsSubmitting(false);
      setWish("");
    }, 1500);
  };

  // Gender-specific text
  const submitButtonText =
    gender === "female" ? "ابعثي الأمنية" : "ابعث الأمنية";
  const placeholderText =
    gender === "female" ? "اكتبي أمنيتك هنا..." : "اكتب أمنيتك هنا...";
  const loadingText =
    gender === "female" ? "جاري إرسال الأمنية..." : "جاري إرسال الأمنية...";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mt-6"
    >
      <Card className="bg-white/90 backdrop-blur-sm border-pink-100 overflow-hidden">
        <CardContent className="pt-6 relative">
          {/* Sparkle decorations */}
          <motion.div
            className="absolute top-2 right-2 text-pink-300"
            animate={{ rotate: 360 }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Sparkles size={16} />
          </motion.div>
          <motion.div
            className="absolute bottom-2 left-2 text-cyan-300"
            animate={{ rotate: -360 }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Sparkles size={16} />
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  value={wish}
                  onChange={handleChange}
                  placeholder={placeholderText}
                  className="mb-1 font-cairo resize-none min-h-[120px] border-pink-200 focus:border-pink-300 focus-visible:ring-pink-200 transition-all"
                  dir="rtl"
                />
                <div className="text-xs text-gray-500 text-left">
                  {charCount}/{MAX_CHARS}
                </div>
              </div>

              <Button
                type="submit"
                disabled={!wish.trim() || isSubmitting}
                className={`w-full transition-all ${
                  isSubmitting
                    ? "bg-gradient-to-r from-pink-400 to-pink-500"
                    : "bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600"
                } text-white shadow-md hover:shadow-lg`}
              >
                {isSubmitting ? (
                  <motion.div
                    className="flex items-center gap-2"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <span>{loadingText}</span>
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{submitButtonText}</span>
                    <Heart className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
