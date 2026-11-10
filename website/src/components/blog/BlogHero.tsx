"use client";

export function BlogHero() {
  return (
    <section className="pt-32 pb-16 bg-[#F8FAFC] text-[#0F172A] relative overflow-hidden border-b border-slate-100">
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-50 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-[#0F172A]">
          Insights for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Smarter Campuses</span>
        </h1>
        <p className="text-lg md:text-xl text-[#64748B] max-w-3xl mx-auto">
          Stay updated with the latest trends in AI-powered education, smart classrooms, digital attendance, campus technology, and the future of learning.
        </p>
      </div>
    </section>
  );
}
