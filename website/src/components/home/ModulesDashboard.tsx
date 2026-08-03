"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users, Shield, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const modules = [
  {
    id: "faculty",
    name: "Faculty Module",
    icon: User,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    image: "faculty-dashboard",
    features: [
      "One-click QR generation for attendance",
      "Push assignments and resources instantly",
      "Live class engagement insights",
      "Automated performance analytics",
    ]
  },
  {
    id: "student",
    name: "Student App",
    icon: Users,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    image: "student-app",
    features: [
      "Real-time attendance tracking",
      "Instant push notifications for exams",
      "One-tap leave requests",
      "Access to all study materials offline",
    ]
  },
  {
    id: "admin",
    name: "Admin Dashboard",
    icon: Shield,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    image: "admin-dashboard",
    features: [
      "Campus-wide live attendance views",
      "Department performance comparison",
      "Device security and management",
      "Automated compliance reporting",
    ]
  }
];

export function ModulesDashboard() {
  const [activeModule, setActiveModule] = useState(modules[0]);

  return (
    <section className="py-32 relative border-y border-white/5 bg-[#050816]/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            A unified ecosystem for <span className="text-gradient">everyone</span>
          </h2>
          <p className="text-lg text-slate-400">
            Tailored experiences for faculty, students, and administrators to ensure seamless campus operations.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Tabs */}
          <div className="lg:col-span-5 space-y-4">
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod)}
                className={cn(
                  "w-full text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group",
                  activeModule.id === mod.id 
                    ? "bg-white/5 " + mod.border
                    : "border-transparent hover:bg-white/5"
                )}
              >
                {activeModule.id === mod.id && (
                  <motion.div 
                    layoutId="activeModuleIndicator"
                    className={cn("absolute left-0 top-0 bottom-0 w-1", mod.bg.replace('/10', ''))}
                  />
                )}
                
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn("p-3 rounded-xl", mod.bg)}>
                    <mod.icon className={cn("w-6 h-6", mod.color)} />
                  </div>
                  <h3 className={cn(
                    "text-xl font-bold transition-colors",
                    activeModule.id === mod.id ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  )}>
                    {mod.name}
                  </h3>
                </div>
                
                <AnimatePresence mode="wait">
                  {activeModule.id === mod.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 pt-2 pl-14"
                    >
                      {mod.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                          <CheckCircle2 className={cn("w-4 h-4 mt-0.5 shrink-0", mod.color)} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>

          {/* Interactive UI display */}
          <div className="lg:col-span-7 h-[600px] relative">
            <div className="absolute inset-0 glass-panel rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center bg-[#0a0f24]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule.id}
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full p-8"
                >
                  {/* Abstract representations of the UIs */}
                  {activeModule.id === "faculty" && (
                    <div className="h-full flex flex-col gap-6">
                      <div className="flex gap-4">
                        <div className="w-2/3 h-48 bg-gradient-to-br from-blue-500/20 to-transparent rounded-2xl border border-blue-500/20 p-6 flex flex-col justify-between">
                           <div className="h-8 w-8 rounded bg-blue-500/40" />
                           <div className="h-4 w-1/2 bg-blue-500/20 rounded" />
                        </div>
                        <div className="w-1/3 h-48 bg-white/5 rounded-2xl border border-white/10 p-6 flex items-center justify-center">
                          <div className="w-24 h-24 bg-white/10 rounded-lg p-2 flex flex-wrap gap-1 content-start">
                             {[...Array(16)].map((_, i) => (
                               <div key={i} className="w-4 h-4 bg-white/20 rounded-sm" />
                             ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-6">
                        <div className="h-6 w-32 bg-white/10 rounded mb-6" />
                        <div className="space-y-4">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-white/10" />
                              <div className="h-3 w-48 bg-white/5 rounded" />
                              <div className="h-3 w-16 bg-blue-500/40 rounded ml-auto" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeModule.id === "student" && (
                    <div className="h-full flex items-center justify-center">
                      <div className="w-[300px] h-[550px] bg-slate-900 rounded-[2.5rem] border-[6px] border-slate-800 p-4 flex flex-col gap-4">
                        <div className="h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-2xl border border-cyan-500/20 p-4" />
                        <div className="grid grid-cols-2 gap-4">
                           <div className="h-24 bg-white/5 rounded-xl border border-white/10" />
                           <div className="h-24 bg-white/5 rounded-xl border border-white/10" />
                        </div>
                        <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-4 space-y-4">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="h-12 bg-white/5 rounded-lg border border-white/5" />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeModule.id === "admin" && (
                    <div className="h-full flex flex-col gap-6">
                      <div className="flex gap-4">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="flex-1 h-24 bg-white/5 rounded-2xl border border-white/10 flex flex-col justify-center p-4">
                            <div className="h-3 w-1/2 bg-white/10 rounded mb-2" />
                            <div className="h-6 w-3/4 bg-purple-500/40 rounded" />
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 flex gap-6">
                         <div className="w-2/3 bg-white/5 rounded-2xl border border-white/10 p-6 flex flex-col justify-end gap-2">
                            <div className="w-full flex items-end justify-between h-48 gap-2">
                               {[30, 40, 20, 60, 80, 50, 90, 100, 70, 85].map((h, i) => (
                                  <div key={i} style={{height: h + "%"}} className="w-full bg-purple-500/30 rounded-t-sm hover:bg-purple-500/60 transition-colors" />
                               ))}
                            </div>
                         </div>
                         <div className="w-1/3 bg-gradient-to-b from-purple-500/10 to-transparent rounded-2xl border border-purple-500/20 p-6">
                            <div className="h-32 w-32 rounded-full border-8 border-white/5 border-t-purple-500 mx-auto mt-4" />
                            <div className="space-y-3 mt-12">
                              {[1,2,3].map(i => (
                                <div key={i} className="h-4 w-full bg-white/5 rounded" />
                              ))}
                            </div>
                         </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
