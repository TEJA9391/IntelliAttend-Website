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
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] mb-6 tracking-tight">
          Everything you need <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">is included</span>
        </h2>
        <p className="text-lg text-[#64748B]">
          Every IntelliAttend plan comes with our core suite of powerful campus management tools. You never have to pay extra for the essentials.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {included.map((feature, idx) => (
          <div key={idx} className="apple-card p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">{feature.title}</h3>
            <p className="text-[#64748B] text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
