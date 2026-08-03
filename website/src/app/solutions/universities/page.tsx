"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";
import { 
  Building2,
  Stethoscope,
  BookMarked,
  Briefcase,
  Users,
  GraduationCap,
  ArrowDown,
  Sparkles,
  MonitorPlay,
  BarChart3,
  Database,
  Cloud,
  CheckCircle2,
  ShieldCheck,
  Server,
  Key,
  Lock,
  FileX,
  MailQuestion,
  MonitorX,
  FileWarning,
  Zap,
  ArrowRight,
  BrainCircuit
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
            nodeRef.current.textContent = prefix + Math.round(value).toLocaleString() + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [from, to, duration, suffix, prefix, isInView]);

  return <span ref={nodeRef}>{prefix}{from}{suffix}</span>;
}

export default function UniversitiesSolution() {
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
              <Building2 className="w-4 h-4 mr-2" />
              University Solutions
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-main mb-8 leading-[1.1]">
              Built for Modern<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Universities.</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-[#64748B]">
              From a single department to an entire campus, IntelliAttend connects classrooms, faculty, students, and administration into one intelligent ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* University at a Glance (Interactive Map) */}
      <section className="py-24 bg-text-main relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">University at a Glance</h2>
          </div>
          
          <div className="flex flex-col items-center max-w-4xl mx-auto">
            {/* Top Node */}
            <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(37,99,235,0.4)" }} className="bg-white/10 border border-white/20 p-4 rounded-xl text-white font-bold text-xl backdrop-blur-sm transition-all cursor-default">
              UNIVERSITY
            </motion.div>
            
            <div className="w-px h-8 bg-accent relative" />
            
            <div className="flex justify-center gap-16 md:gap-32 w-full">
              <div className="flex flex-col items-center">
                <div className="w-px h-8 bg-accent relative" />
                <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(37,99,235,0.4)" }} className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-white flex items-center gap-2 transition-all cursor-default">
                  <Building2 className="w-5 h-5 text-accent" /> Engineering
                </motion.div>
                <div className="w-px h-8 bg-accent relative" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-px h-8 bg-accent relative" />
                <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(37,99,235,0.4)" }} className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-white flex items-center gap-2 transition-all cursor-default">
                  <Stethoscope className="w-5 h-5 text-accent" /> Medical
                </motion.div>
                <div className="w-px h-8 bg-accent relative" />
              </div>
            </div>

            <div className="w-[60%] md:w-[40%] h-px bg-accent relative -mt-8" />
            <div className="w-px h-8 bg-accent relative" />

            {/* Core Node */}
            <motion.div 
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(37,99,235,0.6)" }} 
              className="bg-primary border border-primary-light p-6 rounded-2xl text-white font-bold text-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] cursor-default transition-all z-10"
            >
              IntelliAttend
            </motion.div>

            <div className="w-px h-8 bg-accent relative" />
            <div className="w-[80%] h-px bg-accent relative" />
            
            <div className="flex justify-between w-[80%] mt-8">
              {[
                { icon: BookMarked, label: "Library" },
                { icon: Briefcase, label: "Admin" },
                { icon: GraduationCap, label: "Students" },
                { icon: Users, label: "Faculty" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center -mt-8">
                  <div className="w-px h-8 bg-accent relative" />
                  <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(37,99,235,0.4)" }} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white flex flex-col items-center gap-2 transition-all cursor-default">
                    <item.icon className="w-6 h-6 text-accent" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Campus Challenges */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main">Campus Challenges Solved</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: "Morning Rush", 
                problem: "Hundreds of faculty begin classes simultaneously.", 
                solution: "IntelliAttend automatically synchronizes schedules and attendance."
              },
              { 
                title: "Multiple Departments", 
                problem: "Engineering, MBA, Pharmacy and Science all operate differently.", 
                solution: "Manage every department from one unified platform."
              },
              { 
                title: "Large Student Population", 
                problem: "Thousands of students across multiple buildings.", 
                solution: "Attendance, notifications and resources stay synchronized in real time."
              },
              { 
                title: "Smart Classrooms", 
                problem: "Lecture content must reach every classroom instantly.", 
                solution: "Faculty publish directly to SmartBoards seamlessly."
              }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col items-center text-center"
              >
                <h3 className="font-bold text-lg text-text-main mb-4">{card.title}</h3>
                <p className="text-sm text-slate-500 mb-6">{card.problem}</p>
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 text-primary border border-slate-100">
                  <ArrowDown className="w-5 h-5" />
                </div>
                <p className="font-semibold text-primary">{card.solution}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Ecosystem */}
      <section className="py-32 bg-slate-50 overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main">The Connected Ecosystem</h2>
          </div>
          
          <div className="relative h-[500px] w-full max-w-3xl mx-auto flex items-center justify-center">
            {/* Center */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="w-48 h-48 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-[0_0_50px_rgba(37,99,235,0.3)] z-20 absolute"
            >
              IntelliAttend
            </motion.div>

            {/* Orbiting nodes */}
            {[
              "Students", "Faculty", "Departments", "SmartBoards", "Library", "Administration", "AI Analytics", "Cloud"
            ].map((label, i, arr) => {
              const angle = (i / arr.length) * Math.PI * 2;
              const radius = 200; // px
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  whileInView={{ opacity: 1, x, y }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (i * 0.1), type: "spring" }}
                  className="absolute w-32 h-32 bg-white border border-slate-200 rounded-full flex flex-col items-center justify-center text-center shadow-lg z-10"
                >
                  <span className="text-sm font-bold text-text-main">{label}</span>
                </motion.div>
              );
            })}
            
            {/* Connecting Lines (svg) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
               {[0,1,2,3,4,5,6,7].map((i) => {
                  const angle = (i / 8) * Math.PI * 2;
                  const x2 = 50 + Math.cos(angle) * 30; // percentage
                  const y2 = 50 + Math.sin(angle) * 45; // percentage roughly based on aspect ratio
                  return (
                    <motion.line 
                      key={i}
                      x1="50%" y1="50%" x2={`${x2}%`} y2={`${y2}%`}
                      stroke="rgba(37,99,235,0.2)" strokeWidth="2" strokeDasharray="5,5"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 1 }}
                    />
                  )
               })}
            </svg>
          </div>
        </div>
      </section>

      {/* Daily Campus Timeline */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main">Daily Campus Timeline</h2>
          </div>
          
          <div className="flex flex-col gap-8 relative before:absolute before:inset-y-0 before:left-[50px] md:before:left-[120px] before:w-px before:bg-slate-200">
            {[
              { time: "08:30", text: "Faculty arrive", icon: Users },
              { time: "09:00", text: "Attendance starts", icon: CheckCircle2 },
              { time: "09:03", text: "Attendance synchronized", icon: Cloud },
              { time: "09:05", text: "Lecture pushed to SmartBoard", icon: MonitorPlay },
              { time: "11:00", text: "Students receive notes", icon: BookMarked },
              { time: "17:00", text: "Reports generated automatically", icon: BarChart3 },
            ].map((event, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-6 md:gap-12 relative z-10"
              >
                <div className="w-[100px] text-right font-mono font-bold text-primary shrink-0 text-lg hidden md:block">
                  {event.time}
                </div>
                <div className="w-12 h-12 rounded-full bg-white border-2 border-primary flex items-center justify-center shrink-0 shadow-sm relative left-[26px] md:left-0">
                  <event.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex-1 shadow-sm ml-8 md:ml-0">
                  <div className="font-mono font-bold text-primary text-sm mb-2 md:hidden">{event.time}</div>
                  <span className="text-lg font-semibold text-text-main">{event.text}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scale Section */}
      <section className="py-32 bg-text-main text-center text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-20">Everything Scales Automatically</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {[
              { label: "1 Department" },
              { label: "10 Departments" },
              { label: "Entire Campus" },
              { label: "Multiple Campuses" },
            ].map((step, i, arr) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-white/10 border border-white/20 px-8 py-4 rounded-full font-bold text-lg md:text-xl backdrop-blur-md"
                >
                  {step.label}
                </motion.div>
                {i < arr.length - 1 && (
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }}
                    whileInView={{ opacity: 1, width: "auto" }}
                    viewport={{ once: true }}
                    transition={{ delay: (i * 0.2) + 0.1 }}
                  >
                    <ArrowRight className="w-6 h-6 text-accent rotate-90 md:rotate-0 my-4 md:my-0" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Intelligence Dashboard */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main">Platform Intelligence Dashboard</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Live Classes", num: 214, icon: MonitorPlay },
              { title: "Faculty Online", num: 127, icon: Users },
              { title: "Students Present", num: 5842, icon: GraduationCap },
              { title: "SmartBoards Active", num: 46, icon: Sparkles },
              { title: "Resources Shared Today", num: 389, icon: BookMarked },
              { title: "Notifications Delivered", num: 14822, icon: Zap },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-slate-500 font-medium mb-2">{stat.title}</p>
                  <div className="text-4xl font-bold text-text-main font-mono">
                    <AnimatedCounter from={0} to={stat.num} />
                  </div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <stat.icon className="w-8 h-8" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Operations & Security */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-16">
          
          {/* AI Operations */}
          <div>
            <h2 className="text-3xl font-bold text-text-main mb-12 flex items-center gap-4">
              <BrainCircuit className="w-8 h-8 text-primary" /> AI Operations
            </h2>
            <div className="flex flex-col gap-4 relative before:absolute before:inset-y-0 before:left-5 before:w-0.5 before:bg-primary/20">
              {[
                "Attendance Completed",
                "Late Faculty Detected",
                "Notification Sent",
                "Resources Uploaded",
                "Analytics Updated",
                "Reports Generated"
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.2 }}
                  className="flex items-center gap-6 relative z-10 bg-white"
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-text-main">{step}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div>
            <h2 className="text-3xl font-bold text-text-main mb-12 flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-emerald-500" /> Enterprise Security
            </h2>
            <div className="flex flex-col gap-4 relative before:absolute before:inset-y-0 before:left-5 before:w-0.5 before:bg-emerald-500/20">
              {[
                { label: "Faculty Authentication", icon: Key },
                { label: "Encrypted Attendance", icon: ShieldCheck },
                { label: "Cloud Backup", icon: Cloud },
                { label: "Audit Logs", icon: FileWarning },
                { label: "Role Permissions", icon: Lock }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.2 }}
                  className="flex items-center gap-6 relative z-10 bg-white"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-text-main">{step.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Why Universities Prefer IntelliAttend */}
      <section className="py-32 bg-slate-50 border-t border-slate-200/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main">Why Universities Prefer IntelliAttend</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Old Campus */}
            <div className="bg-white border border-slate-200 rounded-3xl p-10 opacity-70">
              <h3 className="text-2xl font-bold text-slate-500 mb-8 border-b pb-4">Old Campus</h3>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-slate-600 font-medium"><FileX className="text-red-400" /> Paper Registers</li>
                <li className="flex items-center gap-4 text-slate-600 font-medium"><MailQuestion className="text-red-400" /> Emails</li>
                <li className="flex items-center gap-4 text-slate-600 font-medium"><MonitorX className="text-red-400" /> Separate Software</li>
                <li className="flex items-center gap-4 text-slate-600 font-medium"><BarChart3 className="text-red-400" /> Manual Reports</li>
              </ul>
            </div>

            {/* IntelliAttend */}
            <div className="bg-primary rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden transform md:scale-105">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8 border-b border-white/20 pb-4 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-accent" /> IntelliAttend
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-center gap-4 font-semibold text-lg"><Zap className="text-accent" /> One Platform</li>
                  <li className="flex items-center gap-4 font-semibold text-lg"><BrainCircuit className="text-accent" /> AI Automation</li>
                  <li className="flex items-center gap-4 font-semibold text-lg"><Cloud className="text-accent" /> Cloud Connected</li>
                  <li className="flex items-center gap-4 font-semibold text-lg"><BarChart3 className="text-accent" /> Live Analytics</li>
                  <li className="flex items-center gap-4 font-semibold text-lg"><MonitorPlay className="text-accent" /> Smart Classrooms</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
