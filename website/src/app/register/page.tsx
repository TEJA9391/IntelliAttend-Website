"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, EyeOff, Eye, ArrowRight, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push(`/portal/${role}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-primary/10 selection:text-[#0F172A]">
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl opacity-50"></div>
      </div>

      <Link href="/login" className="absolute top-8 left-8 inline-flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] font-medium transition-colors z-50 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm">
        <ArrowLeft className="w-4 h-4" /> Back to login
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          
          <div className="p-8 text-center border-b border-slate-100">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
              Explore Demo Sandbox
            </h1>
            <p className="text-[#64748B] text-sm">
              Launch an interactive preview with synthetic data. Real institutional accounts are provisioned by your campus IT administrator.
            </p>
          </div>

          <form onSubmit={handleRegister} className="p-8 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0F172A]">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-[#0F172A] placeholder:text-[#64748B]"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0F172A]">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-[#0F172A] placeholder:text-[#64748B]"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0F172A]">Password</label>
              <div className="relative">
                <input 
                  type={isPasswordVisible ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-[#0F172A] placeholder:text-[#64748B] pr-12"
                  placeholder="Create a strong password"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  {isPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0F172A]">I am a</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "student", label: "Student" },
                  { id: "faculty", label: "Faculty" },
                  { id: "admin", label: "Admin" }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                      role === r.id 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-slate-200 text-[#64748B] hover:border-slate-300"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-6 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="p-6 bg-[#F8FAFC] border-t border-slate-100 text-center">
            <p className="text-sm text-[#64748B]">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
