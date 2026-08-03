"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";

export default function SolutionsOverview() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="pt-40 pb-20 flex items-center justify-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-primary bg-primary/10 mb-6">
              Solutions Overview
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-[#0F172A] sm:text-7xl mb-8">
              Tailored for Your Campus
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#64748B]">
              Discover how IntelliAttend scales and adapts to the unique operational needs of universities, colleges, and K-12 schools.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
