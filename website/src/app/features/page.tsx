"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ClipboardCheck, 
  MapPin, 
  Smartphone, 
  BarChart3, 
  MonitorPlay, 
  BrainCircuit, 
  ShieldCheck, 
  Share2, 
  AlertTriangle, 
  Calendar, 
  UserCheck, 
  Lock, 
  Cloud, 
  Megaphone, 
  Bell, 
  Calculator, 
  Search, 
  Check,
  CheckCircle2, 
  ArrowRight,
  GraduationCap,
  FileSpreadsheet,
  Radio,
  X,
  Layers,
  ArrowUpRight,
  User
} from "lucide-react";

interface Feature {
  id: string;
  category: "attendance" | "smartboard" | "faculty" | "student" | "ai" | "security";
  categoryLabel: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  highlight: string;
  longDesc: string;
  benefits: string[];
  howItWorks: string[];
  targetRole: string;
  productLink: string;
  productLinkText: string;
}

const ALL_FEATURES: Feature[] = [
  // 1. Attendance & Anti-Proxy
  {
    id: "att-1",
    category: "attendance",
    categoryLabel: "Attendance & Anti-Proxy",
    tag: "Faculty Portal",
    icon: ClipboardCheck,
    title: "1-Tap Digital Attendance",
    desc: "Initiate secure, encrypted roll calls with a single tap. Session automatically locks and archives attendance when lecture ends.",
    highlight: "Zero Paper Registers",
    longDesc: "Replaces outdated pen-and-paper registers with instant digital session creation. Faculty simply tap 'Start Attendance' to open an encrypted session for their scheduled lecture cohort.",
    benefits: [
      "Zero paper waste and manual headcount errors",
      "Automated timestamping and session locking",
      "Instantly updates student percentages and HOD dashboards"
    ],
    howItWorks: [
      "Faculty selects scheduled class from daily timetable",
      "System generates encrypted attendance window",
      "Session closes automatically when class finishes"
    ],
    targetRole: "Professors & Teaching Assistants",
    productLink: "/products/faculty",
    productLinkText: "Explore Faculty Portal"
  },
  {
    id: "att-2",
    category: "attendance",
    categoryLabel: "Attendance & Anti-Proxy",
    tag: "SmartBoard Screen",
    icon: Radio,
    title: "Dynamic SmartBoard OTP & PIN",
    desc: "Rotate dynamic, time-sensitive 6-digit session codes on classroom screens. Eliminates proxy attendance and buddy punching completely.",
    highlight: "Anti-Proxy Engine",
    longDesc: "Displays a rotating, time-sensitive 6-digit session code directly on classroom smart boards. Students in the room enter the code within the active window, preventing absent friends from sharing codes.",
    benefits: [
      "Stops proxy attendance and buddy punching",
      "Rotating OTP prevents code leakage outside class",
      "Zero hardware setup beyond existing smart displays"
    ],
    howItWorks: [
      "Faculty starts session on classroom SmartBoard",
      "Dynamic 6-digit OTP appears on screen",
      "Students submit code within valid time limit"
    ],
    targetRole: "Classroom Faculty & Students",
    productLink: "/products/smartboard",
    productLinkText: "Explore SmartBoard Suite"
  },
  {
    id: "att-3",
    category: "attendance",
    categoryLabel: "Attendance & Anti-Proxy",
    tag: "Student App",
    icon: Lock,
    title: "Hardware Device Binding",
    desc: "Lock student profiles to their verified primary smartphone hardware ID, preventing buddy punching and proxy account sharing completely.",
    highlight: "Anti-Proxy Device Lock",
    longDesc: "Binds student enrollment credentials to their registered mobile device ID. Prevents students from logging into absent peers' accounts or passing devices around during attendance sessions.",
    benefits: [
      "Stops buddy punching and account sharing",
      "Secure on-device cryptographic key verification",
      "Flags any attempt to sign in on unrecognized hardware"
    ],
    howItWorks: [
      "Student registers primary smartphone during semester enrollment",
      "App validates device hardware signature on each session submission",
      "Only verified device submissions are approved on faculty roster"
    ],
    targetRole: "Students & Campus Administrators",
    productLink: "/products/student",
    productLinkText: "View Student Mobile Suite"
  },
  {
    id: "att-4",
    category: "attendance",
    categoryLabel: "Attendance & Anti-Proxy",
    tag: "High Security",
    icon: Smartphone,
    title: "Biometric & Face Authentication",
    desc: "Leverage on-device facial and fingerprint biometrics via hardware secure enclaves for high-stakes examinations and laboratory practicals.",
    highlight: "Hardware Secure",
    longDesc: "Leverages on-device hardware biometric enclaves (Face ID / Fingerprint) to verify student identity before attendance confirmation during examinations and graded labs.",
    benefits: [
      "100% proxy-proof identity verification",
      "Biometric data never leaves student device (100% private)",
      "Instant sub-second authentication speed"
    ],
    howItWorks: [
      "Student completes facial or fingerprint scan on device",
      "Secure hardware enclave validates biometric token",
      "Verified attendance record syncs to university database"
    ],
    targetRole: "Exam Coordinators & Lab Faculty",
    productLink: "/enterprise-support",
    productLinkText: "Read Security Specifications"
  },

  // 2. SmartBoard & Classroom Sync
  {
    id: "sb-1",
    category: "smartboard",
    categoryLabel: "Smart Classroom",
    tag: "SmartBoard Display",
    icon: MonitorPlay,
    title: "Instant Screen Wireless Pairing",
    desc: "Faculty connect laptops, tablets, and mobile devices to classroom interactive displays in seconds without USB pen drives or cables.",
    highlight: "No USB Drives Needed",
    longDesc: "Allows educators to walk into any lecture hall and pair their personal laptop, tablet, or phone to the interactive smart display in seconds without HDMI cables or USB drives.",
    benefits: [
      "No tangled HDMI cables or lost adapter dongles",
      "Eliminates malware risk from shared USB pen drives",
      "Works across Windows, Mac, iPad, Android, and Linux"
    ],
    howItWorks: [
      "Enter classroom and turn on the SmartBoard screen",
      "Scan QR code or enter classroom pairing PIN",
      "Screen streams presentations and live board notes instantly"
    ],
    targetRole: "Faculty & Visiting Lecturers",
    productLink: "/products/smartboard",
    productLinkText: "Explore SmartBoard"
  },
  {
    id: "sb-2",
    category: "smartboard",
    categoryLabel: "Smart Classroom",
    tag: "Classroom Broadcast",
    icon: Share2,
    title: "Resource & Lecture Slide Pushing",
    desc: "Push presentations, syllabus units, code snippets, and lab manuals directly to students' devices and the classroom screen simultaneously.",
    highlight: "Instant Sync",
    longDesc: "Synchronizes lecture slides, code repositories, PDFs, and assignment materials between the main smart display and student personal devices simultaneously.",
    benefits: [
      "Students receive slides and code snippets directly on phones",
      "Zero need to take photos of whiteboards",
      "Archived automatically in student resource libraries"
    ],
    howItWorks: [
      "Faculty uploads lecture materials or opens slides",
      "SmartBoard broadcasts material to enrolled cohort",
      "Students open notes instantly in their personal app"
    ],
    targetRole: "Professors & Students",
    productLink: "/products/faculty",
    productLinkText: "Explore Faculty Tools"
  },
  {
    id: "sb-3",
    category: "smartboard",
    categoryLabel: "Smart Classroom",
    tag: "Campus Safety",
    icon: AlertTriangle,
    title: "Emergency Campus Broadcast Mode",
    desc: "Instantly override all active classroom screens campus-wide to broadcast fire alarms, weather warnings, and urgent evacuation routing.",
    highlight: "Campus-Wide Safety",
    longDesc: "Allows campus administration to immediately override all active classroom smart boards across campus to broadcast real-time fire alarms, weather warnings, and evacuation route maps.",
    benefits: [
      "Campus-wide visual alarm coverage in under 2 seconds",
      "Shows clear room-specific evacuation path maps",
      "Audio siren accompanied by high-contrast visual display"
    ],
    howItWorks: [
      "Security team triggers emergency protocol in admin console",
      "All connected smart boards switch to alert mode",
      "Displays real-time evacuation routes and safety steps"
    ],
    targetRole: "Campus Security & Administration",
    productLink: "/solutions/universities",
    productLinkText: "Explore University Solutions"
  },
  {
    id: "sb-4",
    category: "smartboard",
    categoryLabel: "Smart Classroom",
    tag: "Digital Signage",
    icon: Megaphone,
    title: "Idle Classroom Digital Signage",
    desc: "Unused classroom smart boards automatically cycle through daily timetables, departmental announcements, sports updates, and placement news.",
    highlight: "Zero Idle Screen Time",
    longDesc: "Transforms idle classroom displays between lecture periods into dynamic campus signage displaying daily class timetables, upcoming events, placement notices, and announcements.",
    benefits: [
      "Puts unused screens to productive use",
      "Keeps students informed between class periods",
      "Remote content scheduling from administrative portal"
    ],
    howItWorks: [
      "Classroom session ends and screen enters standby",
      "SmartBoard displays departmental announcements",
      "Automatically switches back when next lecture starts"
    ],
    targetRole: "Department Staff & Student Councils",
    productLink: "/products/smartboard",
    productLinkText: "Explore SmartBoard Features"
  },

  // 3. Faculty Suite & Timetable
  {
    id: "fac-1",
    category: "faculty",
    categoryLabel: "Faculty Suite",
    tag: "Faculty Portal",
    icon: Calendar,
    title: "Automated Timetable Scheduling",
    desc: "Synchronize daily teaching schedules, lab sessions, and subject cohorts across assigned departments with zero calendar conflicts.",
    highlight: "Live Schedule Sync",
    longDesc: "Centralized timetable manager that syncs faculty daily lecture schedules, assigned lab batches, and classroom room numbers with zero calendar collisions.",
    benefits: [
      "Zero room or faculty schedule overlapping",
      "Live updates when schedules or rooms change",
      "Syncs directly to faculty mobile and web dashboards"
    ],
    howItWorks: [
      "Department uploads master academic timetable",
      "Faculty views daily lecture sequence in morning",
      "One-click navigation to current active session"
    ],
    targetRole: "Faculty, HODs & Academic Deans",
    productLink: "/products/faculty",
    productLinkText: "Explore Faculty Timetable"
  },
  {
    id: "fac-2",
    category: "faculty",
    categoryLabel: "Faculty Suite",
    tag: "Faculty Portal",
    icon: UserCheck,
    title: "Leave Management & Substitution",
    desc: "Submit leave applications in 1 tap with automated substitute faculty allocation, timetable swaps, and student timetable updates.",
    highlight: "Zero Lost Lecture Hours",
    longDesc: "Enables faculty members to apply for casual or medical leave with one tap while automatically suggesting and routing substitution requests to available departmental colleagues.",
    benefits: [
      "Eliminates lost lecture and lab hours",
      "Automated notifications sent to students about substitutes",
      "One-click HOD approval workflow"
    ],
    howItWorks: [
      "Faculty submits leave dates and affected sessions",
      "System identifies available substitute faculty",
      "HOD approves and student timetable updates live"
    ],
    targetRole: "Professors & Department HODs",
    productLink: "/products/faculty",
    productLinkText: "Explore Faculty Suite"
  },
  {
    id: "fac-3",
    category: "faculty",
    categoryLabel: "Faculty Suite",
    tag: "Faculty Portal",
    icon: FileSpreadsheet,
    title: "Curriculum Progress Tracker",
    desc: "Log syllabus units covered, lab milestones completed, and lesson plans against university academic calendar deadlines.",
    highlight: "Syllabus Compliance",
    longDesc: "Tracks lesson plan completion, syllabus units taught, and practical lab experiments against university academic calendar deadlines.",
    benefits: [
      "Prevents last-minute syllabus rushes before exams",
      "Automated weekly progress reports for HOD reviews",
      "Transparent student syllabus tracking"
    ],
    howItWorks: [
      "Faculty logs units covered at end of each session",
      "Progress bar updates against total course credits",
      "Department head reviews semester completion status"
    ],
    targetRole: "Department Heads & Faculty",
    productLink: "/products/faculty",
    productLinkText: "View Curriculum Management"
  },

  // 4. Student Suite & Mobile
  {
    id: "stu-1",
    category: "student",
    categoryLabel: "Student Suite",
    tag: "Student App",
    icon: GraduationCap,
    title: "Real-Time Percentage Tracker",
    desc: "Track subject-wise and overall attendance live. Real-time updates notify students immediately after every class period.",
    highlight: "Live Student Metrics",
    longDesc: "Gives students an instant, transparent view of their daily and subject-wise attendance percentages updated seconds after every lecture concludes.",
    benefits: [
      "Zero surprises at the end of the semester",
      "Clear breakdown of lectures attended vs total held",
      "Encourages self-accountability and consistency"
    ],
    howItWorks: [
      "Faculty submits lecture attendance",
      "Student mobile app receives live push notification",
      "Subject percentage updates immediately on dashboard"
    ],
    targetRole: "Students & Class Representatives",
    productLink: "/products/student",
    productLinkText: "Explore Student App"
  },
  {
    id: "stu-2",
    category: "student",
    categoryLabel: "Student Suite",
    tag: "Student App",
    icon: Calculator,
    title: "75% Exam Eligibility Calculator",
    desc: "Smart threshold engine warns students before they slip into the debarment zone, calculating exactly how many classes they need to attend.",
    highlight: "Exam Debarment Shield",
    longDesc: "Proactively monitors university mandatory attendance thresholds (e.g. 75% rule) and calculates exactly how many upcoming classes a student must attend to stay exam-eligible.",
    benefits: [
      "Prevents exam debarment and condonation fines",
      "Visual color-coded status (Safe, Warning, Critical)",
      "Simulates future attendance scenarios"
    ],
    howItWorks: [
      "Algorithm calculates current attendance against semester target",
      "Flags yellow/red alert when dropping near 75%",
      "Calculates minimum upcoming classes needed to recover"
    ],
    targetRole: "Students, Mentors & Guardians",
    productLink: "/products/student",
    productLinkText: "See Student Dashboard"
  },
  {
    id: "stu-3",
    category: "student",
    categoryLabel: "Student Suite",
    tag: "Student App",
    icon: Bell,
    title: "Parent Notifications & Circulars",
    desc: "Automated alerts for parents on absences, low attendance, upcoming midterms, and fee payment deadlines via WhatsApp and SMS.",
    highlight: "Automated Parent Alerts",
    longDesc: "Sends automated notifications via SMS, WhatsApp, and parent app when students are marked absent or attendance falls below compliance thresholds.",
    benefits: [
      "Keeps parents proactively informed throughout semester",
      "Drastically cuts down mid-term parent grievances",
      "Zero manual calling required from faculty mentors"
    ],
    howItWorks: [
      "System detects student absence during morning roll call",
      "Automated SMS/WhatsApp message generated",
      "Parent views detailed monthly attendance summary"
    ],
    targetRole: "Parents & Student Mentors",
    productLink: "/solutions/k12",
    productLinkText: "View Parent Solutions"
  },

  // 5. AI Analytics & Insights
  {
    id: "ai-1",
    category: "ai",
    categoryLabel: "AI & Analytics",
    tag: "AI Analytics",
    icon: BrainCircuit,
    title: "Predictive Drop-out & Risk Scoring",
    desc: "Machine learning analyzes historical attendance patterns to identify disengaged or at-risk students 3 weeks prior to midterm exams.",
    highlight: "Early Warning ML",
    longDesc: "Applies machine learning models to identify subtle attendance drop-off patterns, flagging disengaged or at-risk students up to 3 weeks before midterm exams.",
    benefits: [
      "Early intervention before academic failure occurs",
      "Helps academic mentors reach out to struggling students",
      "Boosts institutional retention and graduation rates"
    ],
    howItWorks: [
      "AI engine ingests historical attendance trends",
      "Calculates risk probability scores per student cohort",
      "Alerts faculty mentors and counselors for early action"
    ],
    targetRole: "Academic Mentors, Deans & HODs",
    productLink: "/analytics",
    productLinkText: "Explore AI Analytics"
  },
  {
    id: "ai-2",
    category: "ai",
    categoryLabel: "AI & Analytics",
    tag: "AI Analytics",
    icon: BarChart3,
    title: "Cognitive Engagement Analytics",
    desc: "Correlate attendance trends with academic test scores to give HODs and faculty clear insights into lecture comprehension.",
    highlight: "Cohort Performance",
    longDesc: "Cross-references attendance timing, student question interactions, and quiz scores to measure active classroom retention across departments.",
    benefits: [
      "Identifies subjects with low student engagement",
      "Helps refine lecture delivery and scheduling",
      "Comparative insights between morning vs afternoon sessions"
    ],
    howItWorks: [
      "Aggregates session timing and quiz attendance",
      "Generates interactive engagement score charts",
      "Faculty reviews insights to adjust lecture pace"
    ],
    targetRole: "HODs, Professors & Institutional Directors",
    productLink: "/analytics",
    productLinkText: "View Engagement Scoring"
  },
  {
    id: "ai-3",
    category: "ai",
    categoryLabel: "AI & Analytics",
    tag: "Accreditation",
    icon: CheckCircle2,
    title: "1-Click Regulatory Audit Reports",
    desc: "Export auditable attendance registers and parent notification logs formatted directly for AICTE, UGC, NAAC, and university committees.",
    highlight: "Audit-Ready Exports",
    longDesc: "Generates formatted, compliant attendance registers ready for university inspections, AICTE, UGC, NAAC, and NBA accreditation committees.",
    benefits: [
      "Saves hundreds of administrative hours during audit season",
      "Zero discrepancy between physical and digital records",
      "Instant PDF and Excel formatted exports"
    ],
    howItWorks: [
      "Select department, semester, and target regulatory format",
      "System compiles verified session data and logs",
      "Download signed, auditable reports in one click"
    ],
    targetRole: "Principals, Registrars & Accreditation Coordinators",
    productLink: "/analytics",
    productLinkText: "Explore Compliance Reports"
  },

  // 6. Security & Infrastructure
  {
    id: "sec-1",
    category: "security",
    categoryLabel: "Security & Cloud",
    tag: "Enterprise",
    icon: Lock,
    title: "Role-Based Access Control (RBAC)",
    desc: "Granular access layers for Principals, HODs, Professors, Lab Assistants, IT Admins, and Student Cohorts.",
    highlight: "Institutional Hierarchy",
    longDesc: "Granular institutional permission tiers ensuring users only access data relevant to their role—from Principals and HODs down to Professors and Students.",
    benefits: [
      "Prevents unauthorized grade or attendance tampering",
      "Clear administrative hierarchy matching college structure",
      "Audit logs track every edit and login attempt"
    ],
    howItWorks: [
      "Institutional admin assigns roles to staff and faculty",
      "Permissions enforce read/write access per department",
      "Full activity trail logged for institutional security"
    ],
    targetRole: "Campus IT Directors & Registrars",
    productLink: "/enterprise-support",
    productLinkText: "View Enterprise Support"
  },
  {
    id: "sec-2",
    category: "security",
    categoryLabel: "Security & Cloud",
    tag: "Enterprise",
    icon: Cloud,
    title: "Encrypted Cloud & 99.9% Uptime",
    desc: "Bank-grade AES-256 encrypted storage, daily automated backups, DPDP/FERPA student privacy compliance, and continuous 99.9% uptime SLA.",
    highlight: "Bank-Grade Encryption",
    longDesc: "Bank-grade AES-256 database encryption, automated daily off-site backups, DPDP/FERPA student data compliance, and 99.9% guaranteed uptime SLA.",
    benefits: [
      "Student data privacy guaranteed against leaks",
      "Zero server downtime during morning 9:00 AM class rush",
      "Continuous automatic disaster recovery backups"
    ],
    howItWorks: [
      "All API traffic encrypted with TLS 1.3 and AES-256",
      "Distributed cloud infrastructure handles peak roll-call loads",
      "Real-time health monitoring prevents service disruption"
    ],
    targetRole: "Campus IT Teams & Legal Officers",
    productLink: "/enterprise-support",
    productLinkText: "Read Security Whitepaper"
  },
  {
    id: "sec-3",
    category: "security",
    categoryLabel: "Security & Cloud",
    tag: "Campus IT",
    icon: ShieldCheck,
    title: "ERP & SIS Interoperability",
    desc: "Seamless two-way data sync with existing university ERP systems, student registers, and biometric hardware.",
    highlight: "Zero Manual Re-Entry",
    longDesc: "Two-way integration engine syncing student enrollment registers, fee clearance status, and biometric hardware with existing university ERP software.",
    benefits: [
      "Zero duplicate manual data entry for staff",
      "Synchronizes student admissions and section rosters",
      "Compatible with leading university ERP systems"
    ],
    howItWorks: [
      "Secure API connector connects to campus ERP database",
      "Syncs student rosters, course codes, and faculty IDs",
      "Pushes attendance records back to university records"
    ],
    targetRole: "University IT & Software Teams",
    productLink: "/join",
    productLinkText: "Explore Tech Integrations"
  }
];

const CATEGORIES = [
  { id: "all", label: "All Features" },
  { id: "attendance", label: "Attendance & Proxy Prevention" },
  { id: "smartboard", label: "SmartBoard Display" },
  { id: "faculty", label: "Faculty Suite" },
  { id: "student", label: "Student App" },
  { id: "ai", label: "AI Analytics" },
  { id: "security", label: "Security & Cloud" },
] as const;

export default function FeaturesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedFeature(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background page scrolling when feature details modal is open
  useEffect(() => {
    if (selectedFeature) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedFeature]);

  const filteredFeatures = useMemo(() => {
    return ALL_FEATURES.filter((f) => {
      const matchesCategory = activeCategory === "all" || f.category === activeCategory;
      const matchesSearch = 
        searchQuery.trim() === "" ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.highlight.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="pt-36 pb-28 min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-14"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-[#0F172A] tracking-tight mb-6">
            Everything You Need for a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Truly Smart Campus</span>
          </h1>
          <p className="text-lg md:text-xl text-[#64748B] leading-relaxed max-w-2xl mx-auto">
            From 1-tap attendance and SmartBoard sync to predictive AI insights and parent alerts—discover how IntelliAttend runs modern institutions.
          </p>
        </motion.div>

        {/* Search & Filter Controls */}
        <div className="max-w-5xl mx-auto mb-12 space-y-6">
          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features (e.g. SmartBoard, OTP, Proxy, 75%, Analytics)..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-sm transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-3 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full px-2 py-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md scale-105"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  onClick={() => setSelectedFeature(f)}
                  className="bg-white p-7 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-teal-500/10 border border-slate-200/80 flex flex-col justify-between transition-all group cursor-pointer hover:border-teal-500/40"
                >
                  <div>
                    {/* Top Tag & Highlight */}
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
                        {f.tag}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">
                        {f.highlight}
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-center gap-3.5 mb-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-200 shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-[#0F172A] leading-tight group-hover:text-teal-700 transition-colors">
                        {f.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                      {f.desc}
                    </p>
                  </div>

                  {/* Bottom Category Info & Learn More Action */}
                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium text-slate-500">{f.categoryLabel}</span>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFeature(f);
                      }}
                      className="text-teal-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 cursor-pointer hover:text-teal-700"
                    >
                      <span>Learn more</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty Search Result */}
        {filteredFeatures.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-base mb-3">No features matching &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
              className="text-sm font-bold text-teal-600 hover:underline cursor-pointer"
            >
              Reset filters &amp; view all {ALL_FEATURES.length} features
            </button>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-24 max-w-5xl mx-auto rounded-3xl bg-slate-900 text-white p-10 md:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                Experience All Features on Your Campus
              </h2>
              <p className="text-slate-300 text-sm md:text-base max-w-xl">
                Schedule a live demonstration or deploy a free pilot in your department to see IntelliAttend in action.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/#contact"
                className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-full text-sm shadow-lg transition-transform active:scale-95"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Feature Deep-Dive Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <div 
            data-lenis-prevent="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto overscroll-contain"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Dialog Card */}
            <motion.div
              data-lenis-prevent="true"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-auto flex flex-col max-h-[88vh]"
            >
              {/* Modal Top Header Bar */}
              <div className="bg-[#0F172A] p-6 sm:p-8 text-white relative shrink-0">
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <selectedFeature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10">
                          {selectedFeature.tag}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-md">
                          {selectedFeature.highlight}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                        {selectedFeature.title}
                      </h2>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Close dialog (Esc)"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body Content */}
              <div 
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                className="p-6 sm:p-8 space-y-6 overflow-y-auto overscroll-contain flex-1"
              >
                {/* Long Overview */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Feature Overview
                  </h4>
                  <p className="text-base text-slate-700 leading-relaxed font-normal">
                    {selectedFeature.longDesc}
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    Key Capabilities &amp; Institutional Benefits
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedFeature.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 font-medium">
                        <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* How It Works Steps */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Operational Workflow
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedFeature.howItWorks.map((step, idx) => (
                      <div 
                        key={idx} 
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left flex flex-col justify-between"
                      >
                        <span className="text-xs font-bold text-white bg-slate-900 w-6 h-6 rounded-md flex items-center justify-center mb-3 shadow-2xs">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Audience Pill */}
                <div className="flex items-center justify-between text-xs p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span><strong className="text-slate-900">Primary Users:</strong> {selectedFeature.targetRole}</span>
                  </div>
                  <span className="font-semibold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200/80 shadow-2xs">
                    {selectedFeature.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <Link
                  href={selectedFeature.productLink}
                  onClick={() => setSelectedFeature(null)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <span>{selectedFeature.productLinkText}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/#contact"
                  onClick={() => setSelectedFeature(null)}
                  className="w-full sm:w-auto text-center px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
                >
                  Request Pilot
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
