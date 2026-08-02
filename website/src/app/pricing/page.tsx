"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PricingPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Simple, <span className="text-primary">Transparent Pricing</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Choose the plan that best fits your institution's size and needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
            <h3 className="font-bold text-xl mb-2">Starter</h3>
            <p className="text-slate-500 text-sm mb-6">Perfect for small schools and individual departments.</p>
            <div className="text-4xl font-bold mb-6">$199<span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Up to 500 Students</li>
              <li className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Basic Attendance Tracking</li>
              <li className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Standard Reports</li>
            </ul>
            <Button variant="outline" className="w-full">Get Started</Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-primary p-8 rounded-2xl shadow-xl shadow-primary/20 flex flex-col text-white relative transform md:-translate-y-4">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-accent text-slate-900 text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
            </div>
            <h3 className="font-bold text-xl mb-2">Professional</h3>
            <p className="text-primary-foreground/80 text-sm mb-6">Ideal for growing colleges and universities.</p>
            <div className="text-4xl font-bold mb-6">$499<span className="text-lg text-primary-foreground/80 font-normal">/mo</span></div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 mr-2 text-white" /> Up to 5,000 Students</li>
              <li className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 mr-2 text-white" /> Advanced Analytics</li>
              <li className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 mr-2 text-white" /> SmartBoard Integration</li>
              <li className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 mr-2 text-white" /> Parent Portal</li>
            </ul>
            <Button className="w-full bg-white text-primary hover:bg-slate-50">Start Free Trial</Button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
            <h3 className="font-bold text-xl mb-2">Enterprise</h3>
            <p className="text-slate-500 text-sm mb-6">Custom solutions for massive university networks.</p>
            <div className="text-4xl font-bold mb-6">Custom</div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Unlimited Students</li>
              <li className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Custom Integrations</li>
              <li className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Dedicated Account Manager</li>
              <li className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> SSO & Advanced Security</li>
            </ul>
            <Button variant="outline" className="w-full">Contact Sales</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
