"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    features: ["Unlimited Faculty", "Cloud Sync", "Basic Reports", "Community Support"],
    popular: false,
    cta: "Start Free",
  },
  {
    name: "Professional",
    price: "$299",
    period: "/month",
    features: ["Unlimited Faculty", "Cloud Sync", "AI Reports", "Priority Support"],
    popular: true,
    cta: "Start 14-Day Trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Unlimited Faculty", "On-Premise Sync", "Custom AI Models", "Dedicated Manager"],
    popular: false,
    cta: "Contact Sales",
  },
];

const faqs = [
  {
    q: "How does the AI face recognition work?",
    a: "Our system integrates with standard IP cameras or mobile devices to match student faces against a secure, encrypted database in real-time.",
  },
  {
    q: "Is IntelliAttend compliant with privacy laws?",
    a: "Yes, we are fully compliant with GDPR, FERPA, and other major data privacy regulations. All data is encrypted at rest and in transit.",
  },
  {
    q: "Can it integrate with our existing LMS?",
    a: "Absolutely. We offer robust APIs and native integrations for Canvas, Blackboard, Moodle, and other major Learning Management Systems.",
  },
];

export function PricingFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="pricing" className="py-32 relative bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Pricing */}
        <div className="mb-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6"
            >
              Simple, transparent pricing
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {plans.map((plan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className={cn(
                  "relative p-8 rounded-[28px] border flex flex-col bg-white",
                  plan.popular ? "border-primary shadow-xl shadow-primary/10 py-12" : "border-[#0F172A]/[0.08]"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-[#0F172A] mb-6">{plan.name}</h3>
                
                <div className="mb-8">
                  <span className="text-5xl font-bold text-[#0F172A] tracking-tight">{plan.price}</span>
                  <span className="text-[#64748B] font-medium">{plan.period}</span>
                </div>
                
                <button className={cn(
                  "w-full py-3.5 rounded-full font-semibold transition-all mb-8",
                  plan.popular 
                    ? "bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-lg" 
                    : "bg-slate-100 text-[#0F172A] hover:bg-slate-200"
                )}>
                  {plan.cta}
                </button>
                
                <div className="space-y-4 mt-auto">
                  {plan.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-[#0F172A] font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-[#0F172A]">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
             {faqs.map((faq, i) => (
               <div key={i} className="bg-white border border-[#0F172A]/[0.08] rounded-2xl overflow-hidden shadow-sm">
                 <button 
                   onClick={() => setOpenFaq(openFaq === i ? null : i)}
                   className="w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none"
                 >
                   <span className="text-lg font-medium text-[#0F172A]">{faq.q}</span>
                   <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", openFaq === i ? "bg-primary text-white" : "bg-slate-100 text-[#0F172A]")}>
                     {openFaq === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                   </div>
                 </button>
                 <AnimatePresence>
                   {openFaq === i && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: "auto", opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden"
                     >
                       <div className="px-6 pb-6 text-[#64748B] leading-relaxed">
                         {faq.a}
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             ))}
          </div>
        </div>

      </div>
    </section>
  );
}
