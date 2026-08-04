"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <div className="relative max-w-7xl mx-auto px-6 mb-24 z-10">
      
      {/* Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-white/50 backdrop-blur-md p-1 rounded-full border border-slate-200/50 shadow-sm flex items-center relative">
          <button
            onClick={() => setIsAnnual(false)}
            className={cn(
              "relative px-6 py-2.5 rounded-full text-sm font-semibold transition-colors z-10",
              !isAnnual ? "text-slate-900 " : "text-slate-500 hover:text-slate-900 :text-white"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={cn(
              "relative px-6 py-2.5 rounded-full text-sm font-semibold transition-colors z-10 flex items-center gap-2",
              isAnnual ? "text-slate-900 " : "text-slate-500 hover:text-slate-900 :text-white"
            )}
          >
            Annual <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Save 20%</span>
          </button>
          <motion.div 
            className="absolute top-1 bottom-1 w-1/2 bg-white rounded-full shadow-sm"
            animate={{ left: isAnnual ? "50%" : "4px", width: isAnnual ? "calc(50% - 4px)" : "calc(50% - 4px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* School Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 relative"
        >
          <div className="text-4xl mb-4">🏫</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">School</h3>
          <p className="text-sm text-slate-500 mb-6 min-h-[40px]">Perfect for K–12 Schools and Small Institutions</p>
          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-900 ">₹{isAnnual ? "3,999" : "4,999"}</span>
            <span className="text-slate-500 text-sm">/month</span>
          </div>
          <p className="text-sm font-semibold text-slate-900 mb-4">Includes</p>
          <ul className="space-y-4 mb-8 text-sm text-slate-600 ">
            {["Up to 500 Students", "Faculty Portal", "Student Portal", "QR Attendance", "Timetable Management", "Assignments", "Notifications", "Cloud Storage", "Email Support"].map((feature, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + (i * 0.05) }} className="flex items-start">
                <Check className="w-5 h-5 text-primary shrink-0 mr-3" />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
          <Button variant="outline" className="w-full bg-transparent border-slate-300 hover:bg-slate-100 :bg-slate-800">Start Free Trial</Button>
        </motion.div>

        {/* College Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="bg-white backdrop-blur-xl border-2 border-primary/20 shadow-[0_0_50px_rgba(37,99,235,0.15)] hover:shadow-[0_0_50px_rgba(37,99,235,0.25)] rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
        >
          {/* Subtle blue glow inside */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="absolute top-0 right-8 transform -translate-y-1/2">
            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" /> Most Popular
            </span>
          </div>
          
          <div className="text-4xl mb-4 relative z-10">🎓</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">College</h3>
          <p className="text-sm text-slate-500 mb-6 min-h-[40px] relative z-10">Designed for Colleges & Universities</p>
          <div className="mb-6 relative z-10">
            <span className="text-4xl font-bold text-slate-900 ">Custom Pricing</span>
          </div>
          <p className="text-sm font-semibold text-slate-900 mb-4 relative z-10">Everything in School plus</p>
          <ul className="space-y-4 mb-8 text-sm text-slate-600 relative z-10">
            {["Unlimited Students", "Unlimited Faculty", "SmartBoard Integration", "AI Attendance Analytics", "Department Management", "Resource Library", "Advanced Reports", "API Access", "Priority Support", "Multi-Department Management"].map((feature, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + (i * 0.05) }} className="flex items-start">
                <Check className="w-5 h-5 text-primary shrink-0 mr-3" />
                <span className="font-medium text-slate-700 ">{feature}</span>
              </motion.li>
            ))}
          </ul>
          <Button className="w-full relative z-10 shadow-lg shadow-primary/20">Request Demo</Button>
        </motion.div>

        {/* Enterprise Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 relative"
        >
          <div className="text-4xl mb-4">🏢</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
          <p className="text-sm text-slate-500 mb-6 min-h-[40px]">For Multi-Campus Institutions</p>
          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-900 ">Contact Sales</span>
          </div>
          <p className="text-sm font-semibold text-slate-900 mb-4">Everything in College plus</p>
          <ul className="space-y-4 mb-8 text-sm text-slate-600 ">
            {["Multi-Campus Management", "Custom Branding", "Single Sign-On (SSO)", "Dedicated Account Manager", "On-Premise Deployment", "Custom Integrations", "Advanced Security", "SLA Guarantee", "24×7 Premium Support"].map((feature, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + (i * 0.05) }} className="flex items-start">
                <Check className="w-5 h-5 text-primary shrink-0 mr-3" />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
          <Button variant="outline" className="w-full bg-transparent border-slate-300 hover:bg-slate-100 :bg-slate-800">Contact Sales</Button>
        </motion.div>

      </div>
    </div>
  )
}
