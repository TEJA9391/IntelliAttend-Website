import type { Metadata } from "next";
import { Building, Users, Target, Heart, Layers, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | IntelliAttend",
  description: "Learn about IntelliAttend's mission to transform higher education and campus management with 1-tap attendance and connected SmartBoards.",
};

const values = [
  { 
    icon: Target, 
    title: "Mission-Driven", 
    desc: "Dedicated to eliminating paper registers, manual attendance compilations, and classroom friction through intelligent campus automation." 
  },
  { 
    icon: Users, 
    title: "Faculty & Student First", 
    desc: "Designed hand-in-hand with engineering faculty and students to solve real daily bottlenecks in actual lecture halls and labs." 
  },
  { 
    icon: Layers, 
    title: "Modern Architecture", 
    desc: "Built with zero-hardware-lock-in—synchronizing SmartBoards, mobile devices, and cloud databases seamlessly via open web standards." 
  },
  { 
    icon: Building, 
    title: "Rooted in Real Classrooms", 
    desc: "Developed and piloted with faculty feedback from Malla Reddy Colleges in Hyderabad to build practical tools that educators truly use." 
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-40 pb-20 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
            <Building className="w-4 h-4" /> The IntelliAttend Story
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#0F172A] mb-6 tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">IntelliAttend</span>
          </h1>
          <p className="text-xl text-[#64748B] max-w-3xl mx-auto leading-relaxed">
            We are building the connected campus operating platform for modern institutions—bringing 1-tap roll-calls, SmartBoard displays, fee tracking, and academic records together at your fingertips.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-8 text-center">Our Story</h2>
            
            <div className="space-y-6 text-lg text-[#64748B] leading-relaxed">
              <p>
                IntelliAttend was born from a simple, frustrating observation inside everyday engineering classrooms: campus management and daily operations shouldn&apos;t be lost in manual paperwork.
              </p>
              <p>
                In virtually every lecture, professors would spend the first 10 to 15 minutes calling out roll numbers from paper binders. When it came time to present slides or notes, faculty struggled with USB drives, HDMI dongles, and incompatible display drivers. At the end of every month, departmental staff spent long hours manually tallying attendance records to calculate 75% student eligibility.
              </p>
              <p>
                We built IntelliAttend to replace that fragmented patchwork with one unified, modern system. Developed and refined with direct pilot feedback from engineering educators at Malla Reddy Colleges (Hyderabad), IntelliAttend enables faculty to take session roll-calls in seconds, project lecture notes directly to SmartBoards via any web browser, and track campus eligibility in real time.
              </p>
              <p className="font-semibold text-slate-800">
                Our vision is straightforward: remove administrative friction so professors can focus on teaching, students stay informed, and institutions operate with fingertip clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#F8FAFC] border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">Our Core Values</h2>
            <p className="text-slate-500 text-lg">
              The principles guiding every module and feature we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-3">{value.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-20 bg-white border border-slate-200 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto shadow-sm">
            <h3 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-4">
              Experience the Connected Campus
            </h3>
            <p className="text-[#64748B] text-lg mb-8">
              Explore how IntelliAttend can simplify daily operations at your college or school.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md w-full sm:w-auto"
              >
                Explore Modules
              </Link>
              <Link
                href="/#contact"
                className="px-8 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all w-full sm:w-auto"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
