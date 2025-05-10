"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, VolumeX, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

interface MicButtonProps {
  onSoundDetected: () => void;
  isActive: boolean;
  threshold?: number;
}

export default function MicButton({
  onSoundDetected,
  isActive,
  threshold = 15,
}: MicButtonProps) {
  const [soundLevel, setSoundLevel] = useState(0);
  const [permissionState, setPermissionState] = useState<
    "prompt" | "granted" | "denied" | "unsupported"
  >("prompt");
  const [showTooltip, setShowTooltip] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male");
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Get gender from URL
  useEffect(() => {
    const urlGender = searchParams.get("gender");
    if (urlGender === "female") {
      setGender("female");
    } else {
      setGender("male");
    }
  }, [searchParams]);

  // Check if browser supports microphone
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionState("unsupported");
      return;
    }

    // Check if permission was previously granted/denied
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "microphone" as PermissionName })
        .then((permissionStatus) => {
          setPermissionState(
            permissionStatus.state as "prompt" | "granted" | "denied"
          );

          permissionStatus.onchange = () => {
            setPermissionState(
              permissionStatus.state as "prompt" | "granted" | "denied"
            );
          };
        })
        .catch((err) => {
          console.error("Permission query error:", err);
        });
    }
  }, []);

  // Initialize microphone
  const initMicrophone = async () => {
    if (audioContextRef.current || !isActive) return;

    try {
      // First check if we're in a secure context (HTTPS)
      if (window.isSecureContext === false) {
        throw new Error("Microphone access requires a secure context (HTTPS)");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContext =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContext) {
        throw new Error("AudioContext not supported");
      }

      const context = new AudioContext();
      const analyser = context.createAnalyser();
      const microphone = context.createMediaStreamSource(stream);

      microphone.connect(analyser);
      analyser.fftSize = 256;

      audioContextRef.current = context;
      analyserRef.current = analyser;
      microphoneRef.current = microphone;

      setPermissionState("granted");
      startListening();

      // Gender-specific message
      const blowText =
        gender === "female"
          ? "انفخي أو تحدثي بصوت عالٍ"
          : "انفخ أو تحدث بصوت عالٍ";

      toast({
        title: "تم تفعيل الميكروفون",
        description: `${blowText} لإطفاء الشموع!`,
        variant: "info",
        duration: 3000,
      });
    } catch (error) {
      console.error("Microphone error:", error);
      setPermissionState("denied");

      // More specific error message based on the error
      let errorMessage = "يرجى السماح بالوصول للميكروفون لتجربة أفضل";
      const clickText =
        gender === "female"
          ? "يمكنك النقر على الكيكة لإطفائها"
          : "يمكنك النقر على الكيكة لإطفائها";

      if (error instanceof DOMException) {
        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          errorMessage = `تم رفض إذن الميكروفون. ${clickText} بدلاً من ذلك.`;
        } else if (
          error.name === "NotFoundError" ||
          error.name === "DevicesNotFoundError"
        ) {
          errorMessage = `لم يتم العثور على ميكروفون. ${clickText} بدلاً من ذلك.`;
        }
      } else if (window.isSecureContext === false) {
        errorMessage = `يتطلب الوصول إلى الميكروفون اتصالاً آمناً (HTTPS). ${clickText} بدلاً من ذلك.`;
      }

      toast({
        title: "لم نتمكن من الوصول للميكروفون",
        description: errorMessage,
        variant: "warning",
        duration: 5000,
      });

      // Automatically trigger manual blow after a short delay
      setTimeout(() => {
        handleManualBlow();
      }, 1000);
    }
  };

  // Start listening for sound
  const startListening = () => {
    if (!analyserRef.current || !isActive) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkSound = () => {
      if (!isActive) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        return;
      }

      analyserRef.current!.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
      setSoundLevel(avg);

      if (avg > threshold) {
        onSoundDetected();
        return;
      }

      animationFrameRef.current = requestAnimationFrame(checkSound);
    };

    animationFrameRef.current = requestAnimationFrame(checkSound);
  };

  // Cleanup resources when component unmounts or isActive changes
  useEffect(() => {
    if (isActive && permissionState === "granted") {
      startListening();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, permissionState]);

  // Cleanup audio resources on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current
          ?.close()
          .catch((err) => console.error("Error closing audio context:", err));
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Add a manual blow function that can be called when clicking on the microphone icon
  const handleManualBlow = () => {
    if (permissionState === "denied" || permissionState === "unsupported") {
      onSoundDetected();
    } else {
      initMicrophone();
    }
  };

  // Gender-specific tooltip text
  const micActiveText =
    gender === "female"
      ? "انفخي في الميكروفون لإطفاء الشموع"
      : "انفخ في الميكروفون لإطفاء الشموع";
  const micInactiveText =
    gender === "female"
      ? "انقري لتفعيل الميكروفون أو إطفاء الشموع"
      : "انقر لتفعيل الميكروفون أو إطفاء الشموع";

  return (
    <div className="relative">
      <motion.div
        className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 ${
          permissionState === "granted"
            ? "bg-gradient-to-r from-pink-500 to-pink-600"
            : "bg-white/80"
        } backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-pink-100`}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {permissionState === "granted" && (
          <div className="relative h-4 w-24 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-white/80"
              style={{ width: `${Math.min(100, soundLevel * 2)}%` }}
            />
          </div>
        )}

        <button
          onClick={handleManualBlow}
          className="cursor-pointer focus:outline-none relative"
          aria-label={
            permissionState === "granted"
              ? "Microphone active"
              : "Activate microphone or blow manually"
          }
        >
          {permissionState === "granted" ? (
            <Mic className="h-6 w-6 text-white animate-pulse" />
          ) : permissionState === "denied" ? (
            <VolumeX className="h-6 w-6 text-pink-500 hover:text-pink-600 transition-colors" />
          ) : (
            <Volume2 className="h-6 w-6 text-pink-500 hover:text-pink-600 transition-colors" />
          )}
        </button>

        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1.5 px-3 rounded-lg whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {permissionState === "granted" ? micActiveText : micInactiveText}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
