"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Presentation,
  LineChart, 
  BellRing, 
  FileText,
  CalendarDays, 
  WifiOff,
  Users,
  CheckCircle,
  X
} from "lucide-react";

const features = [
  { icon: Presentation, title: "SmartBoard Integration", desc: "Push attendance and resources directly to classroom SmartBoards.", details: "IntelliAttend seamlessly syncs with interactive panels across your campus. Instantly display real-time seating charts, highlight absent students, and push daily lesson resources directly to the board." },
  { icon: LineChart, title: "AI Analytics", desc: "Deep insights into department performance and student behavior.", details: "Leverage advanced machine learning to predict student dropout rates, identify struggling classes, and optimize department-wide performance metrics with beautiful, real-time dashboards." },
  { icon: BellRing, title: "Real-Time Notifications", desc: "Targeted push notifications, SMS, and emails for all stakeholders.", details: "Keep everyone in the loop effortlessly. Automatically alert parents of unexcused absences, remind faculty of upcoming meetings, and notify students of room changes the moment they happen." },
  { icon: FileText, title: "Course Resources", desc: "Centralized hub for all your course materials, accessible anywhere.", details: "Upload syllabi, lecture notes, and assignments into a secure, cloud-based repository. Students can access their materials 24/7 from any device, ensuring they never miss a beat." },
  { icon: CalendarDays, title: "Timetable Management", desc: "AI-optimized scheduling that prevents faculty and room conflicts.", details: "Say goodbye to scheduling headaches. Our AI analyzes room capacities, faculty availability, and student enrollments to generate the perfect conflict-free timetable in seconds." },
  { icon: WifiOff, title: "Offline Synchronization", desc: "Keep recording attendance even when the network drops.", details: "No internet? No problem. The IntelliAttend mobile app continues to function perfectly offline, securely storing all attendance data and automatically syncing the moment a connection is restored." },
  { icon: Users, title: "Parent & Student Portal", desc: "Secure portals for parents and students to monitor progress and attendance.", details: "Empower families with transparency. Parents can log in to track their child's daily attendance, academic progress, and direct communications from teachers in a beautifully designed secure portal." },
  { icon: CheckCircle, title: "Automated Grading", desc: "AI-assisted assignment grading and automated rubric evaluation.", details: "Drastically reduce administrative overhead. IntelliAttend's AI can scan, evaluate, and grade standard assignments based on your custom rubrics, giving faculty more time to focus on teaching." },
];

export function AIFeatures() {
  const [selectedFeature, setSelectedFeature] = useState<null | typeof features[0]>(null);

  return (
    <section id="features" className="py-32 relative bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight"
          >
            Everything Faculty Needs. <br />
            <span className="text-[#64748B]">One Intelligent Platform.</span>
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
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="glass-card p-8 group relative overflow-hidden rounded-[28px] bg-white border border-[#0F172A]/[0.08] cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />
              
              <div className="relative z-10 pointer-events-none">
                <motion.div layoutId={`icon-${feature.title}`} className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ease-out">
                  <feature.icon className="w-6 h-6 text-primary" />
                </motion.div>
                
                <motion.h3 layoutId={`title-${feature.title}`} className="text-xl font-bold text-[#0F172A] mb-3">
                  {feature.title}
                </motion.h3>
                
                <motion.p layoutId={`desc-${feature.title}`} className="text-sm text-[#64748B] leading-relaxed">
                  {feature.desc}
                </motion.p>
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
              onClick={() => setSelectedFeature(null)}
              className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-sm z-[100]"
            />
            <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none p-4">
              <motion.div
                layoutId={`card-${selectedFeature.title}`}
                className="bg-white w-full max-w-lg rounded-[32px] p-8 shadow-2xl pointer-events-auto relative overflow-hidden flex flex-col"
              >
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500 z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                <motion.div layoutId={`icon-${selectedFeature.title}`} className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                  <selectedFeature.icon className="w-8 h-8 text-primary" />
                </motion.div>
                
                <motion.h3 layoutId={`title-${selectedFeature.title}`} className="text-2xl font-bold text-[#0F172A] mb-4">
                  {selectedFeature.title}
                </motion.h3>
                
                <motion.p layoutId={`desc-${selectedFeature.title}`} className="text-lg text-[#64748B] leading-relaxed mb-6">
                  {selectedFeature.desc}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="h-px w-full bg-slate-100 mb-6" />
                  <p className="text-base text-slate-600 leading-relaxed">
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
