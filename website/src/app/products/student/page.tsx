"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";
import { 
  Smartphone,
  BookOpen,
  CalendarRange,
  BellRing,
  TrendingUp,
  ClipboardCheck,
  MonitorPlay,
  CloudSync,
  GraduationCap,
  Clock,
  LayoutList,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Lock
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

export default function StudentPage() {
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
              <GraduationCap className="w-4 h-4 mr-2" />
              Student Portal
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-main mb-8 leading-[1.1]">
              A Smarter Learning Experience<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">for Every Student.</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-[#64748B]">
              Stay connected with your classes through instant attendance, digital learning resources, real-time notifications, and an organized academic dashboard—all from a single mobile application.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 border-y border-slate-200/60 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-slate-100">
            {[
              { label: "Learning Resources", icon: null, from: 0, to: 24, suffix: "/7" },
              { label: "Digital Attendance", icon: null, from: 0, to: 100, suffix: "%" },
              { label: "Real-Time Notifications", icon: Zap, text: "Instant" },
              { label: "Cloud Data Sync", icon: Lock, text: "Secure" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center px-4"
              >
                <div className="flex items-center justify-center text-4xl md:text-5xl font-bold text-text-main mb-2 font-mono tracking-tight h-[48px]">
                  {stat.text ? (
                    <div className="flex items-center gap-2">
                      {stat.icon && <stat.icon className="w-8 h-8 text-primary" />}
                      <span className="text-3xl md:text-4xl">{stat.text}</span>
                    </div>
                  ) : (
                    <AnimatedCounter from={stat.from!} to={stat.to!} suffix={stat.suffix} />
                  )}
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
              Student Features
            </h2>
            <p className="text-lg text-[#64748B]">
              Everything you need to stay organized, connected, and focused on your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Smartphone, title: "Digital Attendance", desc: "Mark attendance securely using QR-based verification with instant confirmation and real-time attendance tracking." },
              { icon: BookOpen, title: "Learning Resources", desc: "Access lecture notes, presentations, assignments, recorded sessions, and study materials shared by faculty anytime." },
              { icon: CalendarRange, title: "Personalized Timetable", desc: "View your daily class schedule, upcoming lectures, exam dates, and academic events in one organized calendar." },
              { icon: BellRing, title: "Smart Notifications", desc: "Receive instant alerts for class updates, assignment deadlines, attendance reminders, exam schedules, and campus announcements." },
              { icon: TrendingUp, title: "Academic Progress", desc: "Track attendance percentage, completed courses, assignment status, and learning progress through interactive dashboards." },
              { icon: ClipboardCheck, title: "Assignments & Submissions", desc: "View assignments, submit coursework before deadlines, and receive updates on submission status." },
              { icon: MonitorPlay, title: "SmartBoard Access", desc: "Instantly access classroom presentations and materials shared on SmartBoards directly from your device." },
              { icon: CloudSync, title: "Cloud Learning", desc: "All academic resources are securely synchronized, allowing students to continue learning from anywhere, on any device." },
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

      {/* Student Workflow Section */}
      <section className="py-32 relative overflow-hidden bg-text-main">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Student Workflow</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Your entire academic day, perfectly synchronized.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              {[
                { title: "Login Securely" },
                { title: "View Today's Classes" },
                { title: "Scan Attendance QR", highlight: true },
                { title: "Access Lecture Resources" },
                { title: "Receive Live Notifications" },
                { title: "Complete Assignments", highlight: true },
                { title: "Track Academic Progress" },
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
              Student Benefits
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "Never Miss a Class", desc: "Stay updated with live schedules, attendance reminders, and classroom notifications." },
              { icon: Smartphone, title: "Learn Anywhere", desc: "Access lecture materials and course content from any device at any time." },
              { icon: LayoutList, title: "Stay Organized", desc: "Manage assignments, exams, schedules, and academic activities from one platform." },
              { icon: TrendingUp, title: "Monitor Your Progress", desc: "Track attendance, completed coursework, and academic performance with real-time insights." },
              { icon: MessageSquare, title: "Instant Communication", desc: "Receive important updates from faculty and the institution without delays." },
              { icon: ShieldCheck, title: "Secure & Reliable", desc: "Your academic records and learning resources are protected with enterprise-grade security and cloud synchronization." },
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
                Everything Students Need to Succeed
              </h2>
              <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-3xl mx-auto">
                From attendance and assignments to learning resources and academic insights, IntelliAttend empowers students with a connected, organized, and modern educational experience.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-white text-primary rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl">
                  Explore Student Features
                </button>
                <button className="px-8 py-4 bg-accent/20 text-white border border-accent/30 rounded-full font-bold text-lg hover:bg-accent/30 transition-colors backdrop-blur-sm">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
