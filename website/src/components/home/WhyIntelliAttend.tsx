"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  FileX, 
  CheckCircle2, 
  Usb, 
  Presentation, 
  FileSpreadsheet, 
  FolderArchive, 
  MonitorOff, 
  LayoutDashboard 
} from "lucide-react";

const comparisons = [
  {
    old: { title: "Paper Registers & Roll-Calls", icon: FileX },
    new: { title: "1-Tap Digital Attendance", icon: CheckCircle2 },
  },
  {
    old: { title: "USB Drives & Cable Hassle", icon: Usb },
    new: { title: "Connected SmartBoards", icon: Presentation },
  },
  {
    old: { title: "Scattered Paper Files", icon: FileSpreadsheet },
    new: { title: "Real-Time Academic Records", icon: FolderArchive },
  },
  {
    old: { title: "Disconnected Software", icon: MonitorOff },
    new: { title: "All-in-One Campus OS", icon: LayoutDashboard },
  },
];

export function WhyIntelliAttend() {
  const [isModern, setIsModern] = useState(true);

  return (
    <section className="py-16 md:py-20 relative bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-3"
          >
            Why IntelliAttend?
          </motion.h2>
          
          <div className="flex items-center justify-center gap-5 mt-6">
            <span className={cn("text-base md:text-lg font-medium transition-colors", !isModern ? "text-[#0F172A] font-bold" : "text-[#64748B]")}>
              Traditional
            </span>
            <button 
              onClick={() => setIsModern(!isModern)}
              className="w-16 h-8 rounded-full bg-slate-100 border border-slate-200 relative p-1 flex items-center transition-colors cursor-pointer"
            >
              <motion.div 
                animate={{ x: isModern ? 30 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={cn("w-6 h-6 rounded-full shadow-sm", isModern ? "bg-primary" : "bg-slate-400")}
              />
            </button>
            <span className={cn("text-base md:text-lg font-medium transition-colors", isModern ? "text-primary font-bold" : "text-[#64748B]")}>
              IntelliAttend
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {comparisons.map((item, i) => (
            <div key={i} className="apple-card py-4 px-6 sm:px-8 flex items-center justify-between relative shadow-sm hover:shadow-md transition-shadow">
              <AnimatePresence mode="popLayout">
                {!isModern ? (
                  <motion.div
                    key="old"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-4 w-full text-slate-500"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <item.old.icon className="w-5 h-5" />
                    </div>
                    <span className="text-base md:text-lg font-medium line-through decoration-slate-300">{item.old.title}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="new"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.15, delay: i * 0.05 }}
                    className="flex items-center gap-4 w-full text-[#0F172A]"
                  >
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                      <item.new.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-base md:text-lg font-bold">{item.new.title}</span>
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
