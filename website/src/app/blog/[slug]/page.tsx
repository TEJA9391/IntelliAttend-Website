import { ARTICLES } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ArticleActions } from "@/components/blog/ArticleActions";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white pt-32 pb-20 selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-slate-300 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="text-[13px] font-black tracking-widest uppercase text-teal-600 mb-4">{article.category}</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
            {article.title}
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-8">
            {article.desc}
          </p>

          <div className="flex items-center justify-between py-6 border-y border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                IA
              </div>
              <div>
                <div className="font-bold text-slate-900">IntelliAttend Team</div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                  <span>Aug 24, 2026</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.read} read</span>
                </div>
              </div>
            </div>
            
            <ArticleActions articleTitle={article.title} articleSlug={article.slug} />
          </div>
        </header>

        {/* Article Body */}
        <div 
          className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

      </div>
    </article>
  );
}
