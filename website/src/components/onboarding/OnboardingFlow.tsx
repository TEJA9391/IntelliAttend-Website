"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  BookOpen,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  MessageCircle,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { CONTACT_INFO } from "@/config/constants";

const INST_TYPES = [
  { id: "uni", title: "University", icon: <Building className="w-7 h-7" /> },
  { id: "col", title: "College", icon: <GraduationCap className="w-7 h-7" /> },
  { id: "k12", title: "K-12 School", icon: <BookOpen className="w-7 h-7" /> },
  { id: "trn", title: "Training Institute", icon: <Briefcase className="w-7 h-7" /> },
] as const;

const PLATFORM_NEEDS = [
  "Attendance Management",
  "SmartBoard Integration",
  "Faculty Portal",
  "Student Portal",
  "Parent App",
  "Campus Analytics",
  "Notifications",
] as const;

const STUDENT_RANGES = ["Under 1,000", "1,000 - 5,000", "5,000 - 20,000", "20,000+"];
const FACULTY_RANGES = ["Under 100", "100 - 500", "500 - 2,000", "2,000+"];
const TIME_SLOTS = [
  "Morning (9AM - 12PM)",
  "Afternoon (12PM - 4PM)",
  "Evening (4PM - 6PM)",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [minDate, setMinDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitMode, setSubmitMode] = useState<"demo" | "sales">("demo");
  const [whatsappHref, setWhatsappHref] = useState<string>(CONTACT_INFO.whatsappUrl);
  const [emailHref, setEmailHref] = useState<string>(`mailto:${CONTACT_INFO.email}`);
  const [copied, setCopied] = useState(false);

  const [instType, setInstType] = useState("");
  const [orgDetails, setOrgDetails] = useState({
    institutionName: "",
    contactPerson: "",
    workEmail: "",
    phoneNumber: "",
    studentsCount: STUDENT_RANGES[0],
    facultyCount: FACULTY_RANGES[0],
  });
  const [needs, setNeeds] = useState<string[]>([]);
  const [demoDetails, setDemoDetails] = useState({
    preferredDate: "",
    preferredTime: TIME_SLOTS[0],
    requirements: "",
  });

  const selectedInstTitle =
    INST_TYPES.find((t) => t.id === instType)?.title ?? "Not specified";

  const goToStep = (nextStep: number) => {
    if (nextStep === 4 && !minDate) {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      setMinDate(`${yyyy}-${mm}-${dd}`);
    }
    setError(null);
    setStep(nextStep);
  };

  const handleBack = () => goToStep(step - 1);

  const toggleNeed = (need: string) => {
    setError(null);
    setNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleStep1Next = () => {
    if (!instType) {
      setError("Please select your institution type to continue.");
      return;
    }
    goToStep(2);
  };

  const handleStep2Next = () => {
    const { institutionName, contactPerson, workEmail, phoneNumber } = orgDetails;
    if (!institutionName.trim()) {
      setError("Please enter your institution name.");
      return;
    }
    if (!contactPerson.trim()) {
      setError("Please enter a primary contact name.");
      return;
    }
    if (!EMAIL_REGEX.test(workEmail.trim())) {
      setError("Please enter a valid institutional email address.");
      return;
    }
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    if (digitsOnly.length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }
    goToStep(3);
  };

  const handleStep3Next = () => {
    if (needs.length === 0) {
      setError("Please select at least one platform feature.");
      return;
    }
    goToStep(4);
  };

  const buildInquiryText = (mode: "demo" | "sales", useWhatsAppFormatting: boolean): string => {
    const b = (text: string) => (useWhatsAppFormatting ? `*${text}*` : text);
    const header =
      mode === "demo"
        ? "New Demo Request (Get Started)"
        : "New Enterprise Sales Inquiry (Get Started)";

    const lines = [
      b(header),
      "",
      `🏛 ${b("Institution Type:")} ${selectedInstTitle}`,
      `🏢 ${b("Institution:")} ${orgDetails.institutionName.trim()}`,
      `👤 ${b("Contact Person:")} ${orgDetails.contactPerson.trim()}`,
      `📧 ${b("Work Email:")} ${orgDetails.workEmail.trim()}`,
      `📱 ${b("Phone:")} ${orgDetails.phoneNumber.trim()}`,
      `👥 ${b("Students:")} ${orgDetails.studentsCount}`,
      `🎓 ${b("Faculty:")} ${orgDetails.facultyCount}`,
      `🎯 ${b("Interested Modules:")} ${needs.length > 0 ? needs.join(", ") : "All Modules"}`,
    ];

    if (mode === "demo") {
      lines.push(
        `📅 ${b("Preferred Date:")} ${demoDetails.preferredDate || "Flexible"}`,
        `⏰ ${b("Time Slot:")} ${demoDetails.preferredTime || "Any"}`
      );
    }

    if (demoDetails.requirements.trim()) {
      lines.push(`📝 ${b("Additional Notes:")} ${demoDetails.requirements.trim()}`);
    }

    return lines.join("\n");
  };

  const buildWhatsAppUrl = (mode: "demo" | "sales"): string => {
    const phoneDigits = CONTACT_INFO.whatsapp.replace(/\D/g, "");
    const message = buildInquiryText(mode, true);
    return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
  };

  const buildEmailUrl = (mode: "demo" | "sales"): string => {
    const prefix = mode === "demo" ? "Demo Request" : "Enterprise Sales Inquiry";
    const subject = `IntelliAttend ${prefix} - ${orgDetails.institutionName.trim()}`;
    const body = buildInquiryText(mode, false);
    return `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyInquiry = async () => {
    try {
      const text = buildInquiryText(submitMode, true);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard fallback
    }
  };

  const handleSubmit = (mode: "demo" | "sales") => {
    if (mode === "demo" && !demoDetails.preferredDate) {
      setError("Please select a preferred date for your demo, or click Contact Sales Instead.");
      return;
    }

    const waUrl = buildWhatsAppUrl(mode);
    const mailUrl = buildEmailUrl(mode);
    setWhatsappHref(waUrl);
    setEmailHref(mailUrl);
    setSubmitMode(mode);

    try {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch {
      // browser popup blocked; user can tap 'Open WhatsApp' on Step 5
    }

    goToStep(5);
  };

  const handleReset = () => {
    setInstType("");
    setOrgDetails({
      institutionName: "",
      contactPerson: "",
      workEmail: "",
      phoneNumber: "",
      studentsCount: STUDENT_RANGES[0],
      facultyCount: FACULTY_RANGES[0],
    });
    setNeeds([]);
    setDemoDetails({
      preferredDate: "",
      preferredTime: TIME_SLOTS[0],
      requirements: "",
    });
    setWhatsappHref(CONTACT_INFO.whatsappUrl);
    setEmailHref(`mailto:${CONTACT_INFO.email}`);
    goToStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col min-h-[600px]">
      {/* Header / Progress bar */}
      <div className="bg-[#F8FAFC] border-b border-slate-100 p-6 md:px-8 md:py-6 flex justify-between items-center gap-4">
        {step > 1 && step < 5 ? (
          <button
            type="button"
            onClick={handleBack}
            className="text-[#64748B] hover:text-[#0F172A] flex items-center gap-2 font-semibold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : (
          <div className="text-[#0F172A] font-semibold text-sm">
            {step < 5 ? "Get Started" : "Submission Ready"}
          </div>
        )}

        {step < 5 && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              Step {step} of 4
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-8 sm:w-10 h-1.5 rounded-full transition-colors duration-200 ${
                    s <= step ? "bg-primary" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 p-6 md:p-10 relative flex flex-col">
        {error && (
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Institution Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-2 tracking-tight">
                Choose Your Institution Type
              </h2>
              <p className="text-[#64748B] mb-8 text-sm sm:text-base">
                Select the option that best describes your organization.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-auto">
                {INST_TYPES.map((type) => {
                  const selected = instType === type.id;
                  return (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => {
                        setError(null);
                        setInstType(type.id);
                      }}
                      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3.5 ${
                        selected
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-slate-200 hover:border-primary/40 hover:bg-[#F8FAFC] text-[#64748B]"
                      }`}
                    >
                      {selected && (
                        <CheckCircle2 className="w-5 h-5 text-primary absolute top-3.5 right-3.5" />
                      )}
                      <div className={selected ? "text-primary" : "text-[#64748B]"}>
                        {type.icon}
                      </div>
                      <span className="font-bold text-[#0F172A]">{type.title}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={!instType}
                  onClick={handleStep1Next}
                  className="bg-primary disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center gap-2 hover:bg-primary/90 shadow-md cursor-pointer"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Org Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-2 tracking-tight">
                Organization Details
              </h2>
              <p className="text-[#64748B] mb-6 text-sm sm:text-base">
                Tell us a bit about your {selectedInstTitle.toLowerCase()}.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-auto">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#0F172A]">
                    Institution Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={orgDetails.institutionName}
                    onChange={(e) => {
                      setError(null);
                      setOrgDetails((prev) => ({
                        ...prev,
                        institutionName: e.target.value,
                      }));
                    }}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white transition-colors"
                    placeholder="e.g. Malla Reddy Colleges"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#0F172A]">
                    Contact Person <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={orgDetails.contactPerson}
                    onChange={(e) => {
                      setError(null);
                      setOrgDetails((prev) => ({
                        ...prev,
                        contactPerson: e.target.value,
                      }));
                    }}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white transition-colors"
                    placeholder="e.g. Dr. Ravi Kumar"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#0F172A]">
                    Work Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={orgDetails.workEmail}
                    onChange={(e) => {
                      setError(null);
                      setOrgDetails((prev) => ({
                        ...prev,
                        workEmail: e.target.value,
                      }));
                    }}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white transition-colors"
                    placeholder="admin@institution.edu.in"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#0F172A]">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={orgDetails.phoneNumber}
                    onChange={(e) => {
                      setError(null);
                      setOrgDetails((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }));
                    }}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#0F172A]">
                    Number of Students
                  </label>
                  <select
                    value={orgDetails.studentsCount}
                    onChange={(e) =>
                      setOrgDetails((prev) => ({
                        ...prev,
                        studentsCount: e.target.value,
                      }))
                    }
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white transition-colors"
                  >
                    {STUDENT_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#0F172A]">
                    Number of Faculty
                  </label>
                  <select
                    value={orgDetails.facultyCount}
                    onChange={(e) =>
                      setOrgDetails((prev) => ({
                        ...prev,
                        facultyCount: e.target.value,
                      }))
                    }
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white transition-colors"
                  >
                    {FACULTY_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleStep2Next}
                  className="bg-primary text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center gap-2 hover:bg-primary/90 shadow-md cursor-pointer"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Platform Needs */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-2 tracking-tight">
                Platform Needs
              </h2>
              <p className="text-[#64748B] mb-6 text-sm sm:text-base">
                Select one or more IntelliAttend modules for your campus.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-auto">
                {PLATFORM_NEEDS.map((need) => {
                  const active = needs.includes(need);
                  return (
                    <button
                      type="button"
                      key={need}
                      onClick={() => toggleNeed(need)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 text-left ${
                        active
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 hover:border-primary/40 hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          active
                            ? "bg-primary border-primary"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {active && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <span
                        className={`font-bold text-sm sm:text-base ${
                          active ? "text-primary" : "text-[#0F172A]"
                        }`}
                      >
                        {need}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={needs.length === 0}
                  onClick={handleStep3Next}
                  className="bg-primary disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center gap-2 hover:bg-primary/90 shadow-md cursor-pointer"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Schedule Demo */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-2 tracking-tight">
                Schedule a Demo
              </h2>
              <p className="text-[#64748B] mb-6 text-sm sm:text-base">
                Pick a convenient slot or connect directly with our onboarding team via WhatsApp.
              </p>

              <div className="space-y-5 mb-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#0F172A]">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      value={demoDetails.preferredDate}
                      onChange={(e) => {
                        setError(null);
                        setDemoDetails((prev) => ({
                          ...prev,
                          preferredDate: e.target.value,
                        }));
                      }}
                      className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#0F172A]">
                      Preferred Time
                    </label>
                    <select
                      value={demoDetails.preferredTime}
                      onChange={(e) =>
                        setDemoDetails((prev) => ({
                          ...prev,
                          preferredTime: e.target.value,
                        }))
                      }
                      className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white transition-colors"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#0F172A]">
                    Additional Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={demoDetails.requirements}
                    onChange={(e) =>
                      setDemoDetails((prev) => ({
                        ...prev,
                        requirements: e.target.value,
                      }))
                    }
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white transition-colors resize-none"
                    placeholder="Share details about your classrooms, SmartBoards, or rollout timeline..."
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => handleSubmit("sales")}
                  className="bg-slate-100 text-[#0F172A] font-bold py-3 px-6 rounded-xl transition-colors hover:bg-slate-200 text-center cursor-pointer"
                >
                  Contact Sales Instead
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit("demo")}
                  className="bg-primary text-white font-bold py-3 px-7 rounded-xl transition-colors hover:bg-primary/90 shadow-md text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Request Demo
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Confirmation */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col items-center justify-center text-center py-4"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-[#0F172A] mb-3 tracking-tight">
                {submitMode === "demo" ? "Demo Request Ready!" : "Inquiry Ready!"}
              </h2>
              <p className="text-[#64748B] mb-8 max-w-md text-sm sm:text-base leading-relaxed">
                Your onboarding brief for{" "}
                <span className="font-semibold text-[#0F172A]">
                  {orgDetails.institutionName.trim()}
                </span>{" "}
                has been prepared for WhatsApp. Send the message in WhatsApp or email our team directly.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                <a
                  href={whatsappHref || buildWhatsAppUrl(submitMode)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-emerald-700 transition-colors shadow-md inline-flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Open WhatsApp
                </a>
                <a
                  href={emailHref || buildEmailUrl(submitMode)}
                  className="bg-slate-100 text-[#0F172A] font-bold py-3 px-6 rounded-xl hover:bg-slate-200 transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  Email Team
                </a>
                <button
                  type="button"
                  onClick={handleCopyInquiry}
                  className="border border-slate-200 bg-white text-slate-700 font-bold py-3 px-5 rounded-xl hover:bg-slate-50 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                  title="Copy formatted inquiry to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Copy Details</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <button
                  type="button"
                  onClick={handleReset}
                  className="font-semibold text-primary hover:underline cursor-pointer"
                >
                  Submit another request
                </button>
                <Link
                  href="/"
                  className="font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
