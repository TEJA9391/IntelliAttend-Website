"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#0F172A]/[0.08] pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                 <Sparkles className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-[#0F172A] tracking-tight">IntelliAttend</span>
            </Link>
            <p className="text-sm text-[#64748B] mb-6 max-w-xs">
              The intelligent foundation for modern educational institutions.
            </p>
            <div className="flex items-center gap-4 text-[#64748B]">
              <Link href="#" className="hover:text-[#0F172A] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="hover:text-[#0F172A] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#0F172A] mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Features</Link></li>
              <li><Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Integrations</Link></li>
              <li><Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#0F172A] mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#0F172A] mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          
        </div>

        <div className="border-t border-[#0F172A]/[0.08] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#64748B]">
            © {new Date().getFullYear()} IntelliAttend Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-sm text-[#64748B]">All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
