"use client";

import { motion } from "framer-motion";
import { CalendarCheck, ClipboardCheck, Presentation, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { 
    icon: CalendarCheck, 
    title: "Plan & Run Sessions", 
    desc: "Schedule conflict-free timetables, launch class sessions, and manage daily lectures effortlessly." 
  },
  { 
    icon: ClipboardCheck, 
    title: "Instant Attendance & Records", 
    desc: "Eliminate paper registers with fast digital roll-calls and maintain automated, tamper-proof academic archives." 
  },
  { 
    icon: Presentation, 
    title: "Connected Campus Displays", 
    desc: "Cast lecture materials, live schedules, and campus announcements directly to room SmartBoards." 
  },
  { 
    icon: CreditCard, 
    title: "Smart Campus Payments", 
    desc: "Simplify fee collections, track student dues, and generate instant digital receipts with complete audit trails." 
  },
];

export function HowItWorks() {
  return (
    <section className="py-32 relative bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6"
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#64748B]"
          >
            Four simple steps to simplify your entire campus at your fingertips.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}

          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.25, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="apple-card w-20 h-20 flex items-center justify-center mb-6 group">
                  <step.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-150" />
                </div>
                
                <h3 className="text-lg md:text-xl font-bold text-[#0F172A] mb-3 min-h-[56px] flex items-center justify-center">
                  {step.title}
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed max-w-[220px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
