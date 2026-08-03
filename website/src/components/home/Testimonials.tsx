"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Dr. Sarah Jenkins",
    role: "Dean of Engineering",
    institution: "Tech University",
    text: "IntelliAttend completely eliminated the 15 minutes of lost instructional time at the start of every lecture. The analytics are game-changing.",
    rating: 5,
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Michael Chen",
    role: "IT Director",
    institution: "Global Business School",
    text: "Deploying this across 500 classrooms took less than a week. The seamless integration with our existing infrastructure was remarkable.",
    rating: 5,
    color: "bg-purple-100 text-purple-700",
  },
  {
    name: "Prof. Elena Rodriguez",
    role: "Department Chair",
    institution: "State College",
    text: "The predictive analytics flagged 12 at-risk students in my department before midterms. We intervened early and saved their semester.",
    rating: 5,
    color: "bg-green-100 text-green-700",
  },
  {
    name: "James Wilson",
    role: "Campus Administrator",
    institution: "National Institute of Science",
    text: "The live dashboard gives me a real-time pulse on campus activity. It's like having a control room for the entire university.",
    rating: 5,
    color: "bg-orange-100 text-orange-700",
  },
];

export function Testimonials() {
  return (
    <section className="py-32 relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6">
            Loved by Educators
          </h2>
          <p className="text-lg text-[#64748B]">
            See how forward-thinking institutions are transforming their operations with IntelliAttend.
          </p>
        </div>

        {/* Animated Slider */}
        <div className="relative flex overflow-hidden mask-image-gradient py-10">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
            className="flex gap-8 items-center"
          >
            {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div 
                key={i} 
                className="glass-card w-[420px] shrink-0 p-10 flex flex-col justify-between rounded-[32px] border border-[#0F172A]/[0.08]"
              >
                <div>
                  <div className="flex gap-1 mb-8">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[#0F172A] text-lg leading-relaxed mb-10 font-medium">"{t.text}"</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={cn("w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl", t.color)}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[#0F172A] font-bold">{t.name}</h4>
                    <p className="text-sm text-[#64748B] font-medium">{t.role}, {t.institution}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .mask-image-gradient {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}} />
    </section>
  );
}
