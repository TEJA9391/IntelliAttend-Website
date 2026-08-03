"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation, useMotionValue, useTransform, animate } from "framer-motion";
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
  CheckCircle2
} from "lucide-react";
import { Navbar } from "@/components/navbar";

// Counter Component
function AnimatedCounter({ from, to, duration = 2, suffix = "" }: { from: number, to: number, duration?: number, suffix?: string }) {
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
              nodeRef.current.textContent = value.toFixed(1) + suffix;
            } else {
              nodeRef.current.textContent = Math.round(value) + suffix;
            }
          }
        }
      });
      return () => controls.stop();
    }
  }, [from, to, duration, suffix, isInView]);

  return <span ref={nodeRef}>{from}{suffix}</span>;
}

export default function SmartBoardPage() {
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
              <MonitorPlay className="w-4 h-4 mr-2" />
              SmartBoard Integration
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#0F172A] mb-8 leading-[1.1]">
              Teach Smarter.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Present Instantly.</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-[#64748B]">
              Push classroom content, attendance, announcements, and live updates directly from your faculty app to the classroom SmartBoard—without USB drives, emails, or manual setup.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Professional Statistics */}
      <section className="py-12 border-y border-slate-200/60 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-slate-100">
            {[
              { label: "Connected SmartBoards", from: 0, to: 100, suffix: "+" },
              { label: "Average Content Push", from: 5, to: 1, suffix: " Sec" },
              { label: "Delivery Success", from: 0, to: 99.9, suffix: "%" },
              { label: "Secure Encryption", from: 0, to: 256, suffix: "-bit" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center px-4"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-2 font-mono tracking-tight">
                  <AnimatedCounter from={stat.from} to={stat.to} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-32 relative overflow-hidden bg-[#0F172A]">
        {/* Abstract background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Instant Deployment Workflow</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">From your device to the classroom screen in milliseconds.</p>
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
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className={`w-full max-w-md p-6 rounded-2xl border backdrop-blur-md flex items-center gap-6 relative z-10 ${
                      step.highlight 
                        ? "bg-primary/20 border-accent/50 shadow-[0_0_30px_rgba(37,99,235,0.3)]" 
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${step.highlight ? "bg-accent text-white" : "bg-white/10 text-white"}`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className={`text-lg font-semibold ${step.highlight ? "text-white" : "text-slate-200"}`}>
                      {step.title}
                    </span>
                  </motion.div>
                  
                  {i < arr.length - 1 && (
                    <div className="h-16 w-px relative my-2">
                      <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-accent/10" />
                      <motion.div 
                        initial={{ top: 0, opacity: 0 }}
                        animate={{ top: "100%", opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                        className="absolute left-1/2 -translate-x-1/2 w-1.5 h-6 bg-accent rounded-full blur-[2px]" 
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
              { icon: UserCheck, title: "Attendance Display", desc: "Show live attendance statistics, QR attendance status, student participation, and session progress in real time." },
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
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="bg-slate-50 rounded-[28px] p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-primary border border-slate-100">
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
              className="bg-[#0F172A] rounded-[32px] p-10 border border-slate-800 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[50px] rounded-full" />
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-white">With IntelliAttend</h3>
              </div>
              <ul className="space-y-5 relative z-10">
                {["One-tap publishing", "Instant classroom synchronization", "Centralized resource management", "Automatic cloud backup", "Real-time announcements"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
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
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Your classroom is always ready before you arrive.
              </h2>
              <p className="text-xl text-white/80 leading-relaxed mb-10">
                Start attendance, share lecture materials, display announcements, and manage every session from a single intelligent platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-white text-primary rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl">
                  Book a Demo
                </button>
                <button className="px-8 py-4 bg-accent/20 text-white border border-accent/30 rounded-full font-bold text-lg hover:bg-accent/30 transition-colors backdrop-blur-sm">
                  View Pricing
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Taglines Footer */}
      <section className="py-20 bg-slate-900 border-t border-slate-800 text-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-slate-400 text-sm font-medium">
          <span>From Faculty to SmartBoard in Seconds.</span>
          <span className="hidden md:inline">•</span>
          <span>The Intelligent Classroom Starts Here.</span>
          <span className="hidden md:inline">•</span>
          <span>One Platform. Every Classroom.</span>
          <span className="hidden md:inline">•</span>
          <span>Connected Teaching. Smarter Learning.</span>
        </div>
      </section>
    </div>
  );
}
