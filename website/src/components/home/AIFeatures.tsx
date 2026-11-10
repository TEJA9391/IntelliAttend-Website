"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Presentation,
  BarChart3, 
  BellRing, 
  FileText,
  CalendarDays, 
  ShieldCheck,
  Users,
  CreditCard,
  X
} from "lucide-react";

const flipWords = ["Faculty", "Students", "Colleges", "Schools", "Universities", "Administrators"];

const features = [
  { 
    icon: Presentation, 
    title: "SmartBoard Integration", 
    desc: "Push lecture notes, timetables, and notices directly to classroom displays.", 
    details: "IntelliAttend connects with interactive displays and smart TVs across campus. Cast lecture slides, display daily schedules, and share announcements with one tap—eliminating USB pen drives and cable setup." 
  },
  { 
    icon: BarChart3, 
    title: "Compliance & Eligibility Analytics", 
    desc: "Automatically track mandatory 75% attendance rules and semester progress.", 
    details: "Instantly identify students falling below required attendance thresholds before exam debarment. Generate department-wide attendance percentages and subject-wise reports with zero manual calculation." 
  },
  { 
    icon: BellRing, 
    title: "Instant Campus Alerts", 
    desc: "Direct push notifications for schedule changes, announcements, and dues.", 
    details: "Keep faculty and students in the loop in real time. Deliver urgent classroom relocation alerts, lecture cancellations, exam notices, and fee payment reminders directly to mobile devices." 
  },
  { 
    icon: FileText, 
    title: "Central Course Resources", 
    desc: "Cloud hub for lecture slides, syllabi, and reference materials.", 
    details: "Faculty can upload PDFs, presentations, and lecture reference materials into a centralized cloud hub. Students access verified study materials 24/7 from their mobile app without relying on messy WhatsApp groups." 
  },
  { 
    icon: CalendarDays, 
    title: "Session & Timetable Management", 
    desc: "Effortlessly organize daily lectures, lab batches, and faculty schedules.", 
    details: "Manage complex department timetables with ease. Assign professors to subjects, manage laboratory batches, and view classroom availability in one unified schedule view." 
  },
  { 
    icon: ShieldCheck, 
    title: "Tamper-Proof Academic Records", 
    desc: "Replace paper registers with immutable, exportable attendance archives.", 
    details: "Maintain accurate, date-and-time stamped session logs. Department HODs can export official attendance records, faculty coverage reports, and accreditation data to Excel and PDF in one click." 
  },
  { 
    icon: Users, 
    title: "Student & Faculty Portals", 
    desc: "Cross-platform web and mobile dashboards tailored for each campus role.", 
    details: "Faculty get a 1-tap roll call interface and subject manager. Students get a clean mobile dashboard to check real-time attendance percentage, daily timetables, and campus updates." 
  },
  { 
    icon: CreditCard, 
    title: "Smart Campus Payments", 
    desc: "Digital fee collection, dues tracking, and instant automated receipts.", 
    details: "Simplify campus financial operations. Allow students to view pending dues and pay tuition or exam fees online, while administrative accountants receive real-time collection reports and automated reconciliations." 
  },
];

export function AIFeatures() {
  const [selectedFeature, setSelectedFeature] = useState<null | typeof features[0]>(null);
  const [flipIndex, setFlipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipIndex((prev) => (prev + 1) % flipWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedFeature(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section id="features" className="py-32 relative bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[clamp(1.35rem,4.2vw,3rem)] font-bold text-[#0F172A] mb-6 leading-[1.2] flex flex-col items-center justify-center overflow-visible"
          >
            <motion.span layout className="inline-flex items-baseline justify-center text-center whitespace-nowrap">
              <motion.span layout transition={{ duration: 0.4, type: "spring", bounce: 0.1 }}>Everything</motion.span>
              <span className="inline-grid text-center mx-2 sm:mx-3" style={{ perspective: "1000px" }}>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    layout
                    key={flipIndex}
                    initial={{ rotateX: -90, y: 20, opacity: 0 }}
                    animate={{ rotateX: 0, y: 0, opacity: 1 }}
                    exit={{ rotateX: 90, y: -20, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="col-start-1 row-start-1 origin-center whitespace-nowrap"
                  >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                      {flipWords[flipIndex]}
                    </span>
                  </motion.span>
                </AnimatePresence>
              </span>
              <motion.span layout transition={{ duration: 0.4, type: "spring", bounce: 0.1 }}>Needs.</motion.span>
            </motion.span>
            <motion.span layout className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mt-2 sm:mt-4 text-center whitespace-normal">
              One Intelligent Platform.
            </motion.span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              layoutId={`card-${feature.title}`}
              onClick={() => setSelectedFeature(feature)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                layout: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { delay: i * 0.04, duration: 0.25 },
                y: { delay: i * 0.04, duration: 0.25 }
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="apple-card p-7 group relative cursor-pointer hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <div className="relative z-10 pointer-events-none">
                <motion.div 
                  layoutId={`icon-box-${feature.title}`}
                  className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200 ease-out"
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </motion.div>
                
                <h3 className="text-lg font-bold text-[#0F172A] mb-2 leading-snug">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedFeature && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setSelectedFeature(null)}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[100]"
            />
            <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none p-4">
              <motion.div
                layoutId={`card-${selectedFeature.title}`}
                transition={{ type: "spring", stiffness: 350, damping: 32 }}
                className="bg-white w-full max-w-lg rounded-[28px] p-8 shadow-2xl pointer-events-auto relative overflow-hidden flex flex-col border border-slate-100"
              >
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500 z-10 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <motion.div 
                  layoutId={`icon-box-${selectedFeature.title}`}
                  className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-6"
                >
                  <selectedFeature.icon className="w-8 h-8 text-primary" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-[#0F172A] mb-3">
                  {selectedFeature.title}
                </h3>
                
                <p className="text-base text-slate-600 leading-relaxed mb-6 font-medium">
                  {selectedFeature.desc}
                </p>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.12, duration: 0.25 }}
                >
                  <div className="h-px w-full bg-slate-100 mb-6" />
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                    {selectedFeature.details}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
