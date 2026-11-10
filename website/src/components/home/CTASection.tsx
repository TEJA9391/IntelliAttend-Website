"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-32 bg-primary relative overflow-hidden">
      {/* Top Wave */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] z-0">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[120px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>

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
          className="text-white/90 text-lg mb-10 max-w-2xl mx-auto"
        >
          Partner with IntelliAttend to bring modern digital attendance, smart classroom displays, and paperless operations to your institution.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <Link href="/get-started">
            <button className="h-14 px-10 text-base font-semibold rounded-full bg-white text-slate-700 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-150 shadow-xl hover:shadow-2xl cursor-pointer">
              Get Started Now
            </button>
          </Link>
        </motion.div>
      </div>

    </section>
  );
}
