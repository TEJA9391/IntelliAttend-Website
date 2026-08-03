"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";
import { 
  BrainCircuit, 
  Zap, 
  ShieldCheck, 
  CloudSync, 
  CheckCircle2,
  Sparkles,
  Users,
  GraduationCap,
  MonitorPlay,
  BarChart3,
  Database
} from "lucide-react";
import { Navbar } from "@/components/navbar";

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

  return <span ref={nodeRef}>{prefix}{from}{suffix}</span>;
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
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold text-primary bg-primary/10 mb-8 border border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Platform Overview
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-main mb-8 leading-[1.1]">
              Transforming Campus Management<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">with Intelligent Automation.</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-[#64748B]">
              IntelliAttend is an AI-powered campus management platform that simplifies attendance, classroom operations, faculty workflows, and student engagement through one secure, connected ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Four Key Highlights */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BrainCircuit, title: "AI-Powered Automation", desc: "Automate attendance, scheduling, notifications, and classroom workflows with intelligent technology." },
              { icon: Zap, title: "Real-Time Operations", desc: "Synchronize attendance, SmartBoard content, announcements, and analytics instantly across campus." },
              { icon: ShieldCheck, title: "Enterprise Security", desc: "Protect academic data with encrypted communication, secure authentication, and role-based access control." },
              { icon: CloudSync, title: "Cloud Connected", desc: "Access teaching resources, reports, and classroom data securely from anywhere on any authorized device." },
            ].map((highlight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-slate-50 rounded-[28px] p-8 border border-slate-100 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-primary border border-slate-100">
                  <highlight.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-text-main mb-3">{highlight.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{highlight.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 border-y border-slate-200/60 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-slate-100">
            {[
              { label: "Integrated Modules", from: 0, to: 10, suffix: "+" },
              { label: "Attendance Accuracy", from: 0, to: 99, suffix: "%" },
              { label: "Average Attendance Time", from: 5, to: 1, suffix: " Min" },
              { label: "Cloud Availability", from: 0, to: 24, suffix: "/7" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center px-4"
              >
                <div className="text-4xl md:text-5xl font-bold text-text-main mb-2 font-mono tracking-tight">
                  <AnimatedCounter from={stat.from} to={stat.to} suffix={stat.suffix} />
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

          <div className="relative max-w-5xl mx-auto flex flex-col items-center">
            
            {/* Top Node: AI Engine */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-primary/20 border border-primary/50 shadow-[0_0_30px_rgba(37,99,235,0.2)] rounded-2xl p-6 flex flex-col items-center w-64 backdrop-blur-md relative z-10"
            >
              <BrainCircuit className="w-10 h-10 text-white mb-3" />
              <span className="text-xl font-bold text-white">AI Engine</span>
            </motion.div>

            {/* Vertical Line from AI Engine */}
            <div className="w-px h-16 bg-gradient-to-b from-primary to-accent relative">
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
            <div className="flex justify-between w-full max-w-4xl">
              {[
                { icon: Users, title: "Faculty", delay: 0.2 },
                { icon: GraduationCap, title: "Students", delay: 0.3 },
                { icon: MonitorPlay, title: "SmartBoard", delay: 0.4 },
                { icon: BarChart3, title: "Analytics", delay: 0.5 },
              ].map((node, i) => (
                <div key={i} className="flex flex-col items-center relative">
                  {/* Small connector down from horizontal line */}
                  <div className="w-px h-8 bg-accent relative" />
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: node.delay }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center w-40 backdrop-blur-md"
                  >
                    <node.icon className="w-8 h-8 text-slate-300 mb-3" />
                    <span className="text-lg font-semibold text-white">{node.title}</span>
                  </motion.div>

                  {/* Small connector down to bottom horizontal line */}
                  <div className="w-px h-16 bg-accent relative">
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
              className="bg-white/10 border border-white/20 rounded-2xl p-6 flex flex-col items-center w-64 backdrop-blur-md relative z-10"
            >
              <Database className="w-10 h-10 text-white mb-3" />
              <span className="text-xl font-bold text-white">Cloud Database</span>
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
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                {reason}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Callout Card */}
      <section className="py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                One Platform.<br />Every Classroom. Every Faculty. Every Student.
              </h2>
              <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-3xl mx-auto">
                IntelliAttend brings attendance, SmartBoard integration, academic resources, communication, and analytics together in a single intelligent ecosystem.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-white text-primary rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl">
                  Get Started
                </button>
                <button className="px-8 py-4 bg-accent/20 text-white border border-accent/30 rounded-full font-bold text-lg hover:bg-accent/30 transition-colors backdrop-blur-sm">
                  Schedule a Demo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
