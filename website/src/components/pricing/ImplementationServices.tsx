"use client"

import { CheckCircle2 } from "lucide-react"

const services = [
  "Platform Setup",
  "Faculty Training",
  "Data Migration",
  "Student Import",
  "SmartBoard Configuration",
  "Technical Support"
]

export function ImplementationServices() {
  return (
    <div className="max-w-4xl mx-auto px-6 mb-24">
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl font-bold mb-4">Deployment & Onboarding</h2>
          <p className="text-slate-400">Included with College and Enterprise plans. We ensure a seamless transition.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 relative z-10">
          {services.map((service, idx) => (
            <div key={idx} className="flex items-center space-x-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <CheckCircle2 className="text-primary w-6 h-6 shrink-0" />
              <span className="font-medium">{service}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
