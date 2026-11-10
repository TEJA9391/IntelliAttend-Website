"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1, // Smooth easing
      wheelMultiplier: 1.8, // Increased scroll speed per wheel tick
      touchMultiplier: 2,
      smoothWheel: true,
      prevent: (node) => {
        return (
          document.body.style.overflow === "hidden" ||
          (node.nodeType === 1 && Boolean(node.closest?.("[data-lenis-prevent]")))
        );
      },
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
