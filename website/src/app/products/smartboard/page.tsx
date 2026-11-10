"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, 
  BookOpen, 
  CalendarClock, 
  UserCheck, 
  BellRing, 
  LayoutDashboard, 
  ShieldCheck, 
  CloudSync,
  ArrowRight,
  ArrowDown,
  MonitorPlay,
  XCircle,
  CheckCircle2,
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
            // Check if it's a decimal number like 99.9
            if (to % 1 !== 0) {
              nodeRef.current.textContent = prefix + value.toFixed(1) + suffix;
            } else {
              nodeRef.current.textContent = prefix + Math.round(value) + suffix;
            }
          }
        }
      });
      return () => controls.stop();
    }
  }, [from, to, duration, suffix, prefix, isInView]);

  return <span ref={nodeRef}>{prefix}{to}{suffix}</span>;
}

export default function SmartBoardPage() {
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#0F172A] mb-8 leading-[1.1]">
              Teach Smarter.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Present Instantly.</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-[#64748B]">
              Push classroom content, attendance, announcements, and live updates directly from your faculty app to the classroom SmartBoard—without USB drives, emails, or manual setup.
            </p>

            {/* SmartBoard Hero Display */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="mt-14 max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-slate-200/80 bg-white p-2 sm:p-3 group cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => setIsZoomed(true)}
            >
              <div className="relative aspect-[1024/686] w-full rounded-2xl overflow-hidden bg-slate-900/5">
                <Image
                  src="/images/products/smartboard_real_display.jpg"
                  alt="IntelliAttend SmartBoard Display"
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

      {/* Professional Statistics */}
      <section className="py-12 border-y border-slate-200/60 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-slate-100">
            {[
              { label: "Extra Dongles Needed", from: 5, to: 0, suffix: "" },
              { label: "Content Push Speed", prefix: "< ", from: 5, to: 2, suffix: "s" },
              { label: "Faculty Screen Cast", from: 0, to: 1, suffix: "-Tap" },
              { label: "Cloud Synchronized", from: 0, to: 100, suffix: "%" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.2 }}
                className="text-center px-4"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-2 font-mono tracking-tight">
                  <AnimatedCounter from={stat.from} to={stat.to} suffix={stat.suffix} prefix={stat.prefix} />
                </div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-32 relative overflow-hidden bg-[#F8FAFC]">
        {/* Abstract background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] mb-4">Instant Deployment Workflow</h2>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto">From your device to the classroom screen in milliseconds.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              {[
                { title: "Faculty Uploads Resource", icon: UploadCloud },
                { title: "IntelliAttend Cloud", icon: CloudSync },
                { title: "Secure Authentication", icon: ShieldCheck },
                { title: "Assigned SmartBoard", icon: MonitorPlay },
                { title: "Students View Content Instantly", icon: UserCheck, highlight: true },
              ].map((step, i, arr) => (
                <div key={i} className="flex flex-col items-center w-full relative">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.15, duration: 0.2 }}
                    className={`w-full max-w-md p-6 rounded-2xl border flex items-center gap-6 relative z-10 ${
                      step.highlight 
                        ? "bg-primary/10 border-primary/30 shadow-[0_0_30px_rgba(45,212,191,0.2)]" 
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${step.highlight ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className={`text-lg font-semibold ${step.highlight ? "text-[#0F172A]" : "text-[#0F172A]"}`}>
                      {step.title}
                    </span>
                  </motion.div>
                  
                  {i < arr.length - 1 && (
                    <div className="h-16 w-px relative my-2">
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/10" />
                      <motion.div 
                        initial={{ top: 0, opacity: 0 }}
                        animate={{ top: "100%", opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                        className="absolute left-1/2 -translate-x-1/2 w-1.5 h-6 bg-primary rounded-full blur-[2px]" 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] mb-6">
              Powerful Capabilities
            </h2>
            <p className="text-lg text-[#64748B]">
              Every tool you need to transform any classroom into a fully connected, intelligent learning environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: UploadCloud, title: "One-Tap Content Push", desc: "Upload PDFs, PowerPoint presentations, Word documents, images, videos, and lecture notes directly to the SmartBoard with a single tap." },
              { icon: BookOpen, title: "Instant Lecture Materials", desc: "Display today's lecture resources automatically when a class begins, ensuring students always have the correct content." },
              { icon: CalendarClock, title: "Live Schedule Sync", desc: "The SmartBoard automatically updates to show the current class, instructor, subject, room information, and upcoming sessions." },
              { icon: UserCheck, title: "Attendance Display", desc: "Show live attendance statistics, student participation, and session progress in real time." },
              { icon: BellRing, title: "Smart Announcements", desc: "Broadcast important notices, exam schedules, assignment deadlines, emergency alerts, and departmental announcements instantly." },
              { icon: LayoutDashboard, title: "Interactive Dashboard", desc: "Monitor attendance trends, session duration, resource usage, and classroom engagement through a clean, real-time dashboard." },
              { icon: ShieldCheck, title: "Secure Access Control", desc: "Only authenticated faculty members can publish content to assigned SmartBoards using encrypted communication and role-based permissions." },
              { icon: CloudSync, title: "Cloud Synchronization", desc: "Every uploaded resource is securely synchronized across authorized classroom SmartBoards, allowing seamless access from any connected campus location." },
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
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{feature.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Before */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[50px] rounded-full" />
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Before IntelliAttend</h3>
              </div>
              <ul className="space-y-5">
                {["Manual USB transfers", "Delayed classroom setup", "Multiple software tools", "Lost lecture files", "Paper announcements"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* After */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full" />
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A]">With IntelliAttend</h3>
              </div>
              <ul className="space-y-5 relative z-10">
                {["One-tap publishing", "Instant classroom synchronization", "Centralized resource management", "Automatic cloud backup", "Real-time announcements"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-[#64748B]">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
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
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Your classroom is always ready before you arrive.
              </h2>
              <p className="text-xl text-white/80 leading-relaxed mb-10">
                Empower professors to present lecture notes, display live attendance rosters, and coordinate classroom interactions from one seamless digital interface.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/#contact">
                  <button className="px-8 py-4 bg-white text-slate-500 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-150 shadow-xl cursor-pointer">
                    Book a Demo
                  </button>
                </Link>
                <Link href="/join">
                  <button className="px-8 py-4 bg-accent/20 text-white border border-accent/30 rounded-full font-bold text-lg hover:bg-accent/30 hover:scale-105 active:scale-95 transition-all duration-150 backdrop-blur-sm cursor-pointer">
                    View Pricing
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
                <span className="text-white font-semibold text-sm">SmartBoard Interactive Display • Live System Preview</span>
                <button
                  onClick={() => setIsZoomed(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-2 sm:p-4 flex items-center justify-center bg-slate-950 overflow-hidden">
                <img
                  src="/images/products/smartboard_real_display.jpg"
                  alt="SmartBoard Interactive Display"
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
