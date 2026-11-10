"use client";
import Link from "next/link";

import { useRef, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";
import { 
  School,
  GraduationCap,
  Users,
  BookOpen,
  Bell,
  BarChart3,
  Calendar,
  Cloud,
  CheckCircle2,
  ShieldCheck,
  Megaphone,
  CalendarRange,
  MonitorPlay,
  FileText,
  Clock,
  Briefcase,
  FileX,
  MailQuestion,
  MonitorX,
  Zap,
  ArrowRight,
  UserCheck,
  ClipboardCheck
} from "lucide-react";

// Counter Component
function AnimatedCounter({ from, to, duration = 2, suffix = "", prefix = "", decimals = 0 }: { from: number, to: number, duration?: number, suffix?: string, prefix?: string, decimals?: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView && nodeRef.current) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            const formatted = decimals > 0 
              ? value.toFixed(decimals) 
              : Math.round(value).toLocaleString();
            nodeRef.current.textContent = prefix + formatted + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [from, to, duration, suffix, prefix, decimals, isInView]);

  return <span ref={nodeRef}>{prefix}{decimals > 0 ? to.toFixed(decimals) : Math.round(to).toLocaleString()}{suffix}</span>;
}

export default function K12Solution() {
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
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-main mb-8 leading-[1.1]">
              Building Smarter, Safer, and<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">More Connected Schools.</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-[#64748B] mb-10">
              Empower teachers, students, parents, and administrators with a unified platform that simplifies attendance, classroom management, communication, and academic operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/#contact">
                <button className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-accent hover:scale-105 active:scale-95 transition-all duration-150 shadow-xl shadow-primary/20 cursor-pointer">
                  Request a Demo
                </button>
              </Link>
              <Link href="/solutions">
                <button className="px-8 py-4 bg-white text-text-main border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-150 shadow-sm cursor-pointer">
                  Explore School Solutions
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* A School Day with IntelliAttend */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main">A School Day with IntelliAttend</h2>
          </div>
          
          <div className="flex flex-col gap-8 relative before:absolute before:inset-y-0 before:left-[50px] md:before:left-[120px] before:w-px before:bg-slate-200">
            {[
              { time: "08:00", text: "Teachers Check In", desc: "Staff arrival and digital portal check-in across classrooms", icon: Briefcase },
              { time: "08:15", text: "Students Mark Attendance", desc: "Fast 1-tap roll call and classroom OTP verification", icon: UserCheck },
              { time: "08:30", text: "Classes Begin", desc: "Interactive SmartBoard teaching and curriculum sync", icon: BookOpen },
              { time: "10:30", text: "Assignments Shared", desc: "Classroom exercises and study notes pushed to student app", icon: FileText },
              { time: "12:30", text: "School Announcements", desc: "Campus notices and activity broadcasts pushed instantly", icon: Megaphone },
              { time: "15:30", text: "Daily Reports Generated", desc: "Automated student attendance logs compiled for administration", icon: BarChart3 },
              { time: "16:15", text: "Teachers Assign Homework", desc: "Subject teachers post today's homework, tasks, and submission deadlines", icon: ClipboardCheck },
              { time: "18:00", text: "Parents Receive Homework Notifications", desc: "Parents get instant evening alerts directly in the Parent App with today's homework", icon: Bell },
            ].map((event, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-6 md:gap-12 relative z-10"
              >
                <div className="w-[100px] text-right font-mono font-bold text-slate-500 shrink-0 text-lg hidden md:block">
                  {event.time}
                </div>
                <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-sm relative left-[26px] md:left-0">
                  <event.icon className="w-5 h-5 text-slate-700" />
                </div>
                <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl flex-1 shadow-2xs ml-8 md:ml-0">
                  <div className="font-mono font-bold text-slate-500 text-sm mb-2 md:hidden">{event.time}</div>
                  <h3 className="text-lg font-bold text-text-main leading-snug">{event.text}</h3>
                  <p className="text-sm text-[#64748B] mt-1">{event.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* School Management */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main">School Management</h2>
            <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">Activities perfectly organized by role, connecting your entire campus.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Users, title: "Teacher Workspace", desc: "Manage attendance, lesson materials, classroom schedules, and student activities from one dashboard.", color: "text-slate-500", bg: "bg-teal-50" },
              { icon: GraduationCap, title: "Student Learning", desc: "Access homework, study materials, class schedules, announcements, and attendance records anytime.", color: "text-emerald-500", bg: "bg-emerald-50" },
              { icon: Bell, title: "Parent Communication", desc: "Keep parents informed with attendance updates, school notices, event reminders, and academic progress.", color: "text-purple-500", bg: "bg-purple-50" },
              { icon: School, title: "School Administration", desc: "Monitor classrooms, teachers, attendance, announcements, and school-wide performance through one centralized platform.", color: "text-orange-500", bg: "bg-orange-50" },
            ].map((activity, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-16 h-16 rounded-2xl ${activity.bg} flex items-center justify-center shrink-0`}>
                  <activity.icon className={`w-8 h-8 ${activity.color}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2">{activity.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{activity.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safe & Connected Campus */}
      <section className="py-24 bg-white border-y border-slate-200/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main">Safe & Connected Campus</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Secure Student Records", icon: ShieldCheck },
              { title: "Instant School Announcements", icon: Megaphone },
              { title: "Digital Timetable Management", icon: CalendarRange },
              { title: "Secure Cloud Synchronization", icon: Cloud },
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col items-center text-center hover:bg-slate-100 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                  <card.icon className="w-7 h-7 text-slate-500" />
                </div>
                <h3 className="font-bold text-lg text-text-main">{card.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Classroom Experience */}
      <section className="py-32 bg-text-main relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Classroom Experience</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">A seamless digital learning flow.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              {[
                { title: "Teacher", highlight: true },
                { title: "Interactive Lesson" },
                { title: "SmartBoard Display" },
                { title: "Students Participate", highlight: true },
                { title: "Attendance Recorded" },
                { title: "Homework Shared", highlight: true },
              ].map((step, i, arr) => (
                <div key={i} className="flex flex-col items-center w-full relative">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1, duration: 0.2 }}
                    className={`w-full max-w-sm p-5 rounded-2xl border backdrop-blur-md flex items-center justify-center relative z-10 ${
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

      {/* Why Schools Choose IntelliAttend */}
      <section className="py-32 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main">Why Schools Choose IntelliAttend</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional School */}
            <div className="bg-white border border-slate-200 rounded-3xl p-10 opacity-70">
              <h3 className="text-2xl font-bold text-slate-500 mb-8 border-b pb-4">Traditional School</h3>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-slate-600 font-medium"><FileX className="text-red-400" /> Paper attendance</li>
                <li className="flex items-center gap-4 text-slate-600 font-medium"><MailQuestion className="text-red-400" /> Manual announcements</li>
                <li className="flex items-center gap-4 text-slate-600 font-medium"><MonitorX className="text-red-400" /> Printed homework</li>
                <li className="flex items-center gap-4 text-slate-600 font-medium"><MonitorX className="text-red-400" /> Separate systems</li>
                <li className="flex items-center gap-4 text-slate-600 font-medium"><Clock className="text-red-400" /> Delayed communication</li>
              </ul>
            </div>

            {/* IntelliAttend School */}
            <div className="bg-primary rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden transform md:scale-105">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8 border-b border-white/20 pb-4 flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-accent" /> IntelliAttend School
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-center gap-4 font-semibold text-lg"><CheckCircle2 className="text-accent" /> Digital attendance</li>
                  <li className="flex items-center gap-4 font-semibold text-lg"><Zap className="text-accent" /> Instant notifications</li>
                  <li className="flex items-center gap-4 font-semibold text-lg"><BookOpen className="text-accent" /> Online learning resources</li>
                  <li className="flex items-center gap-4 font-semibold text-lg"><MonitorPlay className="text-accent" /> Connected classrooms</li>
                  <li className="flex items-center gap-4 font-semibold text-lg"><Bell className="text-accent" /> Real-time communication</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Operations Dashboard & Benefits */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-16">
          
          {/* Dashboard */}
          <div>
            <h2 className="text-3xl font-bold text-text-main mb-12">Daily Operations Dashboard</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Teachers Active", num: 68 },
                { title: "Students Present", num: 1245 },
                { title: "Classes Running", num: 42 },
                { title: "Announcements Sent", num: 18 },
                { title: "Assignments Shared", num: 95 },
                { title: "Attendance Today", num: 98.7, suffix: "%", decimals: 1 },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm"
                >
                  <p className="text-slate-500 font-medium mb-1 text-sm">{stat.title}</p>
                  <div className="text-3xl font-bold text-text-main font-mono">
                    <AnimatedCounter from={0} to={stat.num} suffix={stat.suffix || ""} decimals={stat.decimals || 0} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h2 className="text-3xl font-bold text-text-main mb-12">Platform Benefits</h2>
            <div className="flex flex-col gap-6">
              {[
                "Reduce administrative workload",
                "Improve classroom organization",
                "Strengthen teacher-student communication",
                "Keep parents informed in real time",
                "Digitize school operations",
                "Support a safer, more connected learning environment"
              ].map((reason, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 text-lg text-slate-700 font-medium"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-500" />
                  </div>
                  {reason}
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Final Call to Action */}
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
                Helping Schools Focus on Learning, Not Paperwork.
              </h2>
              <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-3xl mx-auto">
                IntelliAttend enables K-12 schools to create efficient classrooms, connected communities, and better learning experiences through intelligent digital solutions.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/#contact">
                  <button className="px-8 py-4 bg-white text-slate-500 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-150 shadow-xl cursor-pointer">
                    Schedule a Demo
                  </button>
                </Link>
                <Link href="/#contact">
                  <button className="px-8 py-4 bg-accent/20 text-white border border-accent/30 rounded-full font-bold text-lg hover:bg-accent/30 hover:scale-105 active:scale-95 transition-all duration-150 backdrop-blur-sm cursor-pointer">
                    Contact Our Team
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
