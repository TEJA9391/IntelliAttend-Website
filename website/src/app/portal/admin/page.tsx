"use client";

import { Users, Building2, BarChart3, TrendingUp, AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  return (
    <>
      {/* Synthetic Data Provenance Notice */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 bg-slate-100 border border-slate-200 uppercase tracking-wider text-[10px] px-2 py-0.5 rounded">
            Synthetic Mock Dataset
          </span>
          <span>Sample demonstration metrics for administrator role evaluation. Not connected to active production databases.</span>
        </div>
        <a 
          href="https://dashboard.intelliattend.app/login"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-slate-900 hover:text-slate-700 underline shrink-0 transition-colors"
        >
          Official Institutional SSO &rarr;
        </a>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-slate-500">Total Students</div>
            <Users className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">1,042</div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Active Enrollment
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-slate-500">Total Faculty</div>
            <Building2 className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">31</div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Assigned Departments
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-slate-500">Avg Attendance</div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">73.7%</div>
          <div className="text-xs text-amber-600 font-bold flex items-center gap-1">
            Overall Campus
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-slate-500">Defaulters (&lt;75%)</div>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-3xl font-bold text-rose-600 mb-1">837</div>
          <div className="text-xs text-slate-500 font-medium">Below exam threshold</div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Analytics Chart Mockup */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Campus Attendance Trends</h2>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-80 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-violet-600"></div>
                  <span className="text-sm font-medium text-slate-600">Science</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                  <span className="text-sm font-medium text-slate-600">Arts</span>
                </div>
              </div>
              <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-1.5 focus:outline-none">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Semester</option>
              </select>
            </div>
            
            {/* Simulated Bar Chart */}
            <div className="flex-1 flex items-end justify-between px-2 pb-4">
              {[40, 70, 55, 90, 80, 65, 85].map((h, i) => (
                <div key={i} className="flex flex-col gap-1 items-center w-12 group">
                  <div className="w-full flex gap-1 items-end h-40">
                    <div className="w-1/2 bg-violet-600 rounded-t-sm transition-all group-hover:opacity-80" style={{ height: `${h}%` }}></div>
                    <div className="w-1/2 bg-teal-400 rounded-t-sm transition-all group-hover:opacity-80" style={{ height: `${h - 15}%` }}></div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center hover:border-violet-500 hover:text-violet-600 transition-colors group">
              <Users className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-violet-600" />
              <div className="text-sm font-bold">Add User</div>
            </button>
            <button className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center hover:border-violet-500 hover:text-violet-600 transition-colors group">
              <BarChart3 className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-violet-600" />
              <div className="text-sm font-bold">Run Report</div>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">System Alerts</h3>
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md">3 New</span>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="p-4 flex gap-3 hover:bg-slate-50 cursor-pointer">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-slate-900">SmartBoard Offline</div>
                  <div className="text-xs text-slate-500">Room 302 lost connection.</div>
                </div>
              </div>
              <div className="p-4 flex gap-3 hover:bg-slate-50 cursor-pointer">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-slate-900">API Rate Limit</div>
                  <div className="text-xs text-slate-500">Student app sync delayed.</div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
              <Link href="#" className="text-sm font-semibold text-violet-600 hover:underline">View all alerts</Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
