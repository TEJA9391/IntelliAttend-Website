"use client";

import { useState, useEffect } from "react";

export function useScrollPosition(): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}

export function useIsScrolled(threshold = 20): boolean {
  const scrollY = useScrollPosition();
  return scrollY > threshold;
}
