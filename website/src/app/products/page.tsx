"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";
import { 
  BrainCircuit, 
  Zap, 
  ShieldCheck, 
  CloudSync, 
  CheckCircle2,
  Layers,
  Users,
  GraduationCap,
  MonitorPlay,
  BarChart3,
  Database,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ProductsShowcase } from "@/components/products/ProductsShowcase";

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

export default function ProductsOverview() {
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
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-main mb-8 leading-[1.1]">
              Transforming Campus Management<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">with Intelligent Automation.</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-[#64748B]">
              IntelliAttend is the connected campus operating platform built for modern higher education—unifying lecture scheduling, 1-tap attendance, SmartBoard displays, fee payments, and academic records in real time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Four Key Highlights */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BrainCircuit, title: "Smart Campus Automation", desc: "Streamline paperless attendance, fee collections, class schedules, and departmental paperwork with fingertip simplicity." },
              { icon: Zap, title: "Real-Time Operations", desc: "Synchronize attendance, SmartBoard content, announcements, and analytics instantly across campus." },
              { icon: ShieldCheck, title: "Enterprise Security", desc: "Protect academic data with encrypted communication, secure authentication, and role-based access control." },
              { icon: CloudSync, title: "Cloud Connected", desc: "Access teaching resources, reports, and classroom data securely from anywhere on any authorized device." },
            ].map((highlight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.2 }}
                className="bg-slate-50 rounded-[28px] p-8 border border-slate-100 hover:shadow-xl hover:shadow-primary/10 transition-all duration-150 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-slate-500 border border-slate-100">
                  <highlight.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-text-main mb-3">{highlight.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{highlight.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Showcase generated from User Prompt */}
      <ProductsShowcase />

      {/* Statistics Section */}
      <section className="py-12 border-y border-slate-200/60 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-slate-100">
            {[
              { label: "Unified Portals", from: 1, to: 4, suffix: "" },
              { label: "Eligibility Tracking", from: 0, to: 75, suffix: "%" },
              { label: "Session Roll-Call", prefix: "< ", from: 120, to: 60, suffix: "s" },
              { label: "Cloud-Synchronized", from: 0, to: 100, suffix: "%" },
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

      {/* Platform Ecosystem Diagram */}
      <section className="py-32 relative overflow-hidden bg-text-main">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Platform Ecosystem</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">One centralized architecture powering your entire institution.</p>
          </div>

          <div className="relative max-w-5xl mx-auto flex flex-col items-center px-2">
            
            {/* Top Node: AI Engine */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-primary/20 border border-primary/50 shadow-[0_0_30px_rgba(45,212,191,0.2)] rounded-2xl p-4 md:p-6 flex flex-col items-center w-48 md:w-64 backdrop-blur-md relative z-10"
            >
              <BrainCircuit className="w-8 h-8 md:w-10 md:h-10 text-white mb-2 md:mb-3" />
              <span className="text-lg md:text-xl font-bold text-white">AI Engine</span>
            </motion.div>

            {/* Vertical Line from AI Engine */}
            <div className="w-px h-12 md:h-16 bg-gradient-to-b from-primary to-accent relative">
              <motion.div 
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-1/2 -translate-x-1/2 w-1.5 h-4 bg-white rounded-full blur-[2px]" 
              />
            </div>

            {/* Horizontal Distribution Line */}
            <div className="h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-accent to-transparent relative">
              <motion.div 
                animate={{ left: ["20%", "80%", "20%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 -translate-y-1/2 w-8 h-1.5 bg-white rounded-full blur-[2px]" 
              />
            </div>

            {/* Middle Row Nodes with short vertical connectors */}
            <div className="flex justify-between gap-1 md:gap-4 w-full max-w-4xl">
              {[
                { icon: Users, title: "Faculty", delay: 0.1 },
                { icon: GraduationCap, title: "Students", delay: 0.1 },
                { icon: MonitorPlay, title: "SmartBoard", delay: 0.15 },
                { icon: BarChart3, title: "Analytics", delay: 0.5 },
              ].map((node, i) => (
                <div key={i} className="flex flex-col items-center relative flex-1 max-w-[160px]">
                  {/* Small connector down from horizontal line */}
                  <div className="w-px h-6 md:h-8 bg-accent relative" />
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: node.delay }}
                    className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-2 md:p-6 flex flex-col items-center w-full backdrop-blur-md"
                  >
                    <node.icon className="w-5 h-5 md:w-8 md:h-8 text-slate-300 mb-1 md:mb-3" />
                    <span className="text-[10px] sm:text-xs md:text-lg font-semibold text-white text-center leading-tight break-words hyphens-auto w-full">{node.title}</span>
                  </motion.div>

                  {/* Small connector down to bottom horizontal line */}
                  <div className="w-px h-12 md:h-16 bg-accent relative">
                     <motion.div 
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 w-1 h-3 bg-white/50 rounded-full blur-[1px]" 
                      />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Horizontal Line */}
            <div className="h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-accent to-transparent relative" />

            {/* Final Vertical Line */}
            <div className="w-px h-8 bg-accent relative" />

            {/* Bottom Node: Cloud Database */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 border border-white/20 rounded-2xl p-4 md:p-6 flex flex-col items-center w-48 md:w-64 backdrop-blur-md relative z-10"
            >
              <Database className="w-8 h-8 md:w-10 md:h-10 text-white mb-2 md:mb-3" />
              <span className="text-lg md:text-xl font-bold text-white text-center">Cloud Database</span>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Why Institutions Choose Us */}
      <section className="py-32 bg-slate-50 border-t border-slate-200/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main mb-6">
              Why Institutions Choose IntelliAttend
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-6 max-w-4xl">
            {[
              "Reduce manual administrative work",
              "Improve attendance accuracy",
              "Deliver real-time classroom communication",
              "Centralize academic resources",
              "Enhance faculty productivity",
              "Provide students with a connected learning experience",
            ].map((reason, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 text-lg text-text-main font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-slate-500" />
                </div>
                {reason}
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
                One Platform.<br />Every Classroom. Every Faculty. Every Student.
              </h2>
              <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-3xl mx-auto">
                IntelliAttend brings attendance, SmartBoard integration, academic resources, communication, and analytics together in a single intelligent ecosystem.
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
    </div>
  );
}
