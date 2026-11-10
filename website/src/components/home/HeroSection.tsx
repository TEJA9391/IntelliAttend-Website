"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimation } from "framer-motion";
import { ArrowRight, Presentation, BarChart3, Bell, FileText, Brain, Calendar, MessageCircle, CheckSquare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const floatingCards = [
  { id: 1, icon: Calendar, title: "Today's Classes", color: "text-slate-500", size: "w-48 h-32", initialPos: { x: -120, y: -180 } },
  { id: 2, icon: Presentation, title: "SmartBoard", color: "text-purple-500", size: "w-40 h-40", initialPos: { x: -180, y: 60 } },
  { id: 3, icon: BarChart3, title: "Analytics", color: "text-cyan-500", size: "w-56 h-36", initialPos: { x: 30, y: -30 } },
  { id: 4, icon: Bell, title: "Notifications", color: "text-orange-500", size: "w-40 h-32", initialPos: { x: 200, y: -160 } },
  { id: 6, icon: FileText, title: "Resources", color: "text-pink-500", size: "w-36 h-36", initialPos: { x: -40, y: 220 } },
  { id: 7, icon: Brain, title: "AI Insights", color: "text-teal-500", size: "w-48 h-40", initialPos: { x: 220, y: 120 } },
  { id: 8, icon: MessageCircle, title: "Messages", color: "text-emerald-500", size: "w-40 h-32", initialPos: { x: 120, y: 240 } },
  { id: 9, icon: CheckSquare, title: "Tasks", color: "text-rose-500", size: "w-36 h-36", initialPos: { x: -20, y: -240 } },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FloatingCard({ card, mouseX, mouseY }: { card: any, mouseX: any, mouseY: any }) {
  const { scrollY } = useScroll();
  const yScroll = useTransform(scrollY, [0, 1000], [0, -card.id * 40]);
  const controls = useAnimation();

  useEffect(() => {
    controls.set({ x: card.initialPos.x, y: card.initialPos.y });
  }, [card, controls]);

  useEffect(() => {
    let hasAnimated = false;
    return scrollY.on("change", (latest) => {
      if (latest < 20 && !hasAnimated) {
        controls.start({ x: card.initialPos.x, y: card.initialPos.y, transition: { type: "spring", stiffness: 200, damping: 20 } });
        hasAnimated = true;
      } else if (latest >= 20) {
        hasAnimated = false;
      }
    });
  }, [scrollY, controls, card]);

  const xParallax = useSpring(useTransform(mouseX, [-1000, 1000], [-50, 50]), { stiffness: 50, damping: 20 });
  const yParallax = useSpring(useTransform(mouseY, [-1000, 1000], [-50, 50]), { stiffness: 50, damping: 20 });
  const rotateX = useSpring(useTransform(mouseY, [-1000, 1000], [10, -10]));
  const rotateY = useSpring(useTransform(mouseX, [-1000, 1000], [-10, 10]));
  
  return (
    <motion.div style={{ y: yScroll }} className="absolute inset-0 pointer-events-none">
      <motion.div style={{ x: xParallax, y: yParallax }} className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div
          animate={controls}
          style={{ rotateX, rotateY }}
          className={cn(
            "absolute glass-card rounded-3xl p-6 flex flex-col justify-between shadow-2xl transition-shadow hover:shadow-[0_20px_50px_rgba(45,212,191,0.15)] z-10 cursor-grab active:cursor-grabbing pointer-events-auto",
            card.size
          )}
          drag
          dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
          dragElastic={0.2}
          whileHover={{ scale: 1.05, zIndex: 50 }}
          whileDrag={{ scale: 1.1, zIndex: 50 }}
        >
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-[#F8FAFC]", card.color)}>
            <card.icon className="w-6 h-6" />
          </div>
          <div>
            <div className="h-1.5 w-12 bg-[#F8FAFC] rounded-full mb-2" />
            <h3 className="font-semibold text-[#0F172A]">{card.title}</h3>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section ref={containerRef} className="relative pt-32 lg:pt-40 pb-20 lg:pb-32 overflow-hidden flex items-center bg-white perspective-1000">

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-fluid-hero items-center">
          
          {/* Left Side: Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-fluid-gap max-w-2xl"
          >
            <h1 className="text-fluid-hero font-bold tracking-tight text-[#0F172A] leading-[1.05]">
              The Intelligent Campus Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">for Modern Institutions.</span>
            </h1>
            
            <p className="text-fluid-p text-[#64748B] leading-relaxed font-normal">
              From 1-tap attendance and timetable scheduling to fee payments and SmartBoard displays—run your entire campus from one unified platform at your fingertips.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/get-started">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-[#0F172A] text-white rounded-full font-medium shadow-xl shadow-teal-900/10 hover:bg-[#1E293B] transition-colors flex items-center gap-2 text-lg cursor-pointer"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white border border-[#0F172A]/[0.08] text-[#0F172A] rounded-full font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 text-lg shadow-sm cursor-pointer"
              >
                Live Demo
              </motion.button>
            </div>

            <div className="pt-12 border-t border-[#0F172A]/[0.08] mt-4">
              <p className="text-sm font-medium text-[#64748B] uppercase tracking-wider mb-6">Trusted By</p>
              <div className="flex items-center gap-8">
                 <div className="text-xl font-bold text-[#0F172A]/40">Universities</div>
                 <div className="text-xl font-bold text-[#0F172A]/40">Colleges</div>
                 <div className="text-xl font-bold text-[#0F172A]/40">Schools</div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Interactive 3D Cards */}
          <div className="relative h-[600px] w-full hidden lg:block preserve-3d -translate-y-12 lg:-translate-y-24">
            {floatingCards.map((card) => (
              <FloatingCard key={card.id} card={card} mouseX={mouseX} mouseY={mouseY} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
