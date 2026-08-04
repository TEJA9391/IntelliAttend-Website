"use client"

import { Check, Minus } from "lucide-react"

const features = [
  { name: "Student Portal", school: true, college: true, enterprise: true },
  { name: "Faculty Portal", school: true, college: true, enterprise: true },
  { name: "QR Attendance", school: true, college: true, enterprise: true },
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
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Compare all features</h2>
        <p className="text-slate-600 ">See exactly what's included in each plan.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-4 px-6 border-b border-slate-200 text-sm font-semibold text-slate-900 bg-slate-50 rounded-tl-xl w-1/3">Features</th>
              <th className="py-4 px-6 border-b border-slate-200 text-sm font-semibold text-slate-900 bg-slate-50 text-center">School</th>
              <th className="py-4 px-6 border-b border-slate-200 text-sm font-semibold text-slate-900 bg-slate-50 text-center">College</th>
              <th className="py-4 px-6 border-b border-slate-200 text-sm font-semibold text-slate-900 bg-slate-50 text-center rounded-tr-xl">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, idx) => (
              <tr key={idx} className="hover:bg-slate-50 :bg-slate-900/50 transition-colors">
                <td className="py-4 px-6 border-b border-slate-200 text-sm font-medium text-slate-700 ">
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
