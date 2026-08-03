"use client";

import { motion } from "framer-motion";
import { LogIn, MousePointerClick, ScanLine, Presentation } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { icon: LogIn, title: "Login", desc: "Access your dashboard securely via single sign-on." },
  { icon: MousePointerClick, title: "Select Class", desc: "Choose your ongoing or upcoming session from the timetable." },
  { icon: ScanLine, title: "Take Attendance", desc: "Let the AI scan the classroom to instantly record student presence." },
  { icon: Presentation, title: "Push to SmartBoard", desc: "Cast live attendance and course materials directly to the room's display." },
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
            Four simple steps to transform your classroom experience.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#0F172A]/[0.08] -translate-y-1/2 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-[24px] bg-white border border-[#0F172A]/[0.08] flex items-center justify-center shadow-lg shadow-[#0F172A]/[0.03] mb-6 group hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{step.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed max-w-[200px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
