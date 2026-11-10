"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  School, 
  MonitorPlay, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  CloudSync, 
  BarChart3, 
  Calendar,
  Users
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function SolutionsOverview() {
  const universityPillars = [
    {
      title: "SmartBoard Lecture Sync",
      desc: "Push presentations, syllabus notes, and announcements straight to classroom screens with zero cable setup."
    },
    {
      title: "Eligibility & Compliance Analytics",
      desc: "Instantly track students against the 75% attendance threshold for semester exams and accreditation standards."
    },
    {
      title: "Multi-Section Timetables",
      desc: "Manage faculty allocations, lecture slots, and room assignments dynamically with zero scheduling conflicts."
    },
    {
      title: "4 Unified Portals",
      desc: "Purpose-built interfaces with granular role-based permissions for Faculty, Students, HODs, and Campus Admins."
    }
  ];

  const k12Pillars = [
    {
      title: "1-Tap Attendance",
      desc: "Eliminate paper registers and reclaim the first 10 minutes of every period with rapid digital roll-calls."
    },
    {
      title: "Connected Classroom Displays",
      desc: "Broadcast daily timetables, exam alerts, and educational resources directly to classroom screens."
    },
    {
      title: "Centralized Academic Records",
      desc: "Keep all student records, daily logs, and term reports securely archived and exportable at any time."
    },
    {
      title: "Unified Administration",
      desc: "Enable school leadership to monitor overall attendance health and campus notifications in real time."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-40 pb-20 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0F172A] mb-6 leading-[1.1]">
              Engineered for Every <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Educational Institution.</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg md:text-xl leading-relaxed text-[#64748B]">
              Whether running a multi-department college campus or an independent school, IntelliAttend scales effortlessly to bring attendance, SmartBoards, and academic records under one roof.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Two Flagship Tracks */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Universities & Colleges */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 md:p-12 flex flex-col justify-between hover:shadow-xl hover:shadow-primary/5 transition-all"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                  <Building2 className="w-4 h-4" /> Higher Education
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
                  Universities & Engineering Colleges
                </h2>
                <p className="text-[#64748B] text-lg leading-relaxed mb-8">
                  Built specifically for high-capacity lecture halls, departmental hierarchies, lab sessions, and accreditation compliance tracking.
                </p>

                <div className="space-y-4 mb-10">
                  {universityPillars.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-base">{item.title}</h4>
                        <p className="text-sm text-slate-500 leading-normal">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/solutions/universities"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg w-full sm:w-fit cursor-pointer"
              >
                Explore University Solutions <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* K-12 Schools */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 md:p-12 flex flex-col justify-between hover:shadow-xl hover:shadow-primary/5 transition-all"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/20 text-slate-700 text-xs font-bold uppercase tracking-wider mb-6">
                  <School className="w-4 h-4" /> K-12 & Schools
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
                  K-12 Schools & Academies
                </h2>
                <p className="text-[#64748B] text-lg leading-relaxed mb-8">
                  Streamlined tools designed for everyday classrooms—empowering teachers, keeping records organized, and engaging students with smart displays.
                </p>

                <div className="space-y-4 mb-10">
                  {k12Pillars.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-base">{item.title}</h4>
                        <p className="text-sm text-slate-500 leading-normal">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/solutions/k12"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0F172A] text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg w-full sm:w-fit cursor-pointer"
              >
                Explore School Solutions <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Shared Platform Highlights */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
              Built on Modern Infrastructure
            </h2>
            <p className="text-slate-500 text-lg">
              Enterprise reliability and paperless efficiency across every tier of education.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: CloudSync,
                title: "100% Cloud-Synchronized",
                desc: "Instant real-time data sync across faculty phones, student devices, and classroom SmartBoards."
              },
              {
                icon: MonitorPlay,
                title: "Universal Display Support",
                desc: "Zero proprietary dongles or hardware needed. Works seamlessly with any web-enabled smart screen."
              },
              {
                icon: ShieldCheck,
                title: "Role-Based Security",
                desc: "Encrypted communications and strict permission boundaries protecting sensitive academic records."
              },
              {
                icon: BarChart3,
                title: "Instant Insights",
                desc: "Live attendance trends, student eligibility, and departmental reports available at the touch of a button."
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 text-primary">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-br from-primary/15 via-white to-accent/10 border border-primary/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-8"
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-3">
                Ready to modernize your campus operations?
              </h3>
              <p className="text-slate-600 text-lg">
                Connect directly with our team to explore a pilot deployment at your institution.
              </p>
            </div>
            <Link 
              href="/#contact" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/30 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Contact Our Team <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
