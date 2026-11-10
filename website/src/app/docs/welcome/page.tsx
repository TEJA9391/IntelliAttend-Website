"use client";

import { useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, ShieldCheck, MonitorPlay, Users, Bell, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WelcomeDocPage() {
  const [feedbackState, setFeedbackState] = useState<null | 'submitted'>(null);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          href="/docs" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-slate-300 transition-colors shadow-xs">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          Back to Knowledge Base
        </Link>

        <div className="bg-white rounded-3xl p-8 md:p-14 border border-slate-200 shadow-sm">
          
          {/* Header */}
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-100">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-1">
                Official Getting Started Guide
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Welcome to IntelliAttend
              </h1>
            </div>
          </div>

          <div className="space-y-8 text-slate-700 leading-relaxed">
            
            <p className="text-lg text-slate-600 leading-relaxed font-normal">
              IntelliAttend is an enterprise connected campus operating platform designed for engineering colleges, schools, and autonomous universities. It unifies attendance tracking, wireless SmartBoard screen pairing, parent communication, and regulatory compliance into one cohesive ecosystem.
            </p>

            {/* Core Pillars */}
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-700" />
                The Four Connected Campus Pillars
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2.5 font-bold text-slate-900 mb-1.5 text-sm">
                    <Users className="w-4 h-4 text-slate-700" />
                    Faculty Portal
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    1-tap roll call, wireless SmartBoard pairing, subject homework assignments, and timetable cohort management.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2.5 font-bold text-slate-900 mb-1.5 text-sm">
                    <ShieldCheck className="w-4 h-4 text-slate-700" />
                    Student App
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Dynamic SmartBoard OTP check-in, device binding authentication, 75% attendance tracking, and lecture notes downloads.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2.5 font-bold text-slate-900 mb-1.5 text-sm">
                    <Bell className="w-4 h-4 text-slate-700" />
                    Parent App
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Morning absence notifications and automated daily homework alerts delivered directly to the Parent App at 18:00.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2.5 font-bold text-slate-900 mb-1.5 text-sm">
                    <Building2 className="w-4 h-4 text-slate-700" />
                    Administration &amp; Deans
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Predictive AI dropout risk scoring, regulatory compliance reports (AICTE/NAAC/NBA), and campus ERP synchronization.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Operates */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">
                How Anti-Proxy Verification Works in Classrooms
              </h2>
              <p className="text-slate-600">
                Traditional roll calls waste 15 minutes of every lecture and are prone to proxy attendance and buddy punching. IntelliAttend eliminates proxies using a multi-factor system:
              </p>
              
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Rotating SmartBoard OTP:</strong> A dynamic, time-sensitive 6-digit code rotates on the classroom display screen during the active roll-call window. Code leakage outside class is useless.</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Hardware Device Binding:</strong> Each student login is locked to their verified personal smartphone, preventing one student from signing in on behalf of absent peers.</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Instant Session Locking:</strong> Faculty lock the attendance session the moment roll-call concludes, immediately archiving records and blocking late submissions.</span>
                </li>
              </ul>
            </div>

            {/* Evening Homework Notification Flow */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Daily Evening Homework Notifications for Parents
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                To keep parents proactively informed without manual teacher calling, IntelliAttend provides an automated daily homework pipeline:
              </p>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <strong>16:15 (Dismissal):</strong> Subject teachers log assignments, readings, and project deadlines on the Faculty Portal.
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <strong>18:00 (Evening Alert):</strong> Parents receive an automated notification directly within the Parent App listing all tasks due the following morning.
                </div>
              </div>
            </div>

            {/* Next Steps Buttons */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-sm"
              >
                <span>Browse All Guides &amp; FAQs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
              >
                <span>Schedule Campus Demo</span>
              </Link>
            </div>

            {/* Helpful Feedback Box */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Production Documentation • MRCET Campus Deployment</span>
              
              {feedbackState === 'submitted' ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Feedback recorded</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Was this helpful?</span>
                  <button 
                    onClick={() => setFeedbackState('submitted')}
                    className="px-3 py-1 rounded-md border border-slate-200 hover:bg-slate-100 font-medium cursor-pointer"
                  >
                    Yes
                  </button>
                  <button 
                    onClick={() => setFeedbackState('submitted')}
                    className="px-3 py-1 rounded-md border border-slate-200 hover:bg-slate-100 font-medium cursor-pointer"
                  >
                    No
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
