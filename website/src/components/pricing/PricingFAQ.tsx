"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "Is there a free trial?",
    answer: "Yes. Experience IntelliAttend with a fully featured trial before making a decision."
  },
  {
    question: "Can we migrate from our current system?",
    answer: "Yes. Our team assists with secure migration of students, faculty, attendance records, and academic data."
  },
  {
    question: "Can pricing be customized?",
    answer: "Absolutely. We offer tailored plans based on institution size, campus count, and required features."
  },
  {
    question: "Does IntelliAttend support multiple campuses?",
    answer: "Yes. Enterprise plans are designed for institutions managing multiple campuses from one platform."
  },
  {
    question: "Is SmartBoard integration included?",
    answer: "SmartBoard integration is available in College and Enterprise plans."
  }
]

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="max-w-3xl mx-auto px-6 mb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none"
            >
              <span className="font-semibold text-[#0F172A]">{faq.question}</span>
              <ChevronDown className={cn("w-5 h-5 text-[#64748B] transition-transform duration-150", openIndex === idx && "rotate-180")} />
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="px-6 pb-4 text-[#64748B]">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
