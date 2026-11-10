"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { CONTACT_INFO } from "@/config/constants";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const messageLines = [
      `*New Campus Inquiry via IntelliAttend Website*`,
      ``,
      `👤 *Name:* ${formData.fullName.trim()}`,
      `📧 *Email:* ${formData.email.trim()}`,
      `🏫 *Organization:* ${formData.organization.trim()}`,
      `💬 *Message:* ${formData.message.trim()}`,
    ];

    const encodedText = encodeURIComponent(messageLines.join("\n"));
    const whatsappUrl = `https://wa.me/919493615849?text=${encodedText}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-32 relative bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left Column: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              Let&apos;s talk about your campus.
            </h2>
            <p className="text-lg text-[#64748B] max-w-md">
              Whether you&apos;re looking for a campus-wide deployment or just want to see a live demo, our team is ready to help.
            </p>

            <div className="space-y-6 mt-2">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="text-teal-600 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0F172A]">Email</h4>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="text-[#64748B] hover:text-primary transition-colors">
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MessageSquare className="text-emerald-600 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0F172A]">WhatsApp</h4>
                  <a 
                    href={CONTACT_INFO.whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#64748B] hover:text-emerald-600 transition-colors font-medium inline-flex items-center gap-2"
                  >
                    <span>{CONTACT_INFO.whatsapp}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">Chat Now</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="text-teal-600 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0F172A]">Phone</h4>
                  <a href={CONTACT_INFO.phoneHref} className="text-[#64748B] hover:text-primary transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform mt-0.5">
                  <MapPin className="text-teal-600 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0F172A]">Address</h4>
                  <p className="text-[#64748B] text-sm leading-relaxed max-w-sm">
                    {CONTACT_INFO.address}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Clean Form */}
          <div className="relative z-10">
            <div className="bg-white p-8 sm:p-10 relative z-10 border border-slate-200/90 shadow-xl rounded-[28px]">

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label 
                        htmlFor="fullName" 
                        className="text-sm font-semibold text-[#0F172A] cursor-pointer inline-block"
                      >
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        type="text"
                        autoComplete="name"
                        placeholder="e.g. Dr. Rajesh Kumar"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all cursor-text text-[#0F172A] font-medium placeholder:text-slate-400 caret-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label 
                          htmlFor="email" 
                          className="text-sm font-semibold text-[#0F172A] cursor-pointer inline-block"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          type="email"
                          autoComplete="email"
                          placeholder="rajesh@college.edu"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all cursor-text text-[#0F172A] font-medium placeholder:text-slate-400 caret-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label 
                          htmlFor="organization" 
                          className="text-sm font-semibold text-[#0F172A] cursor-pointer inline-block"
                        >
                          Organization
                        </label>
                        <input
                          id="organization"
                          name="organization"
                          value={formData.organization}
                          onChange={handleInputChange}
                          required
                          type="text"
                          autoComplete="organization"
                          placeholder="e.g. Engineering College / University"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all cursor-text text-[#0F172A] font-medium placeholder:text-slate-400 caret-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label 
                        htmlFor="message" 
                        className="text-sm font-semibold text-[#0F172A] cursor-pointer inline-block"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        placeholder="Tell us about your campus, number of departments or sessions..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all resize-none cursor-text text-[#0F172A] font-medium placeholder:text-slate-400 caret-primary"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-[#0F172A] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#1E293B] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden cursor-pointer shadow-md hover:shadow-lg"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {isSubmitting ? "Sending..." : "Send Message"}
                          {!isSubmitting && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">WhatsApp Opened!</h3>
                    <p className="text-[#64748B] text-sm max-w-xs mx-auto mb-6">
                      Your inquiry has been prefilled in WhatsApp. Simply press send to connect directly with our team.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="text-sm text-primary font-bold hover:underline cursor-pointer"
                    >
                      ← Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
