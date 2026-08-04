"use client"

import { motion } from "framer-motion"

export function PricingHero() {
  return (
    <div className="relative pt-32 pb-16 text-center max-w-4xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
          Simple Pricing.<br />Built for Every Institution.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Choose a plan that scales with your institution—from small schools to large multi-campus universities.
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium text-slate-600 ">
          <span className="flex items-center"><span className="text-primary mr-2">•</span> No hidden fees</span>
          <span className="flex items-center"><span className="text-primary mr-2">•</span> Secure Cloud</span>
          <span className="flex items-center"><span className="text-primary mr-2">•</span> Free Migration</span>
          <span className="flex items-center"><span className="text-primary mr-2">•</span> Dedicated Support</span>
        </div>
      </motion.div>
    </div>
  )
}
