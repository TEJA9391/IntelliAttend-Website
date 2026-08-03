"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";
import { 
  QrCode, 
  Calendar, 
  BookOpen, 
  MonitorPlay, 
  BarChart3, 
  Bell, 
  ClipboardList, 
  CloudSync,
  Briefcase,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Laptop
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

export default function FacultyPage() {
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
              <Briefcase className="w-4 h-4 mr-2" />
              Faculty Portal
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-main mb-8 leading-[1.1]">
              Everything Faculty Needs.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">One Intelligent Platform.</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-[#64748B]">
              Empower faculty with AI-driven tools to manage attendance, classes, SmartBoard content, student engagement, and academic resources—all from a single intuitive application.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 border-y border-slate-200/60 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-slate-100">
            {[
              { label: "Attendance Accuracy", from: 0, to: 99, suffix: "%" },
              { label: "Average Process", from: 5, to: 1, suffix: "-Min" },
              { label: "Secure Cloud Access", from: 0, to: 24, suffix: "/7" },
              { label: "Digital Workflow", from: 0, to: 100, suffix: "%" },
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
              { icon: QrCode, title: "Smart Attendance", desc: "Mark attendance in seconds using QR codes, secure verification, and automated records." },
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
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="bg-slate-50 rounded-[28px] p-8 border border-slate-100 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-primary border border-slate-100">
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
                { title: "Login Securely" },
                { title: "View Today's Schedule" },
                { title: "Start Class Session" },
                { title: "Generate Attendance QR", highlight: true },
                { title: "Students Mark Attendance" },
                { title: "Upload Lecture Materials" },
                { title: "Push Content to SmartBoard", highlight: true },
                { title: "Track Attendance & Analytics" },
              ].map((step, i, arr) => (
                <div key={i} className="flex flex-col items-center w-full relative">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className={`w-full max-w-md p-5 rounded-2xl border backdrop-blur-md flex items-center justify-center relative z-10 ${
                      step.highlight 
                        ? "bg-primary/20 border-primary/50 shadow-[0_0_30px_rgba(37,99,235,0.2)]" 
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
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex gap-6 items-start"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <benefit.icon className="w-6 h-6 text-primary" />
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
                Designed for Modern Educators
              </h2>
              <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-3xl mx-auto">
                Spend less time on administrative tasks and more time delivering exceptional learning experiences with IntelliAttend's intelligent faculty platform.
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
