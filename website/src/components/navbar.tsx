"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sparkles, Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { MegaMenuProducts3D } from "./navbar/MegaMenuProducts3D";

const navLinks = [
  { 
    name: "Products", 
    href: "/products", 
    megaTitle: "Explore our next generation platform",
    dropdown: [
      { name: "SmartBoard", href: "/products/smartboard", desc: "Interactive classroom displays" },
      { name: "Faculty", href: "/products/faculty", desc: "Manage classes and attendance" },
      { name: "Student", href: "/products/student", desc: "Track progress and schedules" },
    ]
  },
  { 
    name: "Solutions", 
    href: "/solutions",
    overviewHref: "/products",
    megaTitle: "Solutions tailored to your campus",
    dropdown: [
      { name: "Universities", href: "/solutions/universities", desc: "Scale campus management" },
      { name: "K-12 Schools", href: "/solutions/k12", desc: "Streamline daily operations" },
    ]
  },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { 
    name: "Resources", 
    href: "#",
    megaTitle: "Learn how to use IntelliAttend",
    dropdown: [
      { name: "Documentation", href: "/docs", desc: "Platform guides and API" },
      { name: "Help Center", href: "/support", desc: "24/7 customer support" },
    ]
  },
];

function MagneticButton({ children, className, variant = "primary" }: { children: React.ReactNode, className?: string, variant?: "primary" | "ghost" }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    const xPos = (clientX - (left + width / 2)) * 0.2;
    const yPos = (clientY - (top + height / 2)) * 0.2;
    
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={cn(
        "relative px-6 py-2.5 rounded-full font-medium text-sm transition-colors overflow-hidden group",
        variant === "primary" 
          ? "bg-[#0F172A] text-white hover:bg-[#1E293B]" 
          : "text-[#64748B] hover:text-[#0F172A]",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      )}
    </motion.button>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const headerHeight = useTransform(scrollY, [0, 100], [100, 80]);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  return (
    <motion.header
      style={{ height: headerHeight }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 flex items-center transition-all duration-300",
        isScrolled ? "bg-white/70 backdrop-blur-[18px] border-b border-[#0F172A]/[0.08]" : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full h-full flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <span className="font-bold text-xl text-[#0F172A] tracking-tight">IntelliAttend</span>
        </Link>

        {/* Desktop Links */}
        <nav 
          className="hidden md:flex h-full items-center gap-2"
          onMouseLeave={() => setActiveMenu(null)}
        >
          {navLinks.map((link) => (
            <div 
              key={link.name} 
              className="group/nav flex items-center h-full"
              onMouseEnter={() => setActiveMenu(link.name)}
            >
              <Link 
                href={link.href}
                className="flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors px-4 py-2 rounded-full"
              >
                {link.name}
                {link.dropdown && <ChevronDown className="w-4 h-4 transition-transform group-hover/nav:rotate-180 opacity-50" />}
              </Link>
              
              {link.dropdown && (
                <AnimatePresence>
                  {activeMenu === link.name && link.name === "Products" ? (
                    <MegaMenuProducts3D key="mega-3d" />
                  ) : activeMenu === link.name ? (
                    <motion.div 
                      key="mega-standard"
                      initial={{ opacity: 0, y: -15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute top-full left-0 right-0 w-full z-50 overflow-hidden bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-t border-slate-100"
                    >
                      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6 flex gap-12">
                        {/* Left Column */}
                        <div className="flex-1 border-r border-slate-100 pr-12 flex flex-col justify-between max-w-md">
                          <motion.h3 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ delay: 0.1 }}
                            className="text-2xl tracking-tight font-bold text-[#0F172A] leading-[1.2]"
                          >
                            {link.megaTitle}
                          </motion.h3>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.2 }}
                          >
                            <Link href={link.overviewHref || link.href} className="mt-4 inline-flex items-center justify-center px-5 py-2 bg-slate-50 hover:bg-slate-100 text-sm font-semibold text-slate-700 rounded-full transition-colors self-start">
                              See overview
                            </Link>
                          </motion.div>
                        </div>

                        {/* Right Column (Grid of Links) */}
                        <div className="flex-1 grid grid-cols-1 gap-x-8 gap-y-1">
                          <div className="text-xs font-semibold text-slate-400 mb-1 px-3 uppercase tracking-wider">{link.name}</div>
                          {link.dropdown.map((item, index) => (
                            <Link key={item.name} href={item.href} className="p-3 rounded-2xl hover:bg-slate-50 transition-colors group/item block">
                              <motion.div
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: 0.1 + index * 0.05 }}
                              >
                                <div className="text-sm font-semibold text-slate-900 group-hover/item:text-primary transition-colors">{item.name}</div>
                                <div className="text-[13px] text-slate-500 mt-0.5">{item.desc}</div>
                              </motion.div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <MagneticButton variant="ghost">Login</MagneticButton>
          <MagneticButton variant="primary">Get Started</MagneticButton>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-[#0F172A]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>

      </div>
    </motion.header>
  );
}
