import { Suspense } from 'react';
import { BlogHero } from "@/components/blog/BlogHero";
import { LatestArticles } from "@/components/blog/LatestArticles";
import { BlogCTA } from "@/components/blog/BlogCTA";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-teal-100 selection:text-slate-500 font-sans">
      
      <main>
        <Suspense fallback={<div className="pt-32 pb-16 bg-[#F8FAFC] min-h-[300px]"></div>}>
          <BlogHero />
        </Suspense>
        
        <div className="container mx-auto px-4 py-16 lg:py-24">
          {/* Main Content (Latest Articles) */}
          <div className="w-full">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight flex items-center gap-3">
              Latest Articles
              <div className="h-px bg-slate-200 flex-1 ml-4"></div>
            </h2>
            <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="h-64 bg-slate-100 rounded-3xl animate-pulse"></div></div>}>
              <LatestArticles />
            </Suspense>
          </div>
        </div>
        
        <BlogCTA />
      </main>
    </div>
  );
}
