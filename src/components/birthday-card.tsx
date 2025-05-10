"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BirthdayCake from "@/components/birthday-cake";
import WishForm from "@/components/wish-form";
import Animations from "@/components/animations";
import MicButton from "@/components/mic-button";
import CakeTooltip from "@/components/cake-tooltip";
import ShareLink from "@/components/share-link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Cake, Sparkles, Share2 } from "lucide-react";
import { sendWish } from "@/app/actions";

interface BirthdayCardProps {
  name?: string;
  gender?: "male" | "female";
}

export default function BirthdayCard({
  name = "",
  gender: propGender,
}: BirthdayCardProps) {
  // Client-side state initialization to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [blown, setBlown] = useState(false);
  const [showWishForm, setShowWishForm] = useState(false);
  const [message, setMessage] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [wishSent, setWishSent] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [showCakeTooltip, setShowCakeTooltip] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const { toast } = useToast();
  const searchParams = useSearchParams();

  // Initialize after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
    const customName = searchParams.get("name");
    const urlGender = searchParams.get("gender");

    const finalName = customName || name || "فنان";
    const finalGender =
      propGender || (urlGender === "female" ? "female" : "male");

    setRecipientName(finalName);
    setGender(finalGender);

    // Set gender-specific message
    if (finalGender === "female") {
      setMessage(`انفخي في الشموع يا ${finalName} 🎂`);
    } else {
      setMessage(`انفخ في الشموع يا ${finalName} 🎂`);
    }

    setShowNote(true);
    setMicActive(true);
    setShowCakeTooltip(true);

    const timer = setTimeout(() => {
      setShowNote(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, [name, propGender, searchParams]);

  const handleCandlesBlown = () => {
    if (blown) return;

    setBlown(true);
    setMicActive(false);
    setShowCakeTooltip(false);
    setMessage(`عيد ميلاد سعيد يا ${recipientName} 🎉`);

    // Play sound effect
    if (mounted) {
      const audio = new Audio("/sounds/blow-candle.mp3");
      audio.play().catch((err) => console.error("Audio error:", err));
    }

    // Vibration feedback if supported
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    // Gender-specific toast message
    const wishText =
      gender === "female" ? "تمني أمنية خاصة يا" : "تمنى أمنية خاصة يا";

    toast({
      title: "🎉 عيد ميلاد سعيد! 🎉",
      description: `${wishText} ${recipientName}`,
      variant: "success",
      duration: 5000,
    });
  };

  const handleRelight = () => {
    setBlown(false);
    setShowWishForm(false);
    setWishSent(false);
    setShowShareOptions(false);

    // Gender-specific message
    if (gender === "female") {
      setMessage(`انفخي في الشموع يا ${recipientName} 🎤🎂`);
    } else {
      setMessage(`انفخ في الشموع يا ${recipientName} 🎤🎂`);
    }

    setMicActive(true);
    setShowCakeTooltip(true);

    toast({
      title: "تم إعادة إشعال الشموع",
      description: "حاول النفخ مرة أخرى!",
      duration: 3000,
    });
  };

  const handleMakeWish = () => {
    setShowWishForm(true);
    setShowShareOptions(false);
  };

  const handleShare = () => {
    setShowShareOptions(true);
    setShowWishForm(false);
  };

  const handleWishSent = async (wish: string) => {
    if (mounted) {
      const audio = new Audio("/sounds/magic-wand.mp3");
      audio.play().catch((err) => console.error("Audio error:", err));
    }

    setShowWishForm(false);
    setWishSent(true);

    try {
      await sendWish({
        name: recipientName,
        wish: wish,
        date: new Date().toISOString(),
        gender: gender,
      });

      toast({
        title: "✨ تم إرسال أمنيتك ✨",
        description: `أمنيتك في طريقها للتحقق!`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error sending wish:", error);
      toast({
        title: "تم حفظ أمنيتك",
        description: `"${wish.substring(0, 30)}${
          wish.length > 30 ? "..." : ""
        }"`,
        duration: 5000,
      });
    }
  };

  // Don't render anything during SSR to avoid hydration issues
  if (!mounted) {
    return (
      <div className="w-full max-w-lg mx-auto h-[500px] flex items-center justify-center">
        <div className="animate-pulse text-pink-500">
          جاري تحضير الاحتفال...
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-lg mx-auto text-center p-4 md:p-6 rtl"
      dir="rtl"
    >
      <Animations blown={blown} wishSent={wishSent} />

      {/* Microphone button - now outside the card */}
      {micActive && (
        <MicButton
          onSoundDetected={handleCandlesBlown}
          isActive={micActive}
          threshold={15}
        />
      )}

      <motion.div
        className="relative z-10 bg-gradient-to-br from-pink-50/90 to-cyan-50/90 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-pink-100"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Birthday cake - with tooltip and click handler */}
        <div
          className="relative cursor-pointer"
          onClick={handleCandlesBlown}
          aria-label="انقر لإطفاء الشموع"
        >
          <BirthdayCake blown={blown} name={recipientName} />
          <CakeTooltip shown={showCakeTooltip} gender={gender} />
        </div>

        <motion.h1
          className={`text-2xl md:text-3xl font-bold mt-8 mb-6 transition-colors duration-500 ${
            blown ? "text-pink-600" : "text-cyan-700"
          }`}
          animate={{
            scale: blown ? [1, 1.1, 1] : 1,
            color: blown ? "#db2777" : "#0e7490",
          }}
          transition={{ duration: 0.5 }}
        >
          {message}
        </motion.h1>

        <AnimatePresence mode="wait">
          {blown && !showWishForm && !showShareOptions && !wishSent && (
            <motion.div
              className="flex flex-col md:flex-row gap-4 justify-center mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button
                onClick={handleRelight}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Cake className="h-4 w-4 mr-2" />
                إشعال الشموع مرة أخرى
              </Button>

              <Button
                onClick={handleMakeWish}
                className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {gender === "female" ? "اكتبي أمنيتك" : "اكتب أمنيتك"}
              </Button>

              <Button
                onClick={handleShare}
                className="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Share2 className="h-4 w-4 mr-2" />
                مشاركة الاحتفال
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showWishForm && (
            <WishForm onWishSent={handleWishSent} gender={gender} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showShareOptions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <div className="bg-white/90 backdrop-blur-sm border border-pink-100 rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-medium text-pink-600 mb-4">
                  مشاركة الاحتفال
                </h3>
                <ShareLink name={recipientName} gender={gender} />

                <div className="mt-4">
                  <Button
                    onClick={() => setShowShareOptions(false)}
                    variant="outline"
                    className="w-full mt-2"
                  >
                    العودة
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {wishSent && !showShareOptions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 text-pink-600"
          >
            <div className="flex flex-col gap-4">
              <span className="text-lg">✨ تم إرسال أمنيتك بنجاح ✨</span>

              <Button
                onClick={handleShare}
                className="mx-auto bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Share2 className="h-4 w-4 mr-2" />
                مشاركة الاحتفال مع الأصدقاء
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
