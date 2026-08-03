"use client";

import { motion } from "framer-motion";
import { Play, QrCode, Smartphone, CheckCircle, Brain, FileBarChart } from "lucide-react";

const steps = [
  { icon: Play, title: "Faculty Starts Session", desc: "Select subject and initiate class from the portal." },
  { icon: QrCode, title: "Dynamic QR Generated", desc: "A time-sensitive, rotating QR code is displayed on the smartboard." },
  { icon: Smartphone, title: "Students Scan", desc: "Students scan using the IntelliAttend mobile app." },
  { icon: CheckCircle, title: "Attendance Verified", desc: "Location and device IDs are cross-verified instantly." },
  { icon: Brain, title: "AI Analysis", desc: "System updates risk models and behavior patterns." },
  { icon: FileBarChart, title: "Reports Generated", desc: "Real-time sync with admin dashboards and parent alerts." },
];

export function TimelineEcosystem() {
  return (
    <section className="py-32 relative bg-[#050816]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            How <span className="text-gradient">IntelliAttend</span> Works
          </h2>
          <p className="text-lg text-slate-400">
            A frictionless, six-step ecosystem that takes attendance from a chore to an automated, intelligent process.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-purple-500 opacity-20 hidden md:block" />
          
          <div className="space-y-12 relative z-10">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={"flex flex-col md:flex-row gap-8 items-center " + (i % 2 === 0 ? "md:flex-row-reverse" : "")}
              >
                <div className="flex-1 w-full md:text-right">
                  {i % 2 !== 0 && (
                    <div className="hidden md:block">
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-slate-400">{step.desc}</p>
                    </div>
                  )}
                  {i % 2 === 0 && (
                     <div className="md:hidden text-center mt-4">
                       <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                       <p className="text-slate-400">{step.desc}</p>
                     </div>
                  )}
                </div>
                
                <div className="shrink-0 relative">
                  <div className="w-16 h-16 rounded-2xl bg-[#0a0f24] border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.2)] z-10 relative">
                     <step.icon className="w-6 h-6 text-white" />
                  </div>
                  {/* Glowing effect behind icon */}
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150" />
                </div>
                
                <div className="flex-1 w-full">
                  {i % 2 === 0 && (
                    <div className="hidden md:block">
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-slate-400">{step.desc}</p>
                    </div>
                  )}
                  {i % 2 !== 0 && (
                     <div className="md:hidden text-center mt-4">
                       <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                       <p className="text-slate-400">{step.desc}</p>
                     </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
