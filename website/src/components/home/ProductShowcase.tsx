"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Monitor, Smartphone, Tablet } from "lucide-react";

export function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 20%",
          end: "bottom 80%",
          scrub: 1,
        }
      });

      tl.fromTo(laptopRef.current, 
        { scale: 0.8, y: 100, rotateX: 20 },
        { scale: 1, y: 0, rotateX: 0, duration: 1 }
      )
      .fromTo(mobileRef.current,
        { scale: 0.8, x: -100, y: 50, opacity: 0 },
        { scale: 1, x: 0, y: 0, opacity: 1, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(tabletRef.current,
        { scale: 0.8, x: 100, y: 50, opacity: 0 },
        { scale: 1, x: 0, y: 0, opacity: 1, duration: 0.8 },
        "-=0.8"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-32 overflow-hidden relative" ref={containerRef}>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#050816] via-primary/5 to-[#050816] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Available on <span className="text-gradient-primary">Every Device</span>
          </h2>
          <p className="text-lg text-slate-400">
            A seamless experience whether you're at your desk, presenting in class, or walking across campus.
          </p>
        </div>

        <div className="relative h-[800px] flex items-center justify-center perspective-1000 mt-20">
          
          {/* Laptop Mockup */}
          <div ref={laptopRef} className="absolute z-20 w-[800px] h-[500px] bg-slate-900 rounded-t-3xl border-8 border-slate-800 shadow-2xl overflow-hidden flex flex-col transform-gpu">
            <div className="h-10 w-full bg-slate-800 flex items-center px-4 border-b border-slate-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>
            <div className="flex-1 p-8 bg-[#0a0f24] relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.02]" />
              <div className="flex gap-6 h-full">
                <div className="w-64 h-full bg-white/5 rounded-xl border border-white/10 p-4 space-y-4">
                  <div className="h-8 w-full bg-white/10 rounded-md" />
                  <div className="h-4 w-3/4 bg-white/5 rounded-md" />
                  <div className="h-4 w-5/6 bg-white/5 rounded-md" />
                  <div className="h-4 w-1/2 bg-white/5 rounded-md" />
                </div>
                <div className="flex-1 space-y-6">
                  <div className="h-32 w-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border border-white/10" />
                  <div className="grid grid-cols-2 gap-6 h-48">
                    <div className="h-full bg-white/5 rounded-xl border border-white/10 p-6 flex flex-col justify-end">
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-primary" />
                      </div>
                    </div>
                    <div className="h-full bg-white/5 rounded-xl border border-white/10 p-6 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border-4 border-accent border-t-transparent animate-spin-slow" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 w-[120%] -left-[10%] h-4 bg-slate-700 rounded-b-xl shadow-xl" />
          </div>

          {/* Mobile Mockup */}
          <div ref={mobileRef} className="absolute z-30 -left-10 bottom-20 w-[280px] h-[580px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl p-2 transform-gpu">
            <div className="w-full h-full bg-[#0a0f24] rounded-[2.5rem] overflow-hidden relative">
              <div className="absolute top-0 w-full flex justify-center pt-2">
                <div className="w-24 h-6 bg-slate-800 rounded-b-xl" />
              </div>
              <div className="mt-12 p-4 space-y-4">
                <div className="h-20 bg-primary/20 rounded-2xl border border-primary/30 p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/50" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-2/3 bg-white/40 rounded-full" />
                    <div className="h-2 w-1/3 bg-white/20 rounded-full" />
                  </div>
                </div>
                <div className="h-32 bg-white/5 rounded-2xl border border-white/10 p-4">
                  <div className="flex justify-between items-end h-full pt-4">
                     {[40, 70, 45, 90, 65, 85].map((h, i) => (
                        <div key={i} style={{height: h + "%"}} className="w-6 bg-accent/40 rounded-t-sm" />
                      ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-16 bg-white/5 rounded-xl border border-white/10" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tablet Mockup */}
          <div ref={tabletRef} className="absolute z-10 -right-20 top-10 w-[500px] h-[700px] bg-slate-900 rounded-[2rem] border-8 border-slate-800 shadow-2xl p-2 transform-gpu">
            <div className="w-full h-full bg-[#0a0f24] rounded-[1.5rem] overflow-hidden p-6">
              <div className="grid grid-cols-2 gap-4 h-full">
                 <div className="space-y-4">
                   <div className="h-40 bg-gradient-to-br from-purple-500/20 to-transparent rounded-2xl border border-purple-500/20" />
                   <div className="h-full bg-white/5 rounded-2xl border border-white/10 p-4">
                      <div className="space-y-4 mt-4">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="h-10 bg-white/5 rounded-lg" />
                        ))}
                      </div>
                   </div>
                 </div>
                 <div className="space-y-4">
                   <div className="h-full bg-white/5 rounded-2xl border border-white/10" />
                   <div className="h-60 bg-primary/10 rounded-2xl border border-primary/20" />
                 </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
