"use client"

import { Button } from "@/components/ui/button"

export function PricingCTA() {
  return (
    <div className="max-w-4xl mx-auto px-6 mb-32 text-center">
      <div className="bg-primary/5 rounded-3xl p-12 border border-primary/10">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Ready to Modernize Your Campus?</h2>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          Join institutions that are simplifying attendance, classroom management, and academic operations with IntelliAttend.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">Schedule a Demo</Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white hover:bg-slate-50 :bg-slate-800">Talk to Sales</Button>
        </div>
      </div>
    </div>
  )
}
