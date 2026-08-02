"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ShieldCheck, QrCode, MapPin, BarChart, Smartphone } from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Powerful Features for a <span className="text-primary">Smart Campus</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Discover all the tools IntelliAttend provides to streamline your academic operations, from smart attendance to advanced analytics.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {[
            {
              icon: QrCode,
              title: "Dynamic QR Attendance",
              desc: "Generate time-sensitive QR codes for students to scan. Prevent proxy attendance with rotating codes and location verification."
            },
            {
              icon: MapPin,
              title: "GPS Verification",
              desc: "Ensure students are physically in the classroom by enforcing a geo-fence around the classroom coordinates."
            },
            {
              icon: Smartphone,
              title: "Face Authentication Ready",
              desc: "Leverage on-device biometric hardware for high-security classrooms and exams."
            },
            {
              icon: BarChart,
              title: "Real-time Analytics",
              desc: "Monitor attendance trends, identify at-risk students, and generate comprehensive reports instantly."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800 flex gap-6 items-start"
            >
              <div className="bg-primary/10 p-4 rounded-2xl text-primary shrink-0">
                <feature.icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
