"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
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
              Let's talk about your campus.
            </h2>
            <p className="text-lg text-[#64748B] max-w-md">
              Whether you're looking for a custom enterprise solution or just want to see a live demo, our team is ready to help.
            </p>

            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0F172A]">Email</h4>
                  <p className="text-[#64748B]">hello@intelliattend.app</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0F172A]">Phone</h4>
                  <p className="text-[#64748B]">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MapPin className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0F172A]">Address</h4>
                  <p className="text-[#64748B]">100 Innovation Drive, Tech City, CA</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-50/50 rounded-[32px] transform rotate-3 scale-105" />
            <div className="glass-card p-10 rounded-[32px] border border-[#0F172A]/[0.08] relative bg-white shadow-2xl shadow-slate-200/50">

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#0F172A]">Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Dr. Sarah Jenkins"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#0F172A]">Email</label>
                        <input
                          required
                          type="email"
                          placeholder="sarah@university.edu"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#0F172A]">Organization</label>
                        <input
                          required
                          type="text"
                          placeholder="Tech University"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#0F172A]">Message</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us about your campus needs..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      />
                    </div>

                    <button
                      disabled={isSubmitting}
                      className="w-full py-4 bg-[#0F172A] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#1E293B] transition-colors disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {isSubmitting ? "Sending..." : "Send Message"}
                        {!isSubmitting && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                      </span>
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Message Sent!</h3>
                    <p className="text-[#64748B]">We'll get back to you within 24 hours.</p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
