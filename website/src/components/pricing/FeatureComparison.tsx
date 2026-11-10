"use client"

import { Check, Minus } from "lucide-react"

const features = [
  { name: "Student Portal", school: true, college: true, enterprise: true },
  { name: "Faculty Portal", school: true, college: true, enterprise: true },
  { name: "Automated Attendance", school: true, college: true, enterprise: true },
  { name: "SmartBoard", school: false, college: true, enterprise: true },
  { name: "AI Analytics", school: false, college: true, enterprise: true },
  { name: "Multi Department", school: false, college: true, enterprise: true },
  { name: "Multi Campus", school: false, college: false, enterprise: true },
  { name: "Custom Branding", school: false, college: false, enterprise: true },
  { name: "API Access", school: false, college: true, enterprise: true },
  { name: "SSO", school: false, college: false, enterprise: true },
  { name: "Dedicated Manager", school: false, college: false, enterprise: true },
  { name: "Premium Support", school: false, college: true, enterprise: true },
]

export function FeatureComparison() {
  return (
    <div className="max-w-5xl mx-auto px-6 mb-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] mb-6 tracking-tight">
          What&apos;s included in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">each plan?</span>
        </h2>
        <p className="text-lg text-[#64748B]">
          Compare features across our starter, professional, and enterprise tiers to find the perfect fit for your institution.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-4 px-6 border-b border-slate-200 text-sm font-semibold text-[#0F172A] bg-slate-50 rounded-tl-xl w-1/3">Features</th>
              <th className="py-4 px-6 border-b border-slate-200 text-sm font-semibold text-[#0F172A] bg-slate-50 text-center">School</th>
              <th className="py-4 px-6 border-b border-slate-200 text-sm font-semibold text-[#0F172A] bg-slate-50 text-center">College</th>
              <th className="py-4 px-6 border-b border-slate-200 text-sm font-semibold text-[#0F172A] bg-slate-50 text-center rounded-tr-xl">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, idx) => (
              <tr key={idx} className="hover:bg-slate-50 :bg-slate-900/50 transition-colors">
                <td className="py-4 px-6 border-b border-slate-200 text-sm font-medium text-[#0F172A]">
                  {feature.name}
                </td>
                <td className="py-4 px-6 border-b border-slate-200 text-center">
                  {feature.school ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <Minus className="w-5 h-5 text-slate-300 mx-auto" />}
                </td>
                <td className="py-4 px-6 border-b border-slate-200 text-center">
                  {feature.college ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <Minus className="w-5 h-5 text-slate-300 mx-auto" />}
                </td>
                <td className="py-4 px-6 border-b border-slate-200 text-center">
                  {feature.enterprise ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <Minus className="w-5 h-5 text-slate-300 mx-auto" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
