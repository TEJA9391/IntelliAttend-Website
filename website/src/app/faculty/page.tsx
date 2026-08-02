"use client"

import * as React from "react"
import { motion } from "framer-motion"

export default function FacultyPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            For <span className="text-primary">Faculty</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Empower your teaching with tools designed to reduce administrative overhead.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
