"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Users2, ShieldCheck, Database, 
  Settings, Network, BookOpen, MessageCircle, FileText, Check, CheckCircle2, ArrowRight
} from "lucide-react";

const INCLUDED_SERVICES = [
  { name: "Campus Pilot Setup", icon: Building2 },
  { name: "Faculty Training Workshops", icon: BookOpen },
  { name: "Departmental Portals", icon: Users2 },
  { name: "SmartBoard Display Sync", icon: Settings },
  { name: "Timetable & Course Setup", icon: Database },
  { name: "Data Security Consultation", icon: ShieldCheck },
  { name: "Role-Based Access Control", icon: ShieldCheck },
  { name: "Direct WhatsApp Support", icon: MessageCircle },
  { name: "Custom Academic Reports", icon: FileText },
  { name: "API & Data Exports", icon: Network }
];

const ENTERPRISE_BENEFITS = [
  { title: "Direct Campus Hotline", desc: "Fast-track technical communication via direct phone and WhatsApp with our core team." },
  { title: "Hands-on Faculty Workshops", desc: "Guided walkthroughs for department heads, professors, and lab coordinators." },
  { title: "Zero Hardware Display Sync", desc: "Connect your existing interactive displays or classroom projectors using standard web browsers." },
  { title: "75% Eligibility Automation", desc: "Automate mandatory university attendance thresholds and semester eligibility reports." },
  { title: "Multi-Section Timetables", desc: "Structure complex departmental schedules, faculty allocations, and substitute classes." },
  { title: "Cloud Synchronization", desc: "Secure, real-time database replication ensuring 100% data availability across devices." }
];

export default function EnterpriseSupportPage() {
  const [formData, setFormData] = useState({
    institutionName: "",
    students: "",
    faculty: "",
    country: "India",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const messageLines = [
      `*New Institutional Pilot Inquiry (Enterprise Support)*`,
      ``,
      `🏫 *Institution:* ${formData.institutionName.trim()}`,
      `👥 *Students:* ${formData.students || "Not specified"}`,
      `👨‍🏫 *Faculty:* ${formData.faculty || "Not specified"}`,
      `📍 *Location:* ${formData.country.trim()}`,
      `💬 *Goals:* ${formData.message.trim()}`
    ];

    const encodedText = encodeURIComponent(messageLines.join("\n"));
    const whatsappUrl = `https://wa.me/919493615849?text=${encodedText}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="pt-36 pb-20 bg-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10 bg-center"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
              >
                Dedicated Campus <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Deployment Team</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-white/70 leading-relaxed mb-8"
              >
                Hands-on onboarding, SmartBoard configuration, faculty workshops, and pilot deployment guidance tailored specifically for colleges, universities, and institutions.
              </motion.p>
            </div>

            {/* Enterprise Form */}
            <motion.div 
              id="enterprise-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-2xl relative scroll-mt-24"
            >
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-1">Request Campus Pilot</h3>
                    <p className="text-slate-500 text-sm mb-5">Connect directly with our deployment engineers to structure your institution&apos;s rollout.</p>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="institutionName" className="text-sm font-bold text-[#0F172A]">Institution / College Name</label>
                      <input 
                        id="institutionName" 
                        name="institutionName"
                        required 
                        type="text" 
                        value={formData.institutionName}
                        onChange={handleChange}
                        placeholder="e.g. Malla Reddy Colleges"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="students" className="text-sm font-bold text-[#0F172A]">Total Students</label>
                        <select 
                          id="students"
                          name="students"
                          required 
                          value={formData.students}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                        >
                          <option value="">Select...</option>
                          <option value="Under 500">Under 500</option>
                          <option value="500 - 2,000">500 - 2,000</option>
                          <option value="2,000 - 10,000">2,000 - 10,000</option>
                          <option value="10,000+">10,000+</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="faculty" className="text-sm font-bold text-[#0F172A]">Total Faculty</label>
                        <select 
                          id="faculty"
                          name="faculty"
                          required 
                          value={formData.faculty}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                        >
                          <option value="">Select...</option>
                          <option value="Under 50">Under 50</option>
                          <option value="50 - 200">50 - 200</option>
                          <option value="200 - 500">200 - 500</option>
                          <option value="500+">500+</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="country" className="text-sm font-bold text-[#0F172A]">City / Region</label>
                      <input 
                        id="country" 
                        name="country"
                        required 
                        type="text" 
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="e.g. Hyderabad, Telangana"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900" 
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-sm font-bold text-[#0F172A]">Deployment Requirements</label>
                      <textarea 
                        id="message" 
                        name="message"
                        required 
                        rows={3} 
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Classroom SmartBoards, attendance rollout, timetable needs..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-slate-900"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-[#0F172A] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:bg-[#1E293B] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                    >
                      {isSubmitting ? "Connecting..." : "Submit Inquiry via WhatsApp"}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 text-center flex flex-col items-center justify-center min-h-[420px]"
                  >
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-5 text-emerald-600">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#0F172A] mb-3">Inquiry Formatted</h2>
                    <p className="text-slate-600 mb-6 max-w-sm">
                      Your institutional pilot inquiry has been prepared and opened in WhatsApp to connect directly with our engineering coordinators.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-sm font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Submit another inquiry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">
              Institution Deployment Benefits
            </h2>
            <p className="text-lg text-slate-500">
              When you partner with IntelliAttend, our team provides hands-on onboarding and direct deployment support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ENTERPRISE_BENEFITS.map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                  <Check className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{benefit.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Included Services Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">
                What is included in Institutional Onboarding?
              </h2>
              <p className="text-lg text-slate-500">
                A focused suite of services ensuring your campus rollout is smooth and well-adopted by faculty and students.
              </p>
            </div>
            <button 
              onClick={() => {
                const formElement = document.getElementById('enterprise-form');
                const inputElement = document.getElementById('institutionName');
                if (formElement) {
                  formElement.scrollIntoView({ behavior: 'smooth' });
                  setTimeout(() => inputElement?.focus(), 800);
                }
              }}
              className="text-primary font-bold hover:gap-2 gap-1 flex items-center transition-all whitespace-nowrap cursor-pointer"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {INCLUDED_SERVICES.map((service, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:border-slate-300 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                  <service.icon className="w-4 h-4 text-slate-600" />
                </div>
                <span className="font-semibold text-slate-700 text-xs">{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
