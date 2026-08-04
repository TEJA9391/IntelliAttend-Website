"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const showcaseItems = [
  {
    title: "SmartBoard",
    description: "Interactive classroom displays with one-tap content sharing, live presentations, announcements, attendance dashboards, and real-time lecture synchronization.",
    image: "/images/products/smartboard_mockup.png",
    reverse: false,
  },
  {
    title: "Faculty",
    description: "Manage classes, attendance, lecture resources, SmartBoard sessions, schedules, and academic workflows from one intelligent dashboard.",
    image: "/images/products/faculty_dashboard_mockup.png",
    reverse: true,
  },
  {
    title: "Students",
    description: "Track attendance, academic progress, assignments, schedules, notifications, and learning resources from a personalized student portal.",
    image: "/images/products/student_app_mockup.png",
    reverse: false,
  },
  {
    title: "Administration",
    description: "Monitor departments, faculty performance, attendance, classrooms, reports, and campus operations from a centralized control center.",
    image: "/images/products/admin_dashboard_mockup.png",
    reverse: true,
  },
  {
    title: "AI Analytics",
    description: "Turn academic data into actionable insights with predictive attendance trends, faculty performance metrics, and real-time institutional reports.",
    image: "/images/products/ai_analytics_mockup.png",
    reverse: false,
  },
  {
    title: "Campus Communication",
    description: "Deliver announcements, emergency alerts, timetable changes, and academic updates instantly to faculty and students.",
    image: "/images/products/campus_comm_mockup.png",
    reverse: true,
  }
];

export function ProductsShowcase() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Everything you need. <br /> Built into one platform.
          </h2>
          <p className="text-xl text-slate-600">
            Explore the specialized tools designed for every role across your entire campus.
          </p>
        </div>

        <div className="flex flex-col gap-32">
          {showcaseItems.map((item, idx) => (
            <div 
              key={idx}
              className={`flex flex-col gap-12 lg:gap-24 items-center ${
                item.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              {/* Text Content */}
              <motion.div 
                initial={{ opacity: 0, x: item.reverse ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full lg:w-1/2 flex flex-col justify-center"
              >
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-primary bg-primary/10 mb-6 w-fit">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Module 0{idx + 1}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                  {item.title}
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  {item.description}
                </p>
              </motion.div>

              {/* Image Content */}
              <motion.div 
                initial={{ opacity: 0, x: item.reverse ? -40 : 40, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="w-full lg:w-1/2 relative"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-50 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 border border-slate-100">
                  <Image 
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle glare effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 pointer-events-none" />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
