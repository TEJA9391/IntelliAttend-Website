"use client";

import { CalendarDays, CheckSquare, BookOpen, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  return (
    <>
      {/* Synthetic Data Provenance Notice */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 bg-slate-100 border border-slate-200 uppercase tracking-wider text-[10px] px-2 py-0.5 rounded">
            Synthetic Mock Dataset
          </span>
          <span>Sample demonstration metrics for student app evaluation. Not connected to active production databases.</span>
        </div>
        <a 
          href="https://dashboard.intelliattend.app/login"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-slate-900 hover:text-slate-700 underline shrink-0 transition-colors"
        >
          Official Student SSO &rarr;
        </a>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Overall Attendance</div>
              <div className="text-2xl font-bold text-slate-900">92%</div>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }}></div>
          </div>
          <div className="text-xs text-slate-500 mt-2">You are above the 75% requirement.</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-slate-500 flex items-center justify-center">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Classes Today</div>
              <div className="text-2xl font-bold text-slate-900">2</div>
            </div>
          </div>
          <div className="text-sm text-slate-600 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" /> Next: Physics 101 at 1:00 PM
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Pending Assignments</div>
              <div className="text-2xl font-bold text-slate-900">1</div>
            </div>
          </div>
          <div className="text-sm text-amber-600 font-medium">
            Due in 2 days
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Classes */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Upcoming Timetable</h2>
            <Link href="#" className="text-sm font-semibold text-emerald-600 hover:underline">Full Schedule</Link>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
              <div className="w-16 shrink-0 text-center">
                <div className="text-sm font-bold text-slate-900">1:00</div>
                <div className="text-xs text-slate-500">PM</div>
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900">Physics 101</div>
                <div className="text-sm text-slate-500">Dr. Smith â€¢ Science Block A</div>
              </div>
            </div>
            <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
              <div className="w-16 shrink-0 text-center">
                <div className="text-sm font-bold text-slate-900">3:30</div>
                <div className="text-xs text-slate-500">PM</div>
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900">Calculus II</div>
                <div className="text-sm text-slate-500">Prof. Johnson â€¢ Room 402</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Resources */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Resources</h2>
            <Link href="#" className="text-sm font-semibold text-emerald-600 hover:underline">View all</Link>
          </div>

          <div className="grid gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-emerald-200 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Physics Midterm Study Guide.pdf</div>
                <div className="text-xs text-slate-500">Uploaded 2 hours ago</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-emerald-200 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-slate-500 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Calculus Worksheet 5.docx</div>
                <div className="text-xs text-slate-500">Uploaded yesterday</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
