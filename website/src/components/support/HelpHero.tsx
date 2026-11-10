"use client";

import { LifeBuoy } from 'lucide-react';

export function HelpHero() {
  return (
    <section className="pt-24 pb-16 bg-[#F8FAFC] border-b border-slate-200 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-sm">
          <LifeBuoy className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-[#0F172A]">
          We&apos;re Here to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Help</span>
        </h1>
        <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto">
          Find answers, troubleshooting guides, and expert support whenever you need it.
        </p>
      </div>
    </section>
  );
}
