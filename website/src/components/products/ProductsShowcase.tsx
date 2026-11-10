"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const showcaseItems = [
  {
    title: "SmartBoard",
    description: "Interactive classroom displays with one-tap content sharing, live presentations, announcements, attendance dashboards, and real-time lecture synchronization.",
    image: "/images/products/smartboard_real_display.jpg",
    reverse: false,
    aspectRatio: "1024 / 686",
    objectFit: "object-contain",
    isWide: true,
  },
  {
    title: "Faculty",
    description: "Manage classes, attendance, lecture resources, SmartBoard sessions, schedules, and academic workflows from one intelligent dashboard.",
    image: "/images/products/faculty_real_mockup.png",
    reverse: true,
    aspectRatio: "1024 / 541",
    objectFit: "object-contain",
    isWide: true,
  },
  {
    title: "Students",
    description: "Track attendance, academic progress, assignments, schedules, notifications, and learning resources from a personalized student portal.",
    image: "/images/products/student_dashboard_v4.png",
    reverse: false,
    aspectRatio: "4 / 3",
    objectFit: "object-cover",
  },
  {
    title: "Administration",
    description: "Monitor departments, faculty performance, attendance, classrooms, reports, and campus operations from a centralized control center.",
    image: "/images/products/admin_dashboard.jpg",
    reverse: true,
    aspectRatio: "1024 / 492",
    objectFit: "object-contain",
    isWide: true,
  },
  {
    title: "AI Analytics",
    description: "Turn academic data into actionable insights with predictive attendance trends, faculty performance metrics, and real-time institutional reports.",
    image: "/images/products/ai_analytics_mockup.png",
    reverse: false,
    aspectRatio: "1024 / 571",
    objectFit: "object-contain",
    isWide: true,
  },
  {
    title: "Campus Communication",
    description: "Deliver announcements, emergency alerts, timetable changes, and academic updates instantly to faculty and students.",
    image: "/images/products/campus_communication_mockup.png",
    reverse: true,
    aspectRatio: "1024 / 764",
    objectFit: "object-contain",
    isWide: true,
  }
];

export function ProductsShowcase() {
  const [zoomedItem, setZoomedItem] = useState<{ title: string; image: string } | null>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomedItem(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6">
            Everything you need. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Built into one platform.</span>
          </h2>
          <p className="text-xl text-[#64748B]">
            Explore the specialized tools designed for every role across your entire campus.
          </p>
        </div>

        <div className="flex flex-col gap-32">
          {showcaseItems.map((item, idx) => (
            <div 
              key={idx}
              className={`flex flex-col gap-12 lg:gap-20 items-center ${
                item.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              {/* Text Content */}
              <motion.div 
                initial={{ opacity: 0, x: item.reverse ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={cn("w-full flex flex-col justify-center", item.isWide ? "lg:w-[44%]" : "lg:w-1/2")}
              >
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-primary bg-primary/10 border border-primary/20 mb-6 w-fit">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Module 0{idx + 1}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-6 leading-tight">
                  {item.title}
                </h3>
                <p className="text-lg text-[#64748B] leading-relaxed mb-8">
                  {item.description}
                </p>
              </motion.div>

              {/* Image Content */}
              <motion.div 
                initial={{ opacity: 0, x: item.reverse ? -40 : 40, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.25, ease: "easeOut", delay: 0.1 }}
                className={cn("w-full relative", item.isWide ? "lg:w-[56%]" : "lg:w-1/2")}
              >
                <div 
                  style={{ aspectRatio: item.aspectRatio || "4 / 3" }}
                  className={cn(
                    "relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 border border-slate-200/80 transition-all group",
                    item.isWide ? "bg-slate-900/[0.02] p-1 sm:p-2 cursor-pointer hover:border-primary/40" : "bg-slate-50"
                  )}
                  onClick={() => item.isWide && setZoomedItem(item)}
                >
                  <Image 
                    src={item.image}
                    alt={item.title}
                    fill
                    unoptimized
                    priority={item.isWide}
                    className={cn(
                      "transition-all duration-200",
                      item.objectFit === "object-contain" 
                        ? "object-contain rounded-2xl" 
                        : "object-cover hover:scale-105"
                    )}
                  />
                  
                  {/* Subtle click to enlarge badge for widescreen dashboard */}
                  {item.isWide && (
                    <div className="absolute bottom-3 right-3 z-10 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-md">
                      <Maximize2 className="w-3.5 h-3.5" /> Click to Expand
                    </div>
                  )}

                  {!item.isWide && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 pointer-events-none" />
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for High-Resolution View */}
      <AnimatePresence>
        {zoomedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedItem(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 cursor-zoom-out"
          >
            <div 
              className="relative max-w-6xl w-auto bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-slate-900/90">
                <span className="text-white font-semibold text-sm">{zoomedItem.title} • Live System Preview</span>
                <button
                  onClick={() => setZoomedItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-2 sm:p-4 flex items-center justify-center bg-slate-950 overflow-hidden">
                <img
                  src={zoomedItem.image}
                  alt={zoomedItem.title}
                  className="max-h-[78vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
