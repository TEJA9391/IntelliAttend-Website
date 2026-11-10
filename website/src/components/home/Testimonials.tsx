"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Star, StarHalf, MessageSquareHeart } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  getDisplayedTestimonials, 
  INITIAL_TESTIMONIALS, 
  FeedbackItem
} from "@/lib/feedback-service";

const WORDS = [
  "Educators",
  "Students",
  "Faculty"
];

export function Testimonials() {
  const [wordIndex, setWordIndex] = useState(0);
  const [items, setItems] = useState<FeedbackItem[]>(INITIAL_TESTIMONIALS);

  useEffect(() => {
    // Initial client load
    setItems(getDisplayedTestimonials());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenFeedback = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("intelliattend:open-feedback"));
    }
  };

  // Duplicate for seamless infinite marquee loop
  const displayItems = items.length <= 4 
    ? [...items, ...items, ...items, ...items] 
    : [...items, ...items];

  return (
    <section className="py-32 relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 flex items-center justify-center gap-2">
            Loved{" "}
            <span className="inline-flex items-center gap-3">
              <span className="pb-1 text-slate-900">
                by
              </span>
              <span className="inline-grid text-left pb-1" style={{ perspective: "1000px" }}>
                {/* Invisible placeholder for max width to prevent layout shift */}
                <span className="invisible col-start-1 row-start-1 pointer-events-none">
                  Educators
                </span>
                <AnimatePresence>
                  <motion.span
                    key={wordIndex}
                    initial={{ rotateX: -90, y: 20, opacity: 0 }}
                    animate={{ rotateX: 0, y: 0, opacity: 1 }}
                    exit={{ rotateX: 90, y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="col-start-1 row-start-1 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
                    style={{ transformOrigin: "center center" }}
                  >
                    {WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </h2>
          <p className="text-lg text-[#64748B] mb-8">
            Faculty feedback, student experiences, and pilot deployment reviews from Malla Reddy Colleges.
          </p>

          <button
            onClick={handleOpenFeedback}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer group"
          >
            <MessageSquareHeart className="w-4 h-4 text-teal-300 group-hover:scale-110 transition-transform" />
            <span>Share Feedback</span>
          </button>
        </div>

        {/* Animated Slider */}
        <div className="relative flex overflow-hidden mask-image-gradient py-10">
          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{ repeat: Infinity, ease: "linear", duration: Math.max(25, items.length * 6) }}
            className="flex gap-8 items-center"
          >
            {displayItems.map((t, i) => (
              <div
                key={`${t.id || t.name}-${i}`}
                className="apple-card w-[420px] shrink-0 p-10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => {
                      if (t.rating >= star) {
                        return <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />;
                      }
                      if (t.rating >= star - 0.5) {
                        return <StarHalf key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />;
                      }
                      return <Star key={star} className="w-5 h-5 text-slate-200 fill-slate-100" />;
                    })}
                    <span className="ml-2 text-xs font-bold text-slate-400 self-center">
                      {t.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-[#0F172A] text-lg leading-relaxed mb-10 font-medium">&quot;{t.text}&quot;</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className={cn("w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl", t.color || "bg-teal-100 text-teal-800")}>
                    {t.initial || t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[#0F172A] font-bold">{t.name}</h4>
                    <p className="text-sm text-[#64748B] font-medium">{t.role}{t.institution ? `, ${t.institution}` : ""}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .mask-image-gradient {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}} />
    </section>
  );
}
