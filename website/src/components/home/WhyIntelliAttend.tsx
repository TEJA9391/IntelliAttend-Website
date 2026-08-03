"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight, FileX, ScanFace, FileBarChart, PieChart, BellOff, BellRing, MonitorOff, LayoutDashboard } from "lucide-react";

const comparisons = [
  {
    old: { title: "Manual Attendance", icon: FileX },
    new: { title: "AI Attendance", icon: ScanFace },
  },
  {
    old: { title: "Paper Reports", icon: FileBarChart },
    new: { title: "Digital Analytics", icon: PieChart },
  },
  {
    old: { title: "No Notifications", icon: BellOff },
    new: { title: "Smart Alerts", icon: BellRing },
  },
  {
    old: { title: "Separate Systems", icon: MonitorOff },
    new: { title: "Unified Platform", icon: LayoutDashboard },
  },
];

export function WhyIntelliAttend() {
  const [isModern, setIsModern] = useState(true);

  return (
    <section className="py-32 relative bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6"
          >
            Why IntelliAttend?
          </motion.h2>
          
          <div className="flex items-center justify-center gap-6 mt-12">
            <span className={cn("text-lg font-medium transition-colors", !isModern ? "text-[#0F172A]" : "text-[#64748B]")}>
              Traditional
            </span>
            <button 
              onClick={() => setIsModern(!isModern)}
              className="w-20 h-10 rounded-full bg-slate-100 border border-slate-200 relative p-1 flex items-center transition-colors"
            >
              <motion.div 
                animate={{ x: isModern ? 40 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={cn("w-8 h-8 rounded-full shadow-md", isModern ? "bg-primary" : "bg-slate-400")}
              />
            </button>
            <span className={cn("text-lg font-medium transition-colors", isModern ? "text-primary" : "text-[#64748B]")}>
              IntelliAttend
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {comparisons.map((item, i) => (
            <div key={i} className="glass-card rounded-[24px] p-8 flex items-center justify-between border border-[#0F172A]/[0.08] relative overflow-hidden">
              <AnimatePresence mode="popLayout">
                {!isModern ? (
                  <motion.div
                    key="old"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-6 w-full text-slate-500"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                      <item.old.icon className="w-8 h-8" />
                    </div>
                    <span className="text-2xl font-medium line-through decoration-slate-300">{item.old.title}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="new"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex items-center gap-6 w-full text-[#0F172A]"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                      <item.new.icon className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-2xl font-bold">{item.new.title}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
