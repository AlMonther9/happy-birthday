"use client";

import { useState, useEffect } from "react";

export const useMobile = () => {
  // Default to false for server-side rendering to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Only run on client-side
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    // Set initial value
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};
