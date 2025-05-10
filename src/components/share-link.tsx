"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Facebook,
  Twitter,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface ShareLinkProps {
  name: string;
  gender?: "male" | "female";
}

export default function ShareLink({ name, gender = "male" }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    // Generate the share URL when component mounts
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      // If we're on the create page, generate the celebration URL
      if (url.pathname.includes("/create")) {
        const baseUrl = `${window.location.origin}/${encodeURIComponent(name)}`;
        const fullUrl =
          gender === "female" ? `${baseUrl}?gender=female` : baseUrl;
        setShareUrl(fullUrl);
      } else {
        // We're already on a celebration page, use the current URL
        setShareUrl(window.location.href);
      }
    }
  }, [name, gender]);

  const copyToClipboard = async () => {
    if (!mounted) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      toast({
        title: "تم نسخ الرابط",
        description: "يمكنك الآن مشاركته مع أصدقائك",
        variant: "success",
        duration: 3000,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "فشل نسخ الرابط",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const shareToSocial = (platform: "facebook" | "twitter" | "whatsapp") => {
    if (!mounted) return;

    let shareLink = "";
    const encodedUrl = encodeURIComponent(shareUrl);
    const message = encodeURIComponent(`عيد ميلاد سعيد ${name}! 🎂🎉`);

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${message}&url=${encodedUrl}`;
        break;
      case "whatsapp":
        shareLink = `https://api.whatsapp.com/send?text=${message} ${encodedUrl}`;
        break;
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "noopener,noreferrer");
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full">
      <motion.p
        className="text-sm text-gray-500 text-center mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        شارك رابط الاحتفال مع {name}
      </motion.p>

      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {/* Copy link button */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-2 shadow-sm">
          <div className="flex-1 truncate text-xs text-gray-500 px-2 rtl:text-right ltr:text-left dir-ltr">
            {shareUrl}
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            <span>{copied ? "تم النسخ" : "نسخ"}</span>
          </button>
        </div>

        {/* Social share buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => shareToSocial("whatsapp")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-sm transition-colors cursor-pointer"
            aria-label="Share on WhatsApp"
          >
            <FaWhatsapp className="h-5 w-5" />
          </button>

          <button
            onClick={() => shareToSocial("facebook")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-5 w-5" />
          </button>

          <button
            onClick={() => shareToSocial("twitter")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-sm transition-colors cursor-pointer"
            aria-label="Share on Twitter"
          >
            <Twitter className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
