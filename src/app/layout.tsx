import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { BackgroundGradient } from "@/components/background-gradient";
import HeaderNav from "@/components/header-nav";

export const metadata: Metadata = {
  title: "عيد ميلاد سعيد 🎂",
  description: "احتفال عيد ميلاد تفاعلي",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head></head>
      <body className="relative min-h-dvh overflow-x-hidden">
        <BackgroundGradient />

        <HeaderNav />

        <main className="relative z-10 pt-16">{children}</main>

        <footer className="fixed bottom-0 left-0 w-full py-2 px-4 text-center text-xs text-pink-600/70 z-20">
          <div className="container mx-auto flex justify-between items-center">
            <span className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              Made by: <span className="font-semibold">AlMonther</span> ✨
            </span>
            <span className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              عيد ميلاد سعيد 🎂
            </span>
          </div>
        </footer>

        <Toaster />
      </body>
    </html>
  );
}
