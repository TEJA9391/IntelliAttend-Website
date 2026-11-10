"use client";

import * as React from "react";
import { useState } from "react";
import { 
  ArrowRight, 
  BookOpen, 
  MonitorSmartphone, 
  Users, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  ShieldCheck, 
  Bell, 
  Clock, 
  Smartphone, 
  LogIn,
  LayoutDashboard,
  BadgeCheck,
  FolderOpen,
  FileBarChart,
  FileCheck2,
  Lock,
  Layers
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface OverviewItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  link: string;
}

interface QuickGuideItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
}

interface FaqItem {
  q: string;
  category: string;
  a: string;
  highlight?: string;
}

const PLATFORM_OVERVIEW: OverviewItem[] = [
  {
    title: "Faculty",
    icon: GraduationCap,
    desc: "Manage attendance, schedules, classroom resources, SmartBoard content, and teaching activities from one intuitive dashboard.",
    link: "/products/faculty"
  },
  {
    title: "Students",
    icon: Users,
    desc: "Access attendance records, dynamic SmartBoard OTP check-in, 75% threshold tracking, and lecture resources directly on phone.",
    link: "/products/student"
  },
  {
    title: "SmartBoard",
    icon: MonitorSmartphone,
    desc: "Share presentations, lecture notes, announcements, and classroom content instantly with connected SmartBoards without USB drives.",
    link: "/products/smartboard"
  },
  {
    title: "Administration",
    icon: Building2,
    desc: "Monitor campus operations, faculty performance, attendance reports, and institutional analytics from a centralized dashboard.",
    link: "/solutions/universities"
  }
];

const QUICK_GUIDES: QuickGuideItem[] = [
  { 
    icon: LogIn, 
    title: "Create Your Account", 
    desc: "Learn how to sign in and access your IntelliAttend portal using campus credentials." 
  },
  { 
    icon: LayoutDashboard, 
    title: "Navigate the Dashboard", 
    desc: "Understand the main sections, daily timetables, and notification feeds of the platform." 
  },
  { 
    icon: BadgeCheck, 
    title: "Take Attendance", 
    desc: "Quickly record attendance using dynamic SmartBoard OTP and faculty portal 1-tap tools." 
  },
  { 
    icon: FolderOpen, 
    title: "Manage Learning Resources", 
    desc: "Upload, push, and organize presentations and course materials directly to classroom screens." 
  },
  { 
    icon: Bell, 
    title: "Homework & Parent Alerts", 
    desc: "Log daily homework by 16:15 and automatically deliver 18:00 evening alerts to the Parent App." 
  },
  { 
    icon: FileBarChart, 
    title: "View Compliance Reports", 
    desc: "Access attendance summaries and formatted audit-ready registers for AICTE and NAAC." 
  }
];

const FAQS: FaqItem[] = [
  {
    q: "How does IntelliAttend eliminate proxy attendance and buddy punching?",
    category: "Anti-Proxy Verification",
    a: "IntelliAttend eliminates proxy attendance through real-time classroom validation: 1) Dynamic SmartBoard OTP — A time-sensitive 6-digit session code rotates live on the classroom SmartBoard screen, ensuring only students physically present in the room can see and submit it; 2) Single-Device Hardware Binding — Each student profile is locked to their personal verified smartphone ID, preventing one student from logging into peers' accounts; 3) Instant Session Auto-Lock — Faculty initiate and lock roll-call windows in real time, preventing absent students from submitting expired codes.",
    highlight: "Classroom Verification: Dynamic SmartBoard OTP + Hardware Device Binding + Instant Session Auto-Lock"
  },
  {
    q: "Can IntelliAttend integrate with our existing university ERP and biometric systems?",
    category: "Integration",
    a: "Yes. IntelliAttend features a bi-directional REST API connector and automated CSV ingestion. It syncs student admission rosters, department course codes, fee clearance flags, and biometric logs with leading university ERP systems (e.g., autonomous college portals, JNTUH affiliated SIS).",
    highlight: "Two-way REST API & Scheduled ERP Database Sync"
  },
  {
    q: "How and when are parents notified about daily attendance and homework?",
    category: "Parent Notifications",
    a: "Parents receive automated morning push notifications if their ward is marked absent during morning roll call. At 18:00 every evening, the system compiles daily homework assignments submitted by subject teachers and delivers an alert directly to the Parent App.",
    highlight: "Morning absence alert + 18:00 evening daily homework notifications directly in Parent App"
  },
  {
    q: "Is student personal data and biometric data compliant with privacy laws?",
    category: "Privacy & Compliance",
    a: "Yes. IntelliAttend adheres strictly to the Digital Personal Data Protection (DPDP) Act and FERPA educational privacy guidelines. All network transmissions use TLS 1.3 encryption, and student databases are secured with bank-grade AES-256 cloud encryption with strict role-based access control.",
    highlight: "DPDP Act & FERPA Compliant • AES-256 Cloud Encryption • Zero Third-Party Tracking"
  },
  {
    q: "What hardware is required for SmartBoard screen pairing in classrooms?",
    category: "Hardware Compatibility",
    a: "IntelliAttend works with virtually any modern interactive classroom display. It runs natively on Android TV/SmartBoards (Android 9.0+), Windows OPS slot-in PCs, LG WebOS displays, and BenQ/Maxhub panels. No expensive proprietary hardware is required.",
    highlight: "Universal Compatibility: Android 9.0+, Windows OPS, LG WebOS, BenQ & Maxhub"
  }
];

export function DocsContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto space-y-20">
      
      {/* Getting Started */}
      <section>
        <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-4">
          Getting Started
        </h2>
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 border border-slate-200 shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Welcome to IntelliAttend
            </h3>
          </div>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6">
            IntelliAttend is an AI-powered campus management platform designed to simplify attendance, classroom management, SmartBoard integration, and academic workflows for educational institutions.
          </p>
          <Link 
            href="/docs/welcome" 
            className="inline-flex text-slate-900 font-bold items-center gap-2 hover:gap-3 transition-all hover:text-slate-700 text-sm"
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Platform Overview */}
      <section>
        <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-6">
          Platform Overview
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {PLATFORM_OVERVIEW.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.link}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all group block"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-2xs border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-slate-700 transition-all" />
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Guides */}
      <section>
        <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-6">
          Quick Guides
        </h2>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {QUICK_GUIDES.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <div key={idx} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    {guide.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section>
        <div className="mb-6">
          <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
            Campus Questions
          </h2>
          <h3 className="text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        {faq.category}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 leading-snug">
                        {faq.q}
                      </h4>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-1">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-3"
                      >
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {faq.a}
                        </p>
                        {faq.highlight && (
                          <div className="text-xs font-semibold text-slate-800 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                            {faq.highlight}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
        </div>
      </section>

      {/* Printable Manuals & Resources Strip */}
      <section className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-slate-900">
              Campus Manuals &amp; Printable Cheat Sheets
            </h4>
            <p className="text-xs text-slate-500">
              Reference documentation designed for staffroom bulletin boards and student orientations.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/docs/welcome"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Getting Started Manual</span>
            </Link>
            <Link
              href="/features"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All 20 Features</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 relative overflow-hidden shadow-xl text-center md:text-left">
        <div className="absolute top-0 right-0 w-80 h-80 bg-slate-800 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Need Dedicated Campus Onboarding?</h3>
            <p className="text-slate-300 text-sm max-w-xl">
              Our engineering team helps autonomous universities and colleges set up SmartBoard pairing, timetable sync, and faculty training workshops.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/#contact"
              className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-sm shadow-md transition-all active:scale-95"
            >
              Schedule Campus Pilot
            </Link>
            <Link
              href="/support"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition-colors"
            >
              Support Center
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
