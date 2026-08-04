"use client"

import { Shield, Cloud, Smartphone, Zap, RefreshCw, Headphones } from "lucide-react"

const included = [
  { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption and secure data handling." },
  { icon: Cloud, title: "Cloud Backup", desc: "Automated daily backups to ensure data integrity." },
  { icon: Smartphone, title: "Mobile Apps", desc: "Native iOS and Android apps for students and faculty." },
  { icon: Zap, title: "Real-Time Sync", desc: "Instant updates across all devices and dashboards." },
  { icon: RefreshCw, title: "Automatic Updates", desc: "Always on the latest version with zero downtime." },
  { icon: Headphones, title: "Customer Support", desc: "Dedicated support team ready to assist you." },
]

export function IncludedFeatures() {
  return (
    <div className="max-w-7xl mx-auto px-6 mb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">What's Included in Every Plan</h2>
        <p className="text-slate-600 ">Everything you need to run your institution efficiently.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {included.map((feature, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-slate-500 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
