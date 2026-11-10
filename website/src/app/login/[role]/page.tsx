"use client";

import React, { useRef, useEffect, useState, use } from "react";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { DotMap } from "@/components/ui/DotMap";

// Helper function to merge class names
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

// Custom Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}

const Button = ({ 
  children, 
  variant = "default", 
  className = "", 
  ...props 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantStyles = {
    default: "bg-primary bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = ({ className = "", ...props }: InputProps) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-gray-800 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

const SignInCard = ({ role }: { role: string }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  
  const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);
  const roleKey = role.toLowerCase();
  
  const themes = {
    faculty: {
      gradientText: "from-teal-600 to-teal-600",
      gradientBg: "from-teal-500 to-teal-600",
      hoverGradientBg: "hover:from-teal-600 hover:to-teal-700",
      shadowColor: "shadow-teal-200",
      mapDotColor: "37, 99, 235", // teal-600
      mapLineColor: "#2DD4BF", // teal-600
      bgGradient: "from-teal-50 to-teal-100"
    },
    student: {
      gradientText: "from-emerald-600 to-teal-600",
      gradientBg: "from-emerald-500 to-teal-600",
      hoverGradientBg: "hover:from-emerald-600 hover:to-teal-700",
      shadowColor: "shadow-emerald-200",
      mapDotColor: "5, 150, 105", // emerald-600
      mapLineColor: "#059669", // emerald-600
      bgGradient: "from-emerald-50 to-teal-100"
    },
    admin: {
      gradientText: "from-purple-600 to-fuchsia-600",
      gradientBg: "from-purple-500 to-fuchsia-600",
      hoverGradientBg: "hover:from-purple-600 hover:to-fuchsia-700",
      shadowColor: "shadow-purple-200",
      mapDotColor: "147, 51, 234", // purple-600
      mapLineColor: "#9333ea", // purple-600
      bgGradient: "from-purple-50 to-fuchsia-100"
    }
  };

  const theme = themes[roleKey as keyof typeof themes] || themes.faculty;
  
  return (
    <div className="flex w-full h-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl overflow-hidden rounded-2xl flex bg-white shadow-xl"
      >
        {/* Left side - Map */}
        <div className="hidden md:block w-1/2 h-[600px] relative overflow-hidden border-r border-gray-100">
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient}`}>
            <DotMap dotColor={theme.mapDotColor} lineColor={theme.mapLineColor} />
            
            {/* Logo and text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.2 }}
                className="mb-6"
              >
                <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center shadow-lg ${theme.shadowColor}`}>
                  <Image src="/images/logo.png" alt="Logo" width={24} height={24} className="brightness-0 invert w-6 h-6 object-contain" />
                </div>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.2 }}
                className={`text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
              >
                IntelliAttend
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.2 }}
                className="text-sm text-center text-gray-600 max-w-xs"
              >
                Sign in to access your {roleDisplay} dashboard and manage your smart campus experience.
              </motion.p>
            </div>
          </div>
        </div>
        
        {/* Right side - Sign In Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white relative">
          
          <Link href="/login" className="absolute top-6 left-6 md:left-10 flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors">
            <ArrowLeft size={16} />
            Back to portals
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-1 text-gray-800">{roleDisplay} Demo Portal</h1>
            <p className="text-gray-500 mb-4">Explore the {roleDisplay} interactive sandbox</p>

            <div className="mb-6 p-3 bg-amber-50 border border-amber-200/90 rounded-xl text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span>Demo sandbox with synthetic data. Real campus operations require authenticated credentials.</span>
              <a 
                href="https://dashboard.intelliattend.app/login"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-amber-950 underline shrink-0"
              >
                Production SSO &rarr;
              </a>
            </div>
            
            <div className="mb-6">
              <button 
                className="w-full flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-all duration-150 text-gray-700 shadow-sm"
                onClick={() => console.log("Google sign-in")}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fillOpacity=".54"
                  />
                  <path
                    fill="#4285F4"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#34A853"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                  <path fill="#EA4335" d="M1 1h22v22H1z" fillOpacity="0" />
                </svg>
                <span>Login with Google</span>
              </button>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            
            <form className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-teal-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-800 w-full focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-teal-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-800 w-full pr-10 focus:border-teal-500 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="pt-2"
              >
                <Button
                  type="button"
                  className={cn(
                    "w-full bg-gradient-to-r relative overflow-hidden text-white py-2 rounded-lg transition-all duration-150",
                    theme.gradientBg,
                    theme.hoverGradientBg,
                    isHovered ? `shadow-lg ${theme.shadowColor}` : ""
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/portal/${role.toLowerCase()}`;
                  }}
                >
                  <span className="flex items-center justify-center">
                    Enter Demo Sandbox
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                  {isHovered && (
                    <motion.span
                      initial={{ left: "-100%" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{ filter: "blur(8px)" }}
                    />
                  )}
                </Button>
              </motion.div>
              
              <div className="text-center mt-6">
                <a href="#" className="text-teal-600 hover:text-teal-700 text-sm transition-colors">
                  Forgot password?
                </a>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default function RoleLoginPage({ params }: { params: Promise<{ role: string }> }) {
  const resolvedParams = use(params);
  const role = resolvedParams.role;
  
  useEffect(() => {
    if (role.toLowerCase() === 'faculty') {
      window.location.href = 'https://dashboard.intelliattend.app/login';
    }
  }, [role]);
  
  if (role.toLowerCase() === 'faculty') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-4 font-sans text-teal-800">
        Redirecting to Faculty Dashboard...
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-4 font-sans">
      <SignInCard role={role} />
    </div>
  );
}
