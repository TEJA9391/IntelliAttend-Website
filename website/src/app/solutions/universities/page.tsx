"use client";

import { useRef, useEffect, useState, Fragment } from "react";
import { motion, useInView, animate, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { NeuralMesh } from "@/components/ui/NeuralMesh";
import { 
  Building2,
  Stethoscope,
  BookMarked,
  Briefcase,
  Users,
  GraduationCap,
  ArrowDown,
  MonitorPlay,
  BarChart3,
  Database,
  Cloud,
  CheckCircle2,
  Server,
  FileX,
  MailQuestion,
  MonitorX,
  Zap,
  ArrowRight,
  BrainCircuit,
  Monitor
} from "lucide-react";

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
            nodeRef.current.textContent = prefix + Math.round(value).toLocaleString("en-US") + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [from, to, duration, suffix, prefix, isInView]);

  return <span ref={nodeRef}>{prefix}{to.toLocaleString("en-US")}{suffix}</span>;
}

const WORDS = [
  "Universities",
  "Colleges",
  "Institutions"
];

const ECOSYSTEM_NODES = [
  { label: "Students", icon: GraduationCap, desc: "Mobile App Access", subDesc: "iOS & Android", pos: { x: -65, y: -5 }, subPos: { x: -81, y: -17 }, sub2Pos: { x: -59, y: -23 } },
  { label: "AI Analytics", icon: BrainCircuit, desc: "Predictive Insights", subDesc: "Dropout Prevention", pos: { x: -45, y: 15 }, subPos: { x: -61, y: 29 }, sub2Pos: { x: -37, y: 33 } },
  { label: "Administration", icon: Briefcase, desc: "Central Control", subDesc: "Unified Dashboard", pos: { x: -25, y: -18 }, subPos: { x: -41, y: -30 }, sub2Pos: { x: -15, y: -34 } },
  { label: "Library", icon: BookMarked, desc: "Digital Repository", subDesc: "E-books & Journals", pos: { x: -5, y: 25 }, subPos: { x: -22, y: 20 }, sub2Pos: { x: 12, y: 15 } },
  { label: "Cloud", icon: Cloud, desc: "Secure Sync", subDesc: "End-to-End Encrypted", pos: { x: 15, y: -22 }, subPos: { x: 5, y: -34 }, sub2Pos: { x: 27, y: -32 } },
  { label: "Faculty", icon: Users, desc: "Digital Workflows", subDesc: "Automated Grading", pos: { x: 35, y: 15 }, subPos: { x: 25, y: 31 }, sub2Pos: { x: 43, y: 31 } },
  { label: "Departments", icon: Building2, desc: "Resource Allocation", subDesc: "Budget Optimization", pos: { x: 55, y: -10 }, subPos: { x: 45, y: -26 }, sub2Pos: { x: 71, y: -22 } },
  { label: "SmartBoards", icon: Monitor, desc: "Interactive Displays", subDesc: "Real-time Sync", pos: { x: 70, y: 12 }, subPos: { x: 62, y: 28 }, sub2Pos: { x: 86, y: 22 } },
];

export default function UniversitiesSolution() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h1 
              layout
              transition={{ layout: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-text-main mb-8 leading-[1.1] flex flex-col items-center justify-center overflow-visible"
            >
              <motion.span layout transition={{ layout: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }} className="flex flex-wrap items-baseline justify-center text-center">
                <motion.span layout transition={{ layout: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }}>Everything</motion.span>
                <span className="inline-grid text-center mx-3 sm:mx-4" style={{ perspective: "1000px" }}>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      layout
                      key={wordIndex}
                      initial={{ rotateX: -90, y: 20, opacity: 0 }}
                      animate={{ rotateX: 0, y: 0, opacity: 1 }}
                      exit={{ rotateX: 90, y: -20, opacity: 0 }}
                      transition={{ 
                        duration: 1.2, 
                        ease: [0.16, 1, 0.3, 1],
                        layout: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
                      }}
                      className="col-start-1 row-start-1 origin-center whitespace-nowrap"
                    >
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                        {WORDS[wordIndex]}
                      </span>
                    </motion.span>
                  </AnimatePresence>
                </span>
                <motion.span layout transition={{ layout: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }}>Need.</motion.span>
              </motion.span>
              <motion.span layout transition={{ layout: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }} className="mt-2 sm:mt-4 text-center">
                One Intelligent Platform.
              </motion.span>
            </motion.h1>
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
          
          <div className="flex flex-col items-center max-w-4xl mx-auto w-full px-2">
            {/* Top Node */}
            <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(45,212,191,0.4)" }} className="bg-white/10 border border-white/20 px-8 py-4 rounded-xl text-white font-bold text-xl md:text-2xl backdrop-blur-sm transition-all cursor-default relative z-10">
              UNIVERSITY
            </motion.div>
            
            {/* Vertical Line */}
            <div className="w-px h-8 bg-accent" />
            
            {/* Level 2: Engineering & Medical */}
            <div className="relative flex w-full max-w-sm md:max-w-lg mx-auto">
              {/* Top horizontal connection: 25% from left, 25% from right */}
              <div className="absolute top-0 left-[25%] right-[25%] h-px bg-accent" />
              
              <div className="flex flex-col items-center flex-1 relative z-10">
                <div className="w-px h-8 bg-accent" />
                <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(45,212,191,0.4)" }} className="bg-white/5 border border-white/10 px-4 md:px-6 py-3 rounded-xl text-white flex items-center justify-center gap-2 transition-all cursor-default w-[130px] md:w-[180px]">
                  <Building2 className="w-4 h-4 md:w-5 md:h-5 text-accent flex-shrink-0" /> <span className="text-sm md:text-base">Engineering</span>
                </motion.div>
                <div className="w-px h-8 bg-accent" />
              </div>
              
              <div className="flex flex-col items-center flex-1 relative z-10">
                <div className="w-px h-8 bg-accent" />
                <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(45,212,191,0.4)" }} className="bg-white/5 border border-white/10 px-4 md:px-6 py-3 rounded-xl text-white flex items-center justify-center gap-2 transition-all cursor-default w-[130px] md:w-[180px]">
                  <Stethoscope className="w-4 h-4 md:w-5 md:h-5 text-accent flex-shrink-0" /> <span className="text-sm md:text-base">Medical</span>
                </motion.div>
                <div className="w-px h-8 bg-accent" />
              </div>

              {/* Bottom horizontal connection */}
              <div className="absolute bottom-0 left-[25%] right-[25%] h-px bg-accent" />
            </div>

            {/* Vertical drop to center */}
            <div className="w-px h-8 bg-accent" />

            {/* Core Node */}
            <motion.div 
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(45,212,191,0.6)" }} 
              className="bg-primary border border-primary-light px-8 md:px-12 py-5 md:py-6 rounded-2xl text-white font-extrabold text-2xl md:text-4xl shadow-[0_0_30px_rgba(45,212,191,0.3)] cursor-default transition-all z-10"
            >
              IntelliAttend
            </motion.div>

            {/* Vertical drop to bottom layer */}
            <div className="w-px h-8 bg-accent" />
            
            {/* Level 4: 4 Bottom Nodes */}
            <div className="relative flex w-full max-w-2xl">
               {/* Horizontal connecting line from center of first to center of last item (12.5% padding on each side for 4 items) */}
               <div className="absolute top-0 left-[12.5%] right-[12.5%] h-px bg-accent" />

               {[
                 { icon: BookMarked, label: "Library" },
                 { icon: Briefcase, label: "Admin" },
                 { icon: GraduationCap, label: "Students" },
                 { icon: Users, label: "Faculty" }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center flex-1 relative z-10">
                   <div className="w-px h-8 bg-accent" />
                   <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(45,212,191,0.4)" }} className="bg-white/5 border border-white/10 p-3 md:p-5 rounded-xl text-white flex flex-col items-center justify-center gap-2 transition-all cursor-default w-[90%] aspect-[4/3] md:aspect-square">
                     <item.icon className="w-5 h-5 md:w-8 md:h-8 text-accent" />
                     <span className="text-[10px] md:text-sm font-medium text-center">{item.label}</span>
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
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 text-slate-500 border border-slate-100">
                  <ArrowDown className="w-5 h-5" />
                </div>
                <p className="font-semibold text-slate-500">{card.solution}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Ecosystem */}
      <section className="h-screen min-h-[700px] bg-slate-50 overflow-hidden relative flex flex-col justify-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10 flex flex-col items-center h-full">
          <div className="text-center mt-16 mb-8 md:mb-12 shrink-0">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main">The Connected Ecosystem</h2>
          </div>
          
          <div className="relative flex-1 w-full max-w-full mx-auto flex items-center justify-center origin-center scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100">
            {/* Center */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="absolute z-20"
              style={{ left: "50%", top: "50%", marginLeft: "-11vmin", marginTop: "-11vmin" }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-primary rounded-full flex items-center justify-center text-white font-bold shadow-[0_0_50px_rgba(45,212,191,0.3)]"
                style={{ width: "22vmin", height: "22vmin", fontSize: "2.5vmin" }}
              >
                IntelliAttend
              </motion.div>
            </motion.div>

            {/* Orbiting nodes organically scattered - Responsive vmin coordinates */}
            {ECOSYSTEM_NODES.map((node, i) => {
              const tealDelay = 2.5 + (i * 0.1);
              const slateDelay = 3.5 + (i * 0.1);

              return (
                <Fragment key={i}>
                  {/* Slate Circle (subDesc at sub2Pos, size 11vmin, offset -5.5vmin) */}
                  <div
                    className="absolute z-[1]"
                    style={{ 
                      left: `calc(50% + (${node.sub2Pos.x}vmin))`, 
                      top: `calc(50% + (${node.sub2Pos.y}vmin))`,
                      width: "11vmin",
                      height: "11vmin",
                      marginLeft: "-5.5vmin",
                      marginTop: "-5.5vmin"
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: slateDelay, type: "spring", bounce: 0.5 }}
                      className="w-full h-full"
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: slateDelay }}
                        className="bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-center shadow-sm p-1.5 w-full h-full"
                      >
                        <span className="font-medium leading-tight text-slate-500" style={{ fontSize: "1.1vmin" }}>{node.subDesc}</span>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Teal Circle (desc at subPos, size 13vmin, offset -6.5vmin) */}
                  <div
                    className="absolute z-[2]"
                    style={{ 
                      left: `calc(50% + (${node.subPos.x}vmin))`, 
                      top: `calc(50% + (${node.subPos.y}vmin))`,
                      width: "13vmin",
                      height: "13vmin",
                      marginLeft: "-6.5vmin",
                      marginTop: "-6.5vmin"
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: tealDelay, type: "spring", bounce: 0.5 }}
                      className="w-full h-full"
                    >
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: tealDelay }}
                        className="bg-teal-50 border border-teal-100 rounded-full flex items-center justify-center text-center shadow-sm p-2 w-full h-full"
                      >
                        <span className="font-medium leading-tight text-teal-800" style={{ fontSize: "1.2vmin" }}>{node.desc}</span>
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  {/* Main Node (pos, size 16vmin, offset -8vmin) */}
                  <div
                    className="absolute z-10"
                    style={{ 
                      left: `calc(50% + (${node.pos.x}vmin))`, 
                      top: `calc(50% + (${node.pos.y}vmin))`,
                      width: "16vmin",
                      height: "16vmin",
                      marginLeft: "-8vmin",
                      marginTop: "-8vmin"
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 1.5 + (i * 0.1), type: "spring", bounce: 0.5 }}
                      className="w-full h-full"
                    >
                      <motion.div 
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 + (i * 0.1) }}
                        className="relative bg-white border border-slate-200 rounded-full flex flex-col items-center justify-center text-center shadow-lg w-full h-full"
                      >
                        <node.icon className="text-primary mb-1" style={{ width: "4vmin", height: "4vmin" }} />
                        <span className="font-bold text-text-main leading-tight" style={{ fontSize: "1.5vmin" }}>{node.label}</span>
                      </motion.div>
                    </motion.div>
                  </div>
                </Fragment>
            )})}
            
            {/* Dynamic Neural Mesh Background */}
            <NeuralMesh />

            {/* Structured DOM Node Mesh Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
               {/* Connect center to the 8 main nodes */}
               {ECOSYSTEM_NODES.map((node, i) => (
                 <motion.line 
                   key={`center-${i}`}
                   x1="50%" y1="50%" x2={`calc(50% + ${node.pos.x}vmin)`} y2={`calc(50% + ${node.pos.y}vmin)`}
                   stroke="rgba(45,212,191,0.5)" strokeWidth="2"
                   initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                 />
               ))}
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
                <div className="w-[100px] text-right font-mono font-bold text-slate-500 shrink-0 text-lg hidden md:block">
                  {event.time}
                </div>
                <div className="w-12 h-12 rounded-full bg-white border-2 border-primary flex items-center justify-center shrink-0 shadow-sm relative left-[26px] md:left-0">
                  <event.icon className="w-5 h-5 text-slate-500" />
                </div>
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex-1 shadow-sm ml-8 md:ml-0">
                  <div className="font-mono font-bold text-slate-500 text-sm mb-2 md:hidden">{event.time}</div>
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
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main">Platform Intelligence Dashboard</h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto mt-3">
              Real-time verified metrics across classroom hardware, automated roll-calls, faculty operations, and student cohorts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Attendance Marks", num: 201785, sub: "Recorded roll-calls", icon: CheckCircle2 },
              { title: "Students Enrolled", num: 2204, sub: "1,042 active students", icon: GraduationCap },
              { title: "SmartBoards Connected", num: 454, sub: "Classroom screens paired", icon: MonitorPlay },
              { title: "Attendance Sessions", num: 3728, sub: "Timetable periods conducted", icon: BookMarked },
              { title: "Faculty Members", num: 32, sub: "31 active mentors", icon: Users },
              { title: "Notifications Sent", num: 28874, sub: "Parent & student alerts", icon: Zap },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-3xl p-7 sm:p-8 flex items-center justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-slate-500 font-medium text-sm mb-1">{stat.title}</p>
                  <div className="text-3xl sm:text-4xl font-bold text-text-main font-mono mb-2">
                    <AnimatedCounter from={0} to={stat.num} />
                  </div>
                  <span className="text-xs text-slate-600 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full inline-block border border-slate-200">
                    {stat.sub}
                  </span>
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/60">
                  <stat.icon className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Institutional Campus Scale Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left shrink-0">
                <h4 className="text-lg font-bold text-slate-900">MRCET Academic Infrastructure</h4>
                <p className="text-xs text-slate-500">9 Programs across Engineering &amp; Technology</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 text-center w-full lg:w-auto">
                <div className="lg:border-r border-slate-100 lg:pr-6">
                  <p className="text-2xl font-bold text-slate-900 font-mono">10,865</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Enrollments</p>
                </div>
                <div className="lg:border-r border-slate-100 lg:pr-6">
                  <p className="text-2xl font-bold text-slate-900 font-mono">126</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Courses</p>
                </div>
                <div className="lg:border-r border-slate-100 lg:pr-6">
                  <p className="text-2xl font-bold text-slate-900 font-mono">9</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Departments</p>
                </div>
                <div className="lg:border-r border-slate-100 lg:pr-6">
                  <p className="text-2xl font-bold text-slate-900 font-mono">15</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Sections</p>
                </div>
                <div className="lg:border-r border-slate-100 lg:pr-6">
                  <p className="text-2xl font-bold text-slate-900 font-mono">20+</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Rooms &amp; Labs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 font-mono">5,110</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Faculty Alerts</p>
                </div>
              </div>
            </div>
          </motion.div>
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
                  <Image src="/images/logo.png" alt="Logo" width={24} height={24} className="brightness-0 invert w-6 h-6 object-contain" /> IntelliAttend
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
