"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SOCIAL_LINKS = [
  {
    name: "X (Twitter)",
    href: "https://x.com/intelliattend",
    ariaLabel: "Follow IntelliAttend on X",
    icon: (
      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  {
    name: "Discord",
    href: "https://discord.com/users/1563078786646540319",
    ariaLabel: "Join IntelliAttend on Discord",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    )
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/intelliattend/",
    ariaLabel: "Connect with IntelliAttend on LinkedIn",
    icon: (
      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
      </svg>
    )
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/intelliattend?utm_source=ig_web_button_share_sheet&psln=ZDNlZDc0MzIxNw==",
    ariaLabel: "Follow IntelliAttend on Instagram",
    icon: (
      <svg className="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    )
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@intelliattend-45",
    ariaLabel: "Watch IntelliAttend on YouTube",
    icon: (
      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  }
];

export function Footer() {
  const pathname = usePathname();

  if (
    pathname?.startsWith('/login') || 
    pathname?.startsWith('/register') || 
    pathname?.startsWith('/get-started') || 
    pathname?.startsWith('/portal')
  ) {
    return null;
  }

  const handleOpenChat = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-chat"));
    }
  };

  const handleOpenFeedback = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("intelliattend:open-feedback"));
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-16">
          
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <Image 
                src="/images/logo.png" 
                alt="IntelliAttend" 
                width={32} 
                height={32} 
                className="w-8 h-8 object-contain" 
              />
              <span className="font-bold text-xl text-[#0F172A] tracking-tight">IntelliAttend</span>
            </Link>
            <p className="text-sm text-[#64748B] mb-5 max-w-sm leading-relaxed">
              The connected campus operating platform for colleges, schools, and autonomous universities. Unified attendance, SmartBoard displays, and automated compliance.
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-[#64748B]">
              <p className="font-semibold text-slate-800">Hyderabad, Telangana, India</p>
              <p className="text-slate-500">Pilot deployments active across Malla Reddy Colleges</p>
            </div>
          </div>

          {/* Platform & Products */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A] mb-4">Products</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products/smartboard" className="text-[#64748B] hover:text-[#0F172A] transition-colors">SmartBoard Screen</Link></li>
              <li><Link href="/products/faculty" className="text-[#64748B] hover:text-[#0F172A] transition-colors">Faculty Portal</Link></li>
              <li><Link href="/products/student" className="text-[#64748B] hover:text-[#0F172A] transition-colors">Student App</Link></li>
              <li><Link href="/analytics" className="text-[#64748B] hover:text-[#0F172A] transition-colors">AI Analytics</Link></li>
            </ul>
          </div>

          {/* Institutional Solutions */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A] mb-4">Solutions</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/solutions/universities" className="text-[#64748B] hover:text-[#0F172A] transition-colors">Universities &amp; Colleges</Link></li>
              <li><Link href="/solutions/k12" className="text-[#64748B] hover:text-[#0F172A] transition-colors">K-12 Schools</Link></li>
              <li><Link href="/join" className="text-[#64748B] hover:text-[#0F172A] transition-colors">Integrate &amp; Partner</Link></li>
              <li><Link href="/pricing" className="text-[#64748B] hover:text-[#0F172A] transition-colors">Campus Pricing</Link></li>
            </ul>
          </div>

          {/* Support & Helpdesk */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A] mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button 
                  onClick={handleOpenChat} 
                  className="text-left text-[#64748B] hover:text-teal-600 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  24/7 AI Assistant
                </button>
              </li>
              <li><Link href="/support" className="text-[#64748B] hover:text-[#0F172A] transition-colors">Help Center</Link></li>
              <li><Link href="/support/email" className="text-[#64748B] hover:text-[#0F172A] transition-colors">Campus IT Helpdesk</Link></li>
              <li>
                <button 
                  onClick={handleOpenFeedback} 
                  className="text-left text-[#64748B] hover:text-teal-600 transition-colors cursor-pointer"
                >
                  Share Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A] mb-4">Trust &amp; Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="text-[#64748B] hover:text-[#0F172A] transition-colors">Student Data Privacy</Link></li>
              <li><Link href="/terms" className="text-[#64748B] hover:text-[#0F172A] transition-colors">Terms of Service</Link></li>
              <li><Link href="/enterprise-support" className="text-[#64748B] hover:text-[#0F172A] transition-colors">Security &amp; SLA</Link></li>
              <li><Link href="/about" className="text-[#64748B] hover:text-[#0F172A] transition-colors">About IntelliAttend</Link></li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200/80 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-xs text-[#64748B] order-2 md:order-1">
            © {new Date().getFullYear()} IntelliAttend Campus Operating Platform. All rights reserved.
          </p>

          {/* Social Links - Bottom Right */}
          <div className="flex flex-col items-start md:items-start gap-2 order-1 md:order-2">
            <span className="font-bold text-xs sm:text-sm text-[#0F172A] tracking-tight">
              Contact with us
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.ariaLabel}
                  title={item.name}
                  className="w-7 h-7 rounded-full bg-black hover:bg-slate-800 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-2xs"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
