"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, PieChart } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Actionable <span className="text-primary">Insights</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Make data-driven decisions with real-time analytics and comprehensive reporting tools.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm">
            <BarChart3 className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2">Department Trends</h3>
            <p className="text-slate-500 text-sm">Compare attendance and engagement across different departments.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm">
            <TrendingUp className="h-10 w-10 text-secondary mb-4" />
            <h3 className="font-bold text-lg mb-2">Student Progression</h3>
            <p className="text-slate-500 text-sm">Track individual student performance and identify at-risk individuals early.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm">
            <PieChart className="h-10 w-10 text-accent mb-4" />
            <h3 className="font-bold text-lg mb-2">Resource Utilization</h3>
            <p className="text-slate-500 text-sm">Analyze how classroom resources and SmartBoards are being utilized.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
