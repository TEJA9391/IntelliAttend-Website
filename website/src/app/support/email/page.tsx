"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, UploadCloud, FileText, CheckCircle2, 
  AlertCircle, Clock, ShieldAlert, ArrowLeft, X 
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { validateFiles } from "@/lib/file-security";

const SLAs = [
  { priority: "Critical", time: "< 1 hour", icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100" },
  { priority: "High", time: "< 4 hours", icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
  { priority: "Medium", time: "< 12 hours", icon: Clock, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
  { priority: "Low", time: "< 24 hours", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
];

export default function EmailSupportPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFiles([]);
      setFileErrors([]);
    }, 1500);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const { validFiles, errors } = validateFiles(droppedFiles);
      setFileErrors(errors);
      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const { validFiles, errors } = validateFiles(selectedFiles);
      setFileErrors(errors);
      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles]);
      }
      e.target.value = "";
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-6"
          >
            Contact Support by Email
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#64748B] leading-relaxed"
          >
            Can't find your answer? Send us a message and our support team will respond as quickly as possible.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          


          {/* Right Column: Form Area */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-8 lg:col-start-3 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative"
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="p-8 md:p-12"
                >
                  <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* User Details Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0F172A]">Full Name</label>
                        <input required type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0F172A]">Institution Name</label>
                        <input required type="text" placeholder="University of Technology" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0F172A]">Work Email</label>
                        <input required type="email" placeholder="john@university.edu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0F172A]">Phone Number (Optional)</label>
                        <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                      </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#0F172A]">Subject</label>
                      <select required defaultValue="" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] appearance-none cursor-pointer">
                        <option value="" disabled>Select a topic...</option>
                        <option>Technical Issue</option>
                        <option>Bug Report</option>
                        <option>Billing</option>
                        <option>Sales</option>
                        <option>General Question</option>
                        <option>Feature Request</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#0F172A]">Priority</label>
                      <select required defaultValue="" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] appearance-none cursor-pointer">
                        <option value="" disabled>Select priority...</option>
                        <option>Low - Question or general inquiry</option>
                        <option>Medium - Issue affecting a few users</option>
                        <option>High - Issue affecting many users</option>
                        <option>Critical - System down or severe data loss</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#0F172A]">Message</label>
                      <textarea 
                        required 
                        rows={5} 
                        placeholder="Please describe your issue in detail..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y" 
                      />
                    </div>

                    {/* Drag & Drop Area */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#0F172A]">Attachments (Optional)</label>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        multiple 
                        accept=".png,.jpg,.jpeg,.pdf,.txt,image/png,image/jpeg,application/pdf,text/plain"
                      />
                      
                      <div 
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group",
                          dragActive ? "border-primary bg-primary/5" : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"
                        )}
                      >
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-sm font-bold text-[#0F172A] mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500">PNG, JPG, PDF, or TXT only (strict max. 10MB per file)</p>
                      </div>

                      {/* Display Validation Errors */}
                      {fileErrors.length > 0 && (
                        <div className="mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                          <div className="font-bold flex items-center gap-1.5 text-rose-900">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>Upload Validation Warning</span>
                          </div>
                          <ul className="list-disc list-inside space-y-0.5 text-rose-700">
                            {fileErrors.map((err, idx) => (
                              <li key={idx}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Display Selected Files */}
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-4 h-4 text-primary" />
                                </div>
                                <div className="truncate">
                                  <p className="text-sm font-semibold text-[#0F172A] truncate">{file.name}</p>
                                  <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                              </div>
                              <button 
                                type="button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(index);
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Send Support Request <Send className="w-4 h-4" /></>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 md:p-20 text-center flex flex-col items-center justify-center h-full min-h-[600px]"
                >
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 relative">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20" 
                    />
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#0F172A] mb-4">Request Submitted Successfully!</h2>
                  <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                    Your support ticket <span className="font-bold text-slate-900">#TK-{Math.floor(Math.random() * 90000) + 10000}</span> has been created. Our team will review it and get back to you shortly based on the priority level.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Submit another request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
