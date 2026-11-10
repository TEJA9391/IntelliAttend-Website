"use client";

import { PhoneCall, Mail, Building2, Users2 } from 'lucide-react';
import Link from 'next/link';
import { CONTACT_INFO } from '@/config/constants';

const CONTACTS = [
  {
    title: "Speak with Expert",
    desc: "Immediate assistance from our sales and technical team",
    phone: CONTACT_INFO.phone,
    icon: <PhoneCall className="w-8 h-8 text-slate-700" />,
    action: "Call Now →",
    href: CONTACT_INFO.phoneHref,
    badge: "Direct Line"
  },
  {
    title: "Email Support",
    desc: "support@intelliattend.com",
    icon: <Mail className="w-8 h-8 text-emerald-500" />,
    action: "Submit a Ticket →",
    href: "/support/email",
    badge: "24/7"
  },
  {
    title: "Enterprise Support",
    desc: "Dedicated onboarding and technical assistance.",
    icon: <Building2 className="w-8 h-8 text-teal-500" />,
    action: "Talk to Enterprise Team →",
    href: "/enterprise-support",
    badge: "Priority"
  },
  {
    title: "Community Forum",
    desc: "Ask questions and share best practices.",
    icon: <Users2 className="w-8 h-8 text-rose-500" />,
    action: "Explore Community →",
    href: "/community"
  }
];

export function HelpContact() {
  return (
    <section className="py-20 bg-[#F8FAFC] border-t border-slate-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Contact Support</h2>
          <p className="text-lg text-[#64748B]">Still need help? Our support specialists are ready to assist.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONTACTS.map((contact, idx) => (
            <div key={idx} className="apple-card p-6 flex flex-col items-center text-center relative">
              {contact.badge && (
                <div className="absolute -top-3 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
                  {contact.badge}
                </div>
              )}
              <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center mb-4">
                {contact.icon}
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">{contact.title}</h3>
              <p className="text-sm text-[#64748B] mb-2">{contact.desc}</p>
              {contact.phone && (
                <a 
                  href={contact.href}
                  className="font-mono text-sm font-bold text-slate-900 hover:text-primary transition-colors my-2 inline-block px-3 py-1 rounded-md bg-slate-100 border border-slate-200 shadow-2xs"
                >
                  {contact.phone}
                </a>
              )}
              <div className="flex-1" />
              <Link 
                href={contact.href}
                className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all mt-3"
              >
                {contact.action}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
