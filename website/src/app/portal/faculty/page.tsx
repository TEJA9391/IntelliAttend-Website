"use client";

import { Users, MonitorPlay, CalendarDays, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FacultyDashboard() {
  return (
    <>
      {/* Synthetic Data Provenance Notice */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 bg-slate-100 border border-slate-200 uppercase tracking-wider text-[10px] px-2 py-0.5 rounded">
            Synthetic Mock Dataset
          </span>
          <span>Sample demonstration metrics for faculty workflow evaluation. Not connected to active production databases.</span>
        </div>
        <a 
          href="https://dashboard.intelliattend.app/login"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-slate-900 hover:text-slate-700 underline shrink-0 transition-colors"
        >
          Official Faculty SSO &rarr;
        </a>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-slate-500 flex items-center justify-center">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Today&apos;s Classes</div>
              <div className="text-2xl font-bold text-slate-900">3</div>
            </div>
          </div>
          <div className="text-sm text-slate-600 flex justify-between">
            <span>Next: Intro to Computer Science</span>
            <span className="font-semibold text-slate-900">10:00 AM</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Pending Attendance</div>
              <div className="text-2xl font-bold text-slate-900">1 Class</div>
            </div>
          </div>
          <div className="text-sm text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Requires action for CS-101
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MonitorPlay className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">SmartBoard Status</div>
              <div className="text-2xl font-bold text-slate-900">Connected</div>
            </div>
          </div>
          <div className="text-sm text-emerald-600 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Ready for broadcast
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Classes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Today&apos;s Schedule</h2>
            <Link href="#" className="text-sm font-semibold text-slate-500 hover:underline">View all</Link>
          </div>
          
          <div className="space-y-4">
            {[
              { time: "10:00 AM - 11:30 AM", course: "CS-101: Intro to Computer Science", room: "Room 304", status: "Upcoming" },
              { time: "1:00 PM - 2:30 PM", course: "CS-302: Data Structures", room: "Room 112", status: "Upcoming" },
              { time: "3:00 PM - 4:00 PM", course: "Faculty Meeting", room: "Conference Room A", status: "Upcoming" }
            ].map((cls, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                <div>
                  <div className="text-sm font-semibold text-slate-500 mb-1">{cls.time}</div>
                  <div className="font-bold text-slate-900">{cls.course}</div>
                  <div className="text-sm text-slate-500">{cls.room}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors">
                    Mark Attendance
                  </button>
                  <button className="px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2">
                    Start Class <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h3 className="font-bold text-lg mb-2 relative z-10">SmartBoard Cast</h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10">Connect your device to the classroom SmartBoard instantly.</p>
            <button className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 relative z-10">
              <MonitorPlay className="w-5 h-5" /> Connect Now
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Recent Notifications</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0"></div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Department Meeting Moved</div>
                  <div className="text-xs text-slate-500">1 hour ago</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">System Maintenance</div>
                  <div className="text-xs text-slate-500">Yesterday</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
