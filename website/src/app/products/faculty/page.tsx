"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate, AnimatePresence } from "framer-motion";
import { 
  ClipboardCheck, 
  Calendar, 
  BookOpen, 
  MonitorPlay, 
  BarChart3, 
  Bell, 
  ClipboardList, 
  CloudSync,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Laptop,
  ChevronRight,
  Maximize2,
  X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";

// Counter Component
function AnimatedCounter({ from, to, duration = 2, suffix = "", prefix = "" }: { from: number, to: number, duration?: number, suffix?: string, prefix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView && nodeRef.current) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = prefix + Math.round(value) + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [from, to, duration, suffix, prefix, isInView]);

  return <span ref={nodeRef}>{prefix}{to}{suffix}</span>;
}

export default function FacultyPage() {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[min(7.5vw,2.25rem)] sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-text-main mb-8 leading-[1.1] flex flex-col items-center justify-center overflow-visible">
              <motion.span layout transition={{ layout: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }} className="flex flex-wrap items-baseline justify-center text-center">
                <motion.span layout transition={{ layout: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }}>Everything</motion.span>
                <span className="inline-grid text-center mx-3 sm:mx-4" style={{ perspective: "1000px" }}>
                  Educators
                </span>
                Need.
              </motion.span>
              <motion.span layout transition={{ layout: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }} className="mt-2 sm:mt-4 text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">One Intelligent Platform.</span>
              </motion.span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-[#64748B]">
              Streamline daily lecture roll-calls, share syllabus resources with students, and track 75% exam eligibility effortlessly in real time.
            </p>

            {/* Faculty Hero Display */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="mt-14 max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-slate-200/80 bg-white p-2 sm:p-4 group cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => setIsZoomed(true)}
            >
              <div className="relative aspect-[1024/541] w-full rounded-2xl overflow-hidden bg-slate-900/[0.02]">
                <Image
                  src="/images/products/faculty_real_mockup.png"
                  alt="IntelliAttend Faculty Portal on Laptop and Mobile"
                  fill
                  unoptimized
                  priority
                  className="object-contain rounded-2xl"
                />
                <div className="absolute bottom-3 right-3 z-10 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-md">
                  <Maximize2 className="w-3.5 h-3.5" /> Click to Expand
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 border-y border-slate-200/60 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-slate-100">
            {[
              { label: "Attendance Precision", from: 0, to: 99, suffix: "%" },
              { label: "Session Roll-Call", prefix: "< ", from: 5, to: 1, suffix: " Min" },
              { label: "Secure Cloud Access", from: 0, to: 24, suffix: "/7" },
              { label: "Digital Workflow", from: 0, to: 100, suffix: "%" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.2 }}
                className="text-center px-4"
              >
                <div className="text-4xl md:text-5xl font-bold text-text-main mb-2 font-mono tracking-tight">
                  <AnimatedCounter from={stat.from} to={stat.to} suffix={stat.suffix} prefix={stat.prefix} />
                </div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main mb-6">
              Purpose-Built Capabilities
            </h2>
            <p className="text-lg text-[#64748B]">
              A complete suite of tools designed to remove friction from daily academic operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ClipboardCheck, title: "Smart Attendance", desc: "Mark attendance in seconds using secure digital verification and automated records." },
              { icon: Calendar, title: "Class Schedule", desc: "View daily teaching schedules, classroom assignments, upcoming sessions, and academic calendars in one place." },
              { icon: BookOpen, title: "Course Resources", desc: "Upload, organize, preview, and distribute lecture notes, presentations, assignments, and reference materials effortlessly." },
              { icon: MonitorPlay, title: "SmartBoard Control", desc: "Push classroom content directly to assigned SmartBoards with a single tap for a seamless teaching experience." },
              { icon: BarChart3, title: "Faculty Analytics", desc: "Track attendance trends, completed lectures, class performance, and teaching activity through real-time dashboards." },
              { icon: Bell, title: "Smart Notifications", desc: "Receive instant alerts for schedule updates, announcements, pending tasks, attendance reminders, and important communications." },
              { icon: ClipboardList, title: "Assignment Management", desc: "Create, share, and monitor assignments while keeping students informed about deadlines and submissions." },
              { icon: CloudSync, title: "Secure Cloud Sync", desc: "Access teaching resources and classroom data securely from anywhere with automatic cloud synchronization." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className="apple-card p-8 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-slate-500 border border-slate-100">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-text-main mb-3">{feature.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Workflow Section */}
      <section className="py-32 relative overflow-hidden bg-text-main">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">The Intelligent Workflow</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">A seamless daily experience from start to finish.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              {[
                { title: "Review Assigned Schedule" },
                { title: "Instant Attendance Roll-Call", highlight: true },
                { title: "Wirelessly Cast to SmartBoard", highlight: true },
                { title: "Automate Academic Records" },
              ].map((step, i, arr) => (
                <div key={i} className="flex flex-col items-center w-full relative">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1, duration: 0.2 }}
                    className={`w-full max-w-md p-5 rounded-2xl border backdrop-blur-md flex items-center justify-center relative z-10 ${
                      step.highlight 
                        ? "bg-primary/20 border-primary/50 shadow-[0_0_30px_rgba(45,212,191,0.2)]" 
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <span className={`text-lg font-semibold ${step.highlight ? "text-white" : "text-slate-300"}`}>
                      {step.title}
                    </span>
                  </motion.div>
                  
                  {i < arr.length - 1 && (
                    <div className="h-10 w-px relative my-1">
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/10" />
                      <motion.div 
                        initial={{ top: 0, opacity: 0 }}
                        animate={{ top: "100%", opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 w-1.5 h-4 bg-accent rounded-full blur-[2px]" 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-slate-50 border-t border-slate-200/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main mb-6">
              Faculty Benefits
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "Save Valuable Time", desc: "Reduce administrative work with automated attendance, scheduling, and resource management." },
              { icon: MonitorPlay, title: "Teach Without Interruptions", desc: "Access all teaching tools from one application without switching between multiple systems." },
              { icon: ClipboardList, title: "Stay Organized", desc: "Keep lecture materials, attendance records, schedules, and classroom activities centrally managed." },
              { icon: TrendingUp, title: "Make Better Decisions", desc: "Use real-time analytics and reports to monitor classroom participation and academic progress." },
              { icon: MessageSquare, title: "Improve Communication", desc: "Share announcements, resources, and updates instantly with students and departments." },
              { icon: Laptop, title: "Work Anywhere", desc: "Access your teaching environment securely from any authorized device." },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.2 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex gap-6 items-start"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <benefit.icon className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2">{benefit.title}</h3>
                  <p className="text-[#64748B] leading-relaxed">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Callout Card */}
      <section className="bg-primary relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-24">
        {/* Top Wave */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] z-0">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[120px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
          </svg>
        </div>

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Designed for Modern Educators
              </h2>
              <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-3xl mx-auto">
                Spend less time on administrative tasks and more time delivering exceptional learning experiences with IntelliAttend's intelligent faculty platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/get-started">
                  <button className="px-8 py-4 bg-white text-slate-500 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-150 shadow-xl cursor-pointer">
                    Get Started
                  </button>
                </Link>
                <Link href="/#contact">
                  <button className="px-8 py-4 bg-accent/20 text-white border border-accent/30 rounded-full font-bold text-lg hover:bg-accent/30 hover:scale-105 active:scale-95 transition-all duration-150 backdrop-blur-sm cursor-pointer">
                    Schedule a Demo
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal for High-Resolution View */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 cursor-zoom-out"
          >
            <div 
              className="relative max-w-6xl w-auto bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-slate-900/90">
                <span className="text-white font-semibold text-sm">Faculty Portal • Live System Preview</span>
                <button
                  onClick={() => setIsZoomed(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-2 sm:p-4 flex items-center justify-center bg-slate-950 overflow-hidden">
                <img
                  src="/images/products/faculty_real_mockup.png"
                  alt="Faculty Portal Live Preview"
                  className="max-h-[78vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
