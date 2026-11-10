import { ArrowRight, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export function BlogCTA() {
  return (
    <section className="bg-[#F8FAFC] relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-24">
      {/* Top Wave */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] z-0">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[120px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-teal-50 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
        <div className="w-20 h-20 bg-white shadow-xl shadow-slate-200/50 border border-slate-100 text-primary rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 transform -rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-150">
          <BrainCircuit className="w-10 h-10" />
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-6 tracking-tight">
          Empowering educators and institutions with knowledge, innovation, and intelligent campus solutions.
        </h2>
        <p className="text-xl text-[#64748B] mb-10 font-medium max-w-2xl mx-auto">
          Ready to transform your campus? Discover how IntelliAttend can modernize your academic infrastructure today.
        </p>
        <Link href="/book-demo" className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all">
          Book a Live Demo <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
