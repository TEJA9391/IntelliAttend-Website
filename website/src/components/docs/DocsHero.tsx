"use client";

export function DocsHero() {
  return (
    <section className="pt-24 pb-12 bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              IntelliAttend Documentation
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Everything you need to understand IntelliAttend and get started with our intelligent campus management platform.
            </p>
          </div>
          
          <div className="hidden md:block w-72 h-72 bg-gradient-to-br from-slate-200/60 to-slate-100 rounded-full relative">
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-52 h-52 bg-white rounded-3xl shadow-xl rotate-3 border border-slate-200 p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full"></div>
                  <div className="w-3/4 h-3 bg-slate-100 rounded-full"></div>
                  <div className="space-y-2 pt-2">
                    <div className="w-full h-7 bg-slate-50 rounded-lg border border-slate-100 flex items-center px-2 text-[10px] font-mono text-slate-500">
                      POST /api/v1/attendance
                    </div>
                    <div className="w-full h-7 bg-slate-50 rounded-lg border border-slate-100 flex items-center px-2 text-[10px] font-mono text-slate-500">
                      SYNC smartboard.mrcet
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
