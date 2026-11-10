"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { MegaMenuProducts3D } from "@/components/navbar/MegaMenuProducts3D";

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
  { name: "Join", href: "/join" },
  { name: "Blog", href: "/blog" },
  { 
    name: "Resources", 
    href: "/docs",
    megaTitle: "Learn how to use IntelliAttend",
    dropdown: [
      { name: "Documentation", href: "/docs", desc: "Platform guides and API" },
      { name: "Help Center", href: "/support", desc: "24/7 customer support" },
    ]
  },
];

function NavButton({ children, className, variant = "primary" }: { children: React.ReactNode, className?: string, variant?: "primary" | "ghost" | "outline" }) {
  return (
    <button
      className={cn(
        "relative px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-150 overflow-hidden hover:scale-105 active:scale-95 cursor-pointer",
        variant === "primary" 
          ? "bg-[#0F172A] text-white shadow-lg" 
          : variant === "outline"
          ? "border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm"
          : "text-[#64748B] hover:text-[#0F172A]",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { scrollY } = useScroll();
  const headerHeight = useTransform(scrollY, [0, 100], [80, 72]);
  const pathname = usePathname();

  const cancelPendingMenuAction = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseEnter = (link: (typeof navLinks)[number]) => {
    cancelPendingMenuAction();
    if (!("dropdown" in link) || !link.dropdown) {
      timeoutRef.current = setTimeout(() => {
        setActiveMenu(null);
      }, 220);
      return;
    }
    if (activeMenu === link.name) {
      return;
    }
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(link.name);
    }, activeMenu ? 90 : 60);
  };

  const handleMouseLeaveHeader = () => {
    cancelPendingMenuAction();
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      cancelPendingMenuAction();
    };
  }, []);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(prev => {
        const isNowScrolled = latest > 20;
        return prev === isNowScrolled ? prev : isNowScrolled;
      });
    });
  }, [scrollY]);

  useEffect(() => {
    setActiveMenu(null);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/get-started') || pathname?.startsWith('/portal')) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            style={{ top: headerHeight }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 bg-[#0F172A]/20 backdrop-blur-[24px] pointer-events-none"
          />
        )}
      </AnimatePresence>
      <motion.header
        style={{ height: headerHeight }}
        onMouseEnter={cancelPendingMenuAction}
        onMouseLeave={handleMouseLeaveHeader}
        className={cn(
          "fixed top-0 inset-x-0 z-50 flex items-center transition-all duration-150",
          (activeMenu || isMobileMenuOpen) ? "bg-white" :
          isScrolled ? "bg-white/95 backdrop-blur-[18px] border-b border-[#0F172A]/[0.08]" : "bg-transparent"
        )}
      >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full h-full flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" onClick={() => setActiveMenu(null)} className="flex items-center gap-2 group">
          <Image src="/images/logo.png" alt="IntelliAttend" width={32} height={32} className="w-8 h-8 object-contain" />
          <span className="font-bold text-xl text-[#0F172A] tracking-tight">IntelliAttend</span>
        </Link>

        {/* Desktop Links */}
        <nav 
          className="hidden md:flex h-full items-center gap-2"
        >
          {navLinks.map((link) => (
            <div 
              key={link.name} 
              className="group/nav flex items-center h-full"
            >
              <Link 
                href={link.href}
                onMouseEnter={() => handleMouseEnter(link)}
                onMouseLeave={() => {
                  if (!activeMenu) cancelPendingMenuAction();
                }}
                onClick={() => setActiveMenu(null)}
                className="flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors px-4 py-2 rounded-full"
              >
                {link.name}
                {link.dropdown && <ChevronDown className={cn("w-4 h-4 transition-transform duration-300 opacity-50", activeMenu === link.name && "rotate-180")} />}
              </Link>
              
              {link.dropdown && (
                <>
                  {link.name === "Products" ? (
                    <MegaMenuProducts3D
                      isOpen={activeMenu === "Products"}
                      onMouseEnter={cancelPendingMenuAction}
                      onClose={() => setActiveMenu(null)}
                    />
                  ) : (
                    <AnimatePresence>
                      {activeMenu === link.name && (
                        <motion.div 
                          key="mega-standard"
                          onMouseEnter={cancelPendingMenuAction}
                          initial={{ opacity: 0, y: -15, filter: "blur(8px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
                          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                          className="absolute top-full left-0 right-0 w-full z-50 overflow-hidden bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
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
                              {link.overviewHref && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }} 
                                  animate={{ opacity: 1, y: 0 }} 
                                  transition={{ delay: 0.1 }}
                                >
                                  <Link href={link.overviewHref} onClick={() => setActiveMenu(null)} className="mt-4 inline-flex items-center justify-center px-5 py-2 bg-slate-50 hover:bg-slate-100 text-sm font-semibold text-slate-700 rounded-full transition-colors self-start">
                                    See overview
                                  </Link>
                                </motion.div>
                              )}
                            </div>

                            {/* Right Column (Grid of Links) */}
                            <div className="flex-1 grid grid-cols-1 gap-x-8 gap-y-1">
                              <div className="text-xs font-semibold text-slate-400 mb-1 px-3 uppercase tracking-wider">{link.name}</div>
                              {link.dropdown.map((item, index) => (
                                <Link key={item.name} href={item.href} onClick={() => setActiveMenu(null)} className="p-3 rounded-2xl hover:bg-slate-50 transition-colors group/item block">
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                  >
                                    <div className="text-sm font-semibold text-slate-900 group-hover/item:text-slate-500 transition-colors">{item.name}</div>
                                    <div className="text-[13px] text-slate-500 mt-0.5">{item.desc}</div>
                                  </motion.div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <NavButton variant="outline">Login</NavButton>
          </Link>
          <Link href="/get-started">
            <NavButton variant="primary">Get Started</NavButton>
          </Link>
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
    
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            style={{ top: headerHeight }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 bg-white md:hidden overflow-y-auto border-t border-slate-100/50"
          >
            <div className="px-8 py-8 flex flex-col gap-6">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.02, duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-slate-100/60 pb-4"
                >
                  {link.dropdown ? (
                    <div>
                      <button
                        onClick={() => setExpandedMobile(expandedMobile === link.name ? null : link.name)}
                        className="w-full flex items-center justify-between text-[24px] font-bold text-[#0F172A] tracking-tight"
                      >
                        {link.name}
                        <ChevronDown className={cn("w-6 h-6 text-slate-400 transition-transform duration-300", expandedMobile === link.name && "rotate-180")} />
                      </button>
                      <AnimatePresence>
                        {expandedMobile === link.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 pb-2 flex flex-col gap-4 pl-2">
                              <Link 
                                href={link.overviewHref || link.href}
                                className="text-sm font-semibold text-primary mb-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                View All {link.name} &rarr;
                              </Link>
                              {link.dropdown.map(sub => (
                                <Link
                                  key={sub.name}
                                  href={sub.href}
                                  className="group flex flex-col"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <span className="text-lg font-semibold text-slate-800 group-hover:text-primary transition-colors">{sub.name}</span>
                                  <span className="text-sm text-slate-500">{sub.desc}</span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-[24px] font-bold text-[#0F172A] tracking-tight block"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: navLinks.length * 0.02, duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-4"
              >
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="w-full py-4 text-center font-semibold text-[#0F172A] bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl">
                    Login
                  </div>
                </Link>
                <Link href="/get-started" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="w-full py-4 text-center font-semibold text-white bg-[#0F172A] rounded-2xl">
                    Get Started
                  </div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
