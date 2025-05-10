"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HeaderNav() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isCreatePage = pathname === "/create";
  const isHomePage = pathname === "/";

  return (
    <motion.div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-30 flex gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 shadow-md border border-pink-100"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Link
        href="/"
        className={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-full transition-all",
          isHomePage
            ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white"
            : "hover:bg-pink-100 text-pink-600"
        )}
      >
        <Home className="h-4 w-4" />
        <span className="text-sm font-medium">الرئيسية</span>
      </Link>

      <Link
        href="/create"
        className={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-full transition-all",
          isCreatePage
            ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white"
            : "hover:bg-cyan-100 text-cyan-600"
        )}
      >
        <Plus className="h-4 w-4" />
        <span className="text-sm font-medium">إنشاء احتفال</span>
      </Link>
    </motion.div>
  );
}
