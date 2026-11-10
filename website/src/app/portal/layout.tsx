"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  GraduationCap, Users, Shield, LogOut, LayoutDashboard, 
  BookOpen, CalendarDays, BarChart3, Settings, Bell, 
  Menu, X, CheckSquare, BrainCircuit, MonitorPlay, Lock, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy profile data based on role
const getProfile = (pathname: string) => {
  if (pathname.includes('/faculty')) return { name: "Dr. Sarah Jenkins", role: "Professor of Computer Science", avatar: "SJ" };
  if (pathname.includes('/student')) return { name: "Alex Chen", role: "Undergraduate Student", avatar: "AC" };
  return { name: "Admin User", role: "System Administrator", avatar: "AU" };
};

// Navigation configs
const navConfig = {
  faculty: [
    { name: "Dashboard", href: "/portal/faculty", icon: <LayoutDashboard /> },
    { name: "My Classes", href: "#", icon: <BookOpen /> },
    { name: "Attendance", href: "#", icon: <CheckSquare /> },
    { name: "SmartBoard", href: "#", icon: <MonitorPlay /> },
    { name: "Settings", href: "#", icon: <Settings /> }
  ],
  student: [
    { name: "Dashboard", href: "/portal/student", icon: <LayoutDashboard /> },
    { name: "Timetable", href: "#", icon: <CalendarDays /> },
    { name: "My Attendance", href: "#", icon: <CheckSquare /> },
    { name: "Resources", href: "#", icon: <BookOpen /> },
    { name: "Settings", href: "#", icon: <Settings /> }
  ],
  admin: [
    { name: "Dashboard", href: "/portal/admin", icon: <LayoutDashboard /> },
    { name: "Users", href: "#", icon: <Users /> },
    { name: "Analytics", href: "#", icon: <BarChart3 /> },
    { name: "System Config", href: "#", icon: <Settings /> }
  ]
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const role = pathname.includes('/faculty') ? 'faculty' : pathname.includes('/student') ? 'student' : 'admin';
  const navItems = navConfig[role];
  const profile = getProfile(pathname);

  const roleColor = role === 'faculty' ? 'text-slate-500' : role === 'student' ? 'text-emerald-600' : 'text-violet-600';
  const roleBg = role === 'faculty' ? 'bg-teal-600' : role === 'student' ? 'bg-emerald-600' : 'bg-violet-600';

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className="w-72 bg-slate-900 text-slate-300 hidden md:flex flex-col border-r border-slate-800">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${roleBg}`}>
              {role === 'faculty' && <GraduationCap className="w-5 h-5" />}
              {role === 'student' && <Users className="w-5 h-5" />}
              {role === 'admin' && <Shield className="w-5 h-5" />}
            </div>
            <span className="font-bold text-xl text-white tracking-tight">IntelliAttend</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Navigation</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm",
                  isActive ? "bg-slate-800 text-white shadow-sm" : "hover:bg-slate-800/50 hover:text-white"
                )}
              >
                <div className={cn("w-5 h-5", isActive ? roleColor : "")}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs text-slate-300 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-400 text-[11px] uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" /> Security Notice
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Interactive demo preview using generated synthetic data. Zero real campus records are exposed.
            </p>
          </div>
          <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm hover:bg-slate-800 text-slate-400 hover:text-white">
            <LogOut className="w-5 h-5" />
            Exit Demo
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Security & Data Provenance Disclaimer Banner */}
        <div className="bg-amber-50 border-b border-amber-200/90 px-4 py-2 text-xs text-amber-900 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 z-20">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1 bg-amber-200/80 text-amber-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
              <Lock className="w-3 h-3" /> Demo Sandbox
            </span>
            <span>
              Unauthenticated interactive preview with synthetic data. Real campus operations require authenticated backend credentials.
            </span>
          </div>
          <a 
            href="https://dashboard.intelliattend.app/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-amber-900 hover:text-amber-950 underline underline-offset-2 shrink-0 transition-colors"
          >
            Production SSO Portal <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 capitalize hidden sm:block">{role} Portal</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Simulated Sandbox
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className={`absolute top-0 right-0 w-2 h-2 rounded-full border-2 border-white ${roleBg}`}></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="hidden md:block text-right">
                <div className="text-sm font-bold text-slate-900 group-hover:text-slate-500 transition-colors">{profile.name}</div>
                <div className="text-xs text-slate-500">{profile.role}</div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${roleBg}`}>
                {profile.avatar}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/80 backdrop-blur-sm flex">
          <div className="w-72 bg-slate-900 text-slate-300 flex flex-col h-full shadow-2xl">
            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
              <span className="font-bold text-xl text-white tracking-tight">IntelliAttend</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium hover:bg-slate-800 hover:text-white"
                >
                  <div className="w-5 h-5 text-slate-400">{item.icon}</div>
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="p-4 border-t border-slate-800">
              <Link href="/login" className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium hover:bg-slate-800 text-slate-400 hover:text-white">
                <LogOut className="w-5 h-5" />
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
