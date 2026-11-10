"use client";

import { Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ARTICLES } from '@/lib/blog-data';

export function LatestArticles() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {ARTICLES.map((article, i) => (
        <Link href={`/blog/${article.slug}`} key={i} className="apple-card p-8 group cursor-pointer flex flex-col h-full relative block">
          
          <div className="text-[11px] font-black tracking-widest uppercase text-[#64748B] mb-3 z-10">{article.category}</div>
          <h3 className="text-xl font-extrabold text-[#0F172A] mb-3 group-hover:text-primary transition-colors leading-tight z-10">
            {article.title}
          </h3>
          <p className="text-sm font-medium text-[#64748B] mb-8 flex-1 z-10 leading-relaxed">
            {article.desc}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 z-10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748B]">
              <Clock className="w-4 h-4" /> {article.read} read
            </div>
            <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all uppercase tracking-wide text-[11px] lg:text-xs">
              Read Full Article <ArrowRight className="w-4 h-4" />
            </div>
          </div>
          

        </Link>
      ))}
    </div>
  );
}
