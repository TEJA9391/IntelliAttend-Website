"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Counter({ from = 0, to, duration = 2, suffix = "" }: { from?: number, to: number, duration?: number, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (inView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);

        if (progress < 1) {
          setCount(Math.floor(from + (to - from) * (1 - Math.pow(1 - progress, 3)))); // Cubic ease out
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(to);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [inView, from, to, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsAndTrust() {
  const logos = [
    "Universities",
    "Engineering Colleges",
    "Schools",
    "Institutions",
    "Government",
    "Corporate Training"
  ];

  const stats = [
    { value: 98, suffix: "%", label: "Attendance Accuracy" },
    { value: 80, suffix: "%", label: "Time Saved" },
    { value: 500, suffix: "+", label: "Institutions" },
    { value: 250, suffix: "K+", label: "Students" },
    { value: 10, suffix: "K+", label: "Faculty" },
  ];

  return (
    <section className="py-24 border-y border-white/5 bg-[#050816]/50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Trusted By Marquee */}
        <div className="mb-24">
          <p className="text-center text-sm font-semibold tracking-wide text-slate-400 uppercase mb-8">
            Trusted by modern educational institutions worldwide
          </p>
          <div className="relative flex overflow-hidden mask-image-gradient">
            <motion.div
              animate={{ x: [0, -1035] }} // Adjust based on content width
              transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
              className="flex gap-16 items-center whitespace-nowrap pr-16"
            >
              {[...logos, ...logos, ...logos].map((logo, i) => (
                <div key={i} className="text-2xl font-bold text-slate-600/50 uppercase tracking-widest">
                  {logo}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 border-t border-white/5 pt-16">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <Counter to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-medium text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .mask-image-gradient {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}} />
    </section>
  );
}
