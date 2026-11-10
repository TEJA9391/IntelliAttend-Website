"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PricingCTA() {
  return (
    <section className="bg-primary/5 relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-24 mt-20">
      {/* Top Wave */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] z-0">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[120px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>

      <div className="mx-auto max-w-4xl px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-6">Ready to Modernize Your Campus?</h2>
        <p className="text-lg text-[#64748B] mb-8 max-w-2xl mx-auto">
          Join institutions that are simplifying attendance, classroom management, and academic operations with IntelliAttend.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer">
            <Link href="/#contact">Schedule a Demo</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-white hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer">
            <Link href="/#contact">Talk to Sales</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
