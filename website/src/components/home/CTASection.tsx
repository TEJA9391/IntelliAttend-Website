"use client";

import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          Ready to transform your campus?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/80 text-lg mb-10 max-w-2xl mx-auto"
        >
          Join thousands of institutions already using IntelliAttend to streamline their academic operations.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="h-14 px-8 text-base font-semibold rounded-full bg-white text-primary hover:bg-slate-50 transition-colors shadow-xl">
            Get Started Now
          </button>
          <button className="h-14 px-8 text-base font-semibold rounded-full border-2 border-white text-white hover:bg-white/10 transition-colors">
            Contact Sales
          </button>
        </motion.div>
      </div>
    </section>
  );
}
