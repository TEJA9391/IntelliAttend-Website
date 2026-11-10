"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { BarChart3, TrendingUp, PieChart, Maximize2, X, AlertTriangle, Clock } from "lucide-react"

export default function AnalyticsPage() {
  const [isZoomed, setIsZoomed] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-[#0F172A] mb-6">
            AI Analytics & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Insights</span>
          </h1>
          <p className="text-lg text-[#64748B]">
            Empower educators and administrators with predictive attendance forecasting, engagement scoring, and early behavioral risk alerts.
          </p>
        </motion.div>

        {/* Analytics Hero Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="max-w-5xl mx-auto mb-20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-slate-200/80 bg-white p-2 sm:p-4 group cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => setIsZoomed(true)}
        >
          <div className="relative aspect-[1024/571] w-full rounded-2xl overflow-hidden bg-slate-900/[0.02]">
            <Image
              src="/images/products/ai_analytics_mockup.png"
              alt="IntelliAttend AI Analytics & Insights Dashboard"
              fill
              unoptimized
              priority
              className="object-contain rounded-2xl"
            />
            <div className="absolute bottom-3 right-3 z-10 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-md">
              <Maximize2 className="w-3.5 h-3.5" /> Click to Expand
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <TrendingUp className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2 text-[#0F172A]">Attendance Predictive Trends</h3>
            <p className="text-[#64748B] text-sm">Forecast upcoming attendance fluctuations weeks in advance across sections and departments.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <BarChart3 className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2 text-[#0F172A]">Weekly Participation Scores</h3>
            <p className="text-[#64748B] text-sm">Quantify student participation metrics and cognitive engagement scores (up to 87%+).</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <AlertTriangle className="h-10 w-10 text-accent mb-4" />
            <h3 className="font-bold text-lg mb-2 text-[#0F172A]">Behavioral Risk Alerts</h3>
            <p className="text-[#64748B] text-sm">Flag students showing sudden drops in attendance early to prevent defaulter thresholds (&lt;75%).</p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for High-Resolution View */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 cursor-zoom-out"
          >
            <div 
              className="relative max-w-6xl w-auto bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-slate-900/90">
                <span className="text-white font-semibold text-sm">AI Analytics & Insights • Live System Preview</span>
                <button
                  onClick={() => setIsZoomed(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-2 sm:p-4 flex items-center justify-center bg-slate-950 overflow-hidden">
                <img
                  src="/images/products/ai_analytics_mockup.png"
                  alt="AI Analytics & Insights Live Preview"
                  className="max-h-[78vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
