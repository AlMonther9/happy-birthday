"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MicrophoneDetectorProps {
  onSoundDetected: () => void;
  isActive: boolean;
  threshold?: number;
}

export default function MicrophoneDetector({
  onSoundDetected,
  isActive,
  threshold = 15,
}: MicrophoneDetectorProps) {
  const [soundLevel, setSoundLevel] = useState(0);
  const [permissionState, setPermissionState] = useState<
    "prompt" | "granted" | "denied" | "unsupported"
  >("prompt");
  const { toast } = useToast();

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContext: typeof window.AudioContext | undefined =
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

      toast({
        title: "تم تفعيل الميكروفون",
        description: "انفخ أو تحدث بصوت عالٍ لإطفاء الشموع!",
        variant: "info",
        duration: 3000,
      });
    } catch (error) {
      console.error("Microphone error:", error);
      setPermissionState("denied");

      toast({
        title: "لم نتمكن من الوصول للميكروفون",
        description: "يرجى السماح بالوصول للميكروفون لتجربة أفضل",
        variant: "warning",
        duration: 5000,
      });
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

  return (
    <div className="relative">
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="relative h-5 w-24 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-pink-400"
                style={{ width: `${Math.min(100, soundLevel * 2)}%` }}
              />
            </div>

            <button
              onClick={initMicrophone}
              className="cursor-pointer focus:outline-none"
              aria-label={
                permissionState === "granted"
                  ? "Microphone active"
                  : "Activate microphone"
              }
            >
              {permissionState === "granted" ? (
                <Mic className="h-5 w-5 text-pink-500 animate-pulse" />
              ) : permissionState === "denied" ? (
                <VolumeX className="h-5 w-5 text-red-500" />
              ) : (
                <Volume2 className="h-5 w-5 text-gray-400 hover:text-pink-500 transition-colors" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
