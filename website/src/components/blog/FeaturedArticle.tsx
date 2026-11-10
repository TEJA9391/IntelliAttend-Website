import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function FeaturedArticle() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Link href="/blog/how-ai-is-transforming-modern-campus-management" className="apple-card p-4 flex flex-col lg:flex-row gap-8 items-center relative group cursor-pointer block">
          
          {/* Image Side */}
          <div className="w-full lg:w-[55%] aspect-video rounded-3xl overflow-hidden relative border border-slate-100 flex items-center justify-center">
             <Image 
               src="/images/featured_ai_campus.png" 
               alt="AI Transforming Campus Management" 
               fill
               className="object-cover transform group-hover:scale-105 transition-transform duration-150"
             />
             <div className="absolute inset-0 bg-teal-900/10 mix-blend-overlay group-hover:bg-transparent transition-colors duration-150 z-10"></div>
             <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase text-slate-500 shadow-sm z-20 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span> Featured Article
             </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-[45%] flex flex-col justify-center pr-4 lg:pr-8 pb-4 lg:pb-0">
            <div className="flex items-center gap-4 text-sm font-bold text-[#64748B] mb-6">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full border border-primary/20">AI in Education</span>
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 6 min read</div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0F172A] mb-4 group-hover:text-primary transition-colors tracking-tight leading-tight">
              How AI Is Transforming Modern Campus Management
            </h2>
            <p className="text-[#64748B] text-lg mb-8 leading-relaxed font-medium">
              Discover how artificial intelligence is helping universities automate attendance, improve classroom engagement, and streamline academic operations.
            </p>
            <div className="flex items-center gap-2 text-primary font-extrabold group-hover:gap-4 transition-all uppercase tracking-wide text-sm">
              Read Full Article <ArrowRight className="w-5 h-5" />
            </div>
          </div>

        </Link>
      </div>
    </section>
  );
}
