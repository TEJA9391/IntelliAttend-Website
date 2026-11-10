"use client";

import { GraduationCap, Users, Shield, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { DotMap } from "@/components/ui/DotMap";

const ROLES = [
  {
    id: "faculty",
    title: "Faculty Portal",
    desc: "Manage classes, attendance, and SmartBoard.",
    icon: <GraduationCap className="w-5 h-5 text-teal-600" />,
    href: "https://dashboard.intelliattend.app/login", 
    bg: "bg-teal-50",
    hoverBorder: "hover:border-teal-500",
    hoverBg: "hover:bg-teal-50/50"
  },
  {
    id: "student",
    title: "Student Portal",
    desc: "View schedules, attendance, and resources.",
    icon: <Users className="w-5 h-5 text-emerald-600" />,
    href: "/login/student",
    bg: "bg-emerald-50",
    hoverBorder: "hover:border-emerald-500",
    hoverBg: "hover:bg-emerald-50/50"
  },
  {
    id: "admin",
    title: "Administrator Portal",
    desc: "Manage campus operations and analytics.",
    icon: <Shield className="w-5 h-5 text-violet-600" />,
    href: "/login/admin",
    bg: "bg-violet-50",
    hoverBorder: "hover:border-violet-500",
    hoverBg: "hover:bg-violet-50/50"
  }
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden selection:bg-teal-100 selection:text-teal-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl overflow-hidden rounded-2xl flex bg-white shadow-xl"
      >
        {/* Left side - Branding */}
        <div className="hidden md:block w-1/2 h-[600px] relative overflow-hidden border-r border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-teal-100">
            <DotMap dotColor="37, 99, 235" lineColor="#2DD4BF" />
            
            {/* Logo and text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.2 }}
                className="mb-6"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-200">
                  <Image src="/images/logo.png" alt="Logo" width={24} height={24} className="brightness-0 invert w-6 h-6 object-contain" />
                </div>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.2 }}
                className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-600"
              >
                IntelliAttend
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.2 }}
                className="text-sm text-center text-gray-600 max-w-xs"
              >
                Sign in to access your portal and manage your smart campus experience.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Right side - Roles List */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white relative h-[600px]">
          
          <Link 
            href="/" 
            className="absolute top-6 left-6 md:left-10 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors z-20 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </Link>

          <div className="text-center mb-8 mt-4">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500">
              Sign in to securely access your dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link 
                href="https://dashboard.intelliattend.app/login"
                className="flex items-center justify-between p-5 rounded-2xl border border-teal-200 bg-teal-50 cursor-pointer transition-all duration-200 group shadow-sm hover:shadow-md hover:border-teal-500 hover:bg-teal-50/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white border border-teal-100 shadow-sm">
                    <Shield className="w-6 h-6 text-teal-600" />
                  </div>
                  
                  <div className="text-left">
                    <h3 className="text-[16px] font-bold text-slate-900 group-hover:text-teal-700 transition-colors">Access Portal</h3>
                    <p className="text-[13px] text-teal-700/70 mt-0.5 leading-snug">Sign in to your unified dashboard</p>
                  </div>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-teal-600 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </Link>
            </motion.div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              New to IntelliAttend?{' '}
              <Link href="/get-started" className="text-teal-600 font-semibold hover:text-teal-700 hover:underline transition-colors">
                Request access
              </Link>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
