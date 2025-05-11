"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, VolumeX, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

interface MicButtonProps {
  onSoundDetected: () => void;
  isActive: boolean;
  threshold?: number;
  // Add a cooldown period option
  cooldownMs?: number;
}

export default function MicButton({
  onSoundDetected,
  isActive,
  threshold = 15,
  // Default 1000ms cooldown
  cooldownMs = 1000,
}: MicButtonProps) {
  const [soundLevel, setSoundLevel] = useState(0);
  const [permissionState, setPermissionState] = useState<
    "prompt" | "granted" | "denied" | "unsupported"
  >("prompt");
  const [showTooltip, setShowTooltip] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [isInCooldown, setIsInCooldown] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  // Track if component is mounted to prevent memory leaks
  const isMountedRef = useRef(true);

  // Memoize the onSoundDetected callback to prevent unnecessary re-renders
  const handleSoundDetected = useCallback(() => {
    if (!isInCooldown) {
      setIsInCooldown(true);
      onSoundDetected();

      // Set cooldown timer
      setTimeout(() => {
        if (isMountedRef.current) {
          setIsInCooldown(false);
        }
      }, cooldownMs);
    }
  }, [onSoundDetected, isInCooldown, cooldownMs]);

  // Get gender from URL
  useEffect(() => {
    const urlGender = searchParams.get("gender");
    setGender(urlGender === "female" ? "female" : "male");
  }, [searchParams]);

  // Set mount state on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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
          if (isMountedRef.current) {
            setPermissionState(
              permissionStatus.state as "prompt" | "granted" | "denied"
            );

            permissionStatus.onchange = () => {
              if (isMountedRef.current) {
                setPermissionState(
                  permissionStatus.state as "prompt" | "granted" | "denied"
                );
              }
            };
          }
        })
        .catch((err) => {
          console.error("Permission query error:", err);
        });
    }
  }, []);

  // Cleanup function to properly release microphone resources
  const cleanupMicResources = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Disconnect any audio nodes
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current?.state !== "closed") {
      try {
        audioContextRef.current?.close();
      } catch (err) {
        console.error("Error closing audio context:", err);
      }
      audioContextRef.current = null;
    }

    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Reset sound level
    if (isMountedRef.current) {
      setSoundLevel(0);
    }
  }, []);

  // Initialize microphone
  const initMicrophone = useCallback(async () => {
    // Clean up any existing resources first
    cleanupMicResources();

    if (!isActive || !isMountedRef.current) return;

    try {
      // First check if we're in a secure context (HTTPS)
      if (window.isSecureContext === false) {
        throw new Error("Microphone access requires a secure context (HTTPS)");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Check if we're still mounted after the async operation
      if (!isMountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

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

      if (isMountedRef.current) {
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
      }
    } catch (error) {
      console.error("Microphone error:", error);

      if (!isMountedRef.current) return;

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
        if (isMountedRef.current) {
          handleManualBlow();
        }
      }, 1000);
    }
  }, [isActive, gender, toast, cleanupMicResources]);

  // Start listening for sound
  const startListening = useCallback(() => {
    if (!analyserRef.current || !isActive || !isMountedRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Keep track of consecutive frames above threshold
    let framesAboveThreshold = 0;
    const requiredFrames = 2; // Require 2 consecutive frames above threshold to trigger

    const checkSound = () => {
      if (!isActive || !isMountedRef.current || !analyserRef.current) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate average, but focus on specific frequency range more likely to be blowing
      // This helps filter out background noise
      const lowFreqAvg =
        dataArray
          .slice(0, Math.floor(bufferLength * 0.3))
          .reduce((sum, val) => sum + val, 0) /
        (bufferLength * 0.3);

      const midFreqAvg =
        dataArray
          .slice(Math.floor(bufferLength * 0.3), Math.floor(bufferLength * 0.7))
          .reduce((sum, val) => sum + val, 0) /
        (bufferLength * 0.4);

      // Weight mid frequencies more heavily as they're typical for blowing sounds
      const weightedAvg = lowFreqAvg * 0.3 + midFreqAvg * 0.7;

      if (isMountedRef.current) {
        setSoundLevel(weightedAvg);
      }

      if (weightedAvg > threshold) {
        framesAboveThreshold++;
        if (framesAboveThreshold >= requiredFrames && !isInCooldown) {
          handleSoundDetected();
          framesAboveThreshold = 0;
          return;
        }
      } else {
        framesAboveThreshold = 0;
      }

      animationFrameRef.current = requestAnimationFrame(checkSound);
    };

    animationFrameRef.current = requestAnimationFrame(checkSound);
  }, [isActive, threshold, isInCooldown, handleSoundDetected]);

  // Handle manual blow function
  const handleManualBlow = useCallback(() => {
    if (permissionState === "denied" || permissionState === "unsupported") {
      handleSoundDetected();
    } else {
      initMicrophone();
    }
  }, [permissionState, handleSoundDetected, initMicrophone]);

  // Effect to handle active state changes
  useEffect(() => {
    if (isActive) {
      if (permissionState === "granted") {
        // If permission is already granted, just start listening
        startListening();
      } else if (
        permissionState !== "denied" &&
        permissionState !== "unsupported"
      ) {
        // If not denied or unsupported, try to initialize
        initMicrophone();
      }
    } else {
      // If not active, clean up resources
      cleanupMicResources();
    }

    return () => {
      cleanupMicResources();
    };
  }, [
    isActive,
    permissionState,
    startListening,
    initMicrophone,
    cleanupMicResources,
  ]);

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
        } backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-pink-100 cursor-pointer`}
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
          className={`cursor-pointer focus:outline-none relative ${
            isInCooldown ? "opacity-50" : ""
          }`}
          aria-label={
            permissionState === "granted"
              ? "Microphone active"
              : "Activate microphone or blow manually"
          }
          disabled={isInCooldown}
        >
          {permissionState === "granted" ? (
            <Mic
              className={`h-6 w-6 text-white ${
                isInCooldown ? "" : "animate-pulse"
              }`}
            />
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
              {permissionState === "granted"
                ? isInCooldown
                  ? "الرجاء الانتظار قليلاً..."
                  : micActiveText
                : micInactiveText}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
