"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle2 } from "lucide-react";
import { CONTACT_INFO } from "@/config/constants";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
    const messageLines = [
      `*New Campus Inquiry via IntelliAttend Contact Page*`,
      ``,
      `👤 *Name:* ${fullName || "Website Visitor"}`,
      `📧 *Email:* ${formData.email.trim()}`,
      `💬 *Message:* ${formData.message.trim()}`,
    ];

    const encodedText = encodeURIComponent(messageLines.join("\n"));
    const whatsappUrl = `https://wa.me/919493615849?text=${encodedText}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pt-36 pb-28 min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-[#0F172A] mb-6">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Touch</span>
          </h1>
          <p className="text-lg text-[#64748B]">
            Have questions about bringing IntelliAttend to your campus or institution? We are here to help you get started.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-3 text-[#0F172A]">Campus Operations & Support</h3>
              <p className="text-slate-500 leading-relaxed">
                Connect with our deployment team for pilots, SmartBoard setups, faculty training, and institutional integrations.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0 mt-0.5">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0F172A] text-base mb-1">Our Location</h4>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {CONTACT_INFO.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0 mt-0.5">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0F172A] text-base mb-1">Direct Phone & WhatsApp</h4>
                  <a 
                    href="https://wa.me/919493615849?text=Hi%20IntelliAttend%2C%20I%20have%20a%20question."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary font-medium hover:underline block"
                  >
                    {CONTACT_INFO.phone} (Tap to chat on WhatsApp)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0 mt-0.5">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0F172A] text-base mb-1">Official Email</h4>
                  <a 
                    href={`mailto:${CONTACT_INFO.email}`} 
                    className="text-sm text-primary font-medium hover:underline block"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-2xl font-bold mb-2 text-[#0F172A]">Send us a message</h3>
            <p className="text-sm text-slate-500 mb-6">
              Fill out your query below and our team will connect directly with you via WhatsApp or Email.
            </p>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center py-10"
                >
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Message Opened in WhatsApp</h4>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto mb-6">
                    Your inquiry has been formatted and opened in WhatsApp to chat directly with our team.
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({ firstName: "", lastName: "", email: "", message: "" });
                    }}
                    className="text-sm font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="firstName" className="text-sm font-medium text-[#0F172A]">
                        First Name
                      </label>
                      <input 
                        id="firstName"
                        name="firstName"
                        type="text" 
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-[#F8FAFC] focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-800" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="lastName" className="text-sm font-medium text-[#0F172A]">
                        Last Name
                      </label>
                      <input 
                        id="lastName"
                        name="lastName"
                        type="text" 
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="e.g. Sharma"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-[#F8FAFC] focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-800" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-[#0F172A]">
                      Email Address
                    </label>
                    <input 
                      id="email"
                      name="email"
                      type="email" 
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-[#F8FAFC] focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-800" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-sm font-medium text-[#0F172A]">
                      Message / Inquiry
                    </label>
                    <textarea 
                      id="message"
                      name="message"
                      rows={4} 
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your campus, class sizes, or requirements..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-[#F8FAFC] focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-800 resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" /> {isSubmitting ? "Sending..." : "Send Message via WhatsApp"}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
