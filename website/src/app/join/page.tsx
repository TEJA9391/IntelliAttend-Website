"use client";

import { motion } from "framer-motion";
import { MonitorPlay, Database, BrainCircuit, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function JoinPage() {


  return (
    <div className="min-h-screen bg-slate-50 pt-[calc(var(--spacing-fluid-hero)+4rem)] pb-24">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >

          <h1 className="text-5xl md:text-7xl font-bold text-[#0F172A] tracking-tight mb-8">
            Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">future of education</span>
          </h1>
          <p className="text-xl text-[#64748B] leading-relaxed">
            Join IntelliAttend and help us transform how schools and universities manage their daily operations. We're looking for passionate people to join our mission.
          </p>
        </motion.div>
      </div>

      {/* Why Partner With Us */}
      <div className="bg-white py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A]">Why Integrate with IntelliAttend?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <MonitorPlay className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">SmartBoard &amp; Screen Pairing</h3>
              <p className="text-[#64748B]">Connect interactive flat panels, digital podiums, and classroom displays seamlessly to the IntelliAttend cloud with real-time PIN &amp; OTP pairing.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">University ERP Sync</h3>
              <p className="text-[#64748B]">Two-way interoperability with existing student information systems, fee portals, and academic calendars with zero manual export friction.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">AI &amp; Automation Plugins</h3>
              <p className="text-[#64748B]">Co-develop customized attendance predictors, behavioral analytics, timetable schedulers, and automated emergency alert channels.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Partnership Block */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
        <div className="p-12 rounded-[2rem] bg-[#0F172A] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Integrate with the IntelliAttend Platform</h2>
            <p className="text-slate-400 text-lg max-w-xl">Connect your classroom hardware or campus management tools directly to our unified APIs and pilot ecosystem.</p>
          </div>
          <Link href="/contact" className="relative z-10 px-8 py-4 bg-white text-[#0F172A] font-semibold rounded-full hover:bg-slate-100 transition-colors whitespace-nowrap inline-block text-center">
            Become a Tech Partner
          </Link>
        </div>
      </div>
    </div>
  );
}
