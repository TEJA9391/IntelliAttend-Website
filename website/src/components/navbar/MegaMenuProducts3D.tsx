"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MonitorPlay, Users, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { Float, PresentationControls, useTexture, ContactShadows, Environment, RoundedBox, Html } from "@react-three/drei";

// -------------------------------------------------------------
// 3D Models mapped with our new Professional Flat UIs
// -------------------------------------------------------------

function SmartBoardModel() {
  return (
    <Float rotationIntensity={0.2} floatIntensity={0.5} speed={2}>
      <PresentationControls
        global={false}
        cursor={true}
        rotation={[0, 0.1, 0]}
        polar={[-0.1, 0.1]}
        azimuth={[-0.2, 0.2]}
        snap={true}
      >
        <group position={[0, 0, 0]} scale={1.35}>
          
          {/* Outer White Casing (Thicker bottom chin) */}
          <RoundedBox args={[4.3, 2.6, 0.15]} radius={0.12} smoothness={8} position={[0, -0.05, 0]}>
            <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.3} />
          </RoundedBox>

          {/* Camera Hole (Top Center) */}
          <mesh position={[0, 1.15, 0.076]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02]} />
            <meshBasicMaterial color="#000000" />
          </mesh>

          {/* Sensors (Bottom Right) */}
          <mesh position={[1.8, -1.2, 0.076]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.02]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[1.9, -1.2, 0.076]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.02]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[2.0, -1.2, 0.076]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.02]} />
            <meshBasicMaterial color="#000000" />
          </mesh>

          {/* Logo Placeholder (Bottom Left) */}
          <RoundedBox args={[0.4, 0.06, 0.02]} radius={0.02} smoothness={2} position={[-1.7, -1.2, 0.076]}>
            <meshBasicMaterial color="#94a3b8" />
          </RoundedBox>

          {/* Inner Black Bezel (Shifted up slightly) */}
          <RoundedBox args={[4.06, 2.26, 0.16]} radius={0.04} smoothness={4} position={[0, 0.05, 0]}>
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </RoundedBox>

          {/* Screen Content */}
          <Html 
            transform 
            position={[0, 0.05, 0.082]} 
            scale={0.005}
            className="pointer-events-none"
            style={{ 
              width: '800px', 
              height: '440px',
              backgroundColor: '#f8fafc',
              overflow: 'hidden'
            }}
          >
            <div className="w-full h-full flex flex-col p-5 gap-4 font-sans text-slate-800 box-border">
              {/* Header */}
              <div className="flex gap-4">
                <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-center">
                  <div className="text-xs font-bold text-blue-600 tracking-wider mb-1 uppercase">Today's Lecture</div>
                  <div className="text-2xl font-extrabold text-slate-900 tracking-tight">CS101 - Intro to AI & ML</div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 text-lg">ER</div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Faculty</div>
                      <div className="text-sm font-bold text-slate-800">Dr. Evelyn Reed</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 min-w-[180px] flex flex-col justify-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Count</div>
                    <div className="text-2xl font-bold text-slate-800"><span className="text-green-500">48</span><span className="text-slate-400 text-lg"> / 52 Present</span></div>
                  </div>
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="flex flex-1 gap-4 h-0">
                {/* Left: Presentation Area */}
                <div className="flex-[2] bg-white rounded-2xl shadow-sm border border-slate-100 flex overflow-hidden">
                  {/* Slides Sidebar */}
                  <div className="w-24 bg-slate-50/50 border-r border-slate-100 p-3 flex flex-col gap-3 overflow-y-auto">
                    {[1, 2, 3, 4].map(num => (
                      <div key={num} className={`h-16 rounded-xl border-2 ${num === 2 ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white'} flex flex-col items-center justify-center`}>
                        <div className="text-[10px] font-bold text-slate-400">Slide</div>
                        <div className={`text-lg font-black ${num === 2 ? 'text-blue-600' : 'text-slate-300'}`}>{num}</div>
                      </div>
                    ))}
                  </div>
                  {/* Main Slide */}
                  <div className="flex-1 p-8 flex flex-col">
                    <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Live Presentation</div>
                    <div className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Neural Network Architecture</div>
                    <div className="flex-1 flex gap-6">
                      <div className="flex-1 text-sm text-slate-600 space-y-4 font-medium leading-relaxed">
                        <p className="flex items-start gap-2"><span className="text-blue-500 font-bold">•</span> Deep learning models consist of multiple layers of interconnected nodes.</p>
                        <p className="flex items-start gap-2"><span className="text-blue-500 font-bold">•</span> Each layer extracts higher-level features from the raw input data.</p>
                        <p className="flex items-start gap-2"><span className="text-blue-500 font-bold">•</span> Forward propagation computes the output, while backpropagation minimizes the error.</p>
                      </div>
                      <div className="flex-[1.2] bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
                        {/* Fake Neural Net Diagram */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]"></div>
                        <div className="flex gap-8 items-center relative z-10">
                          <div className="flex flex-col gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-400 shadow-sm"></div>
                            <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-400 shadow-sm"></div>
                            <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-400 shadow-sm"></div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-indigo-400 shadow-sm"></div>
                            <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-indigo-400 shadow-sm"></div>
                            <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-indigo-400 shadow-sm"></div>
                            <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-indigo-400 shadow-sm"></div>
                          </div>
                          <div className="flex flex-col gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-green-400 shadow-sm"></div>
                            <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-green-400 shadow-sm"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Tools & Attendance */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-4 flex-[1.5]">
                    {/* QR Code */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Live Attendance</div>
                      <div className="w-24 h-24 bg-white rounded-xl shadow-inner border border-slate-100 p-2 grid grid-cols-4 grid-rows-4 gap-0.5">
                        {Array.from({length: 16}).map((_, i) => (
                          <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-slate-800' : 'bg-transparent'}`}></div>
                        ))}
                      </div>
                      <div className="text-xs font-bold text-blue-600 mt-4 bg-blue-50 px-3 py-1.5 rounded-full">Scan to Check-in</div>
                    </div>
                    
                    {/* Students List */}
                    <div className="flex-[1.2] bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                      <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <div className="text-xs font-bold text-slate-800">Present</div>
                        <div className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Just Now</div>
                      </div>
                      <div className="flex-1 p-2 flex flex-col overflow-hidden">
                        {['Alex J.', 'Sam L.', 'Marcus W.', 'Emily C.', 'David K.'].map((name, i) => (
                          <div key={name} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-xl cursor-default">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">{name[0]}</div>
                            <div className="text-[11px] font-bold text-slate-700 flex-1">{name}</div>
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Assistant */}
                  <div className="flex-1 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl shadow-md p-4 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="text-[10px] font-bold text-blue-100 mb-2 flex items-center gap-1.5 uppercase tracking-widest relative z-10">
                      <span className="text-sm">✨</span> AI Assistant
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex-1 flex items-center text-xs text-white font-medium shadow-inner relative z-10 border border-white/10 leading-relaxed">
                      "Class engagement is at 94%. Would you like me to generate a quick quiz on Backpropagation based on the current slide?"
                    </div>
                    <div className="flex gap-2 mt-3 relative z-10">
                      <button className="px-4 py-1.5 bg-white rounded-full text-[10px] font-bold text-blue-700 shadow-sm transition-transform hover:scale-105">Generate Quiz</button>
                      <button className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-bold text-white hover:bg-white/20 transition-colors">Dismiss</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Html>
        </group>
      </PresentationControls>
    </Float>
  );
}

function FacultyLaptopModel() {
  const texture = useTexture("/images/products/faculty_ui_v2.png");
  // Fix stretching on 3.1x2.1 screen (Aspect 1.47)
  texture.repeat.set(1, 2.1 / 3.1);
  texture.offset.set(0, (1 - (2.1 / 3.1)) / 2);
  
  return (
    <Float rotationIntensity={0.3} floatIntensity={0.8} speed={1.5}>
      <PresentationControls
        global={false}
        cursor={true}
        rotation={[0.1, -0.3, 0]}
        polar={[-0.2, 0.2]}
        azimuth={[-0.3, 0.3]}
        snap={true}
      >
        <group position={[0, -0.5, 0]}>
          {/* Keyboard Base */}
          <RoundedBox args={[3.2, 0.1, 2.2]} radius={0.05} smoothness={4} position={[0, 0, 1.2]} rotation={[-0.1, 0, 0]}>
            <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.4} />
          </RoundedBox>

          {/* Screen Body */}
          <RoundedBox args={[3.2, 2.2, 0.05]} radius={0.05} smoothness={4} position={[0, 1.1, 0.1]} rotation={[-0.1, 0, 0]}>
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </RoundedBox>
          
          {/* Screen Content */}
          <mesh position={[0, 1.1, 0.13]} rotation={[-0.1, 0, 0]}>
            <planeGeometry args={[3.1, 2.1]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
          </mesh>
        </group>
      </PresentationControls>
    </Float>
  );
}

function StudentPhoneModel() {
  return (
    <Float rotationIntensity={0.4} floatIntensity={1} speed={2}>
      <PresentationControls
        global={false}
        cursor={true}
        rotation={[0, -0.2, 0]}
        polar={[-0.2, 0.2]}
        azimuth={[-0.4, 0.4]}
        snap={true}
      >
        <group position={[0, 0, 0.5]} scale={0.82}>
          {/* Metal Frame (White Titanium / Silver) */}
          <RoundedBox args={[1.52, 3.20, 0.15]} radius={0.22} smoothness={8} position={[0, 0, 0]}>
            <meshStandardMaterial color="#fdfdfd" metalness={0.75} roughness={0.15} />
          </RoundedBox>
          
          {/* White Glass Bezel */}
          <RoundedBox args={[1.48, 3.16, 0.16]} radius={0.20} smoothness={8} position={[0, 0, 0]}>
            <meshStandardMaterial color="#f8fafc" metalness={0.6} roughness={0.1} />
          </RoundedBox>

          {/* Dynamic Island / Notch */}
          <RoundedBox args={[0.35, 0.10, 0.17]} radius={0.05} smoothness={8} position={[0, 1.48, 0]}>
            <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
          </RoundedBox>
          
          {/* Screen Content */}
          <RoundedBox args={[1.44, 3.12, 0.01]} radius={0.18} smoothness={8} position={[0, 0, 0.08]}>
            <meshBasicMaterial color="#ffffff" />
            <Html 
              transform 
              position={[0, 0, 0.01]} 
              scale={0.004}
              className="pointer-events-none"
              style={{ 
                width: '360px', 
                height: '780px',
                borderRadius: '45px',
                overflow: 'hidden',
                backgroundColor: '#ffffff'
              }}
            >
              <div className="w-full h-full bg-slate-50 flex flex-col font-sans select-none relative overflow-y-auto">
                {/* Fake iOS Status Bar */}
                <div className="flex justify-between items-center px-6 pt-4 pb-2 bg-slate-50 sticky top-0 z-10">
                  <span className="text-sm font-semibold text-slate-800 tracking-tight">9:41</span>
                  <div className="flex gap-1.5 items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                    <div className="w-4 h-3 rounded-sm bg-slate-800"></div>
                    <div className="w-5 h-3 rounded-sm bg-slate-800"></div>
                  </div>
                </div>
                
                {/* Header */}
                <div className="flex justify-between items-center px-6 mb-4 mt-2">
                  <div>
                    <div className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      Hello, Tej Kumar ✨
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">Good morning! Ready to learn today?</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm ring-2 ring-white">TK</div>
                </div>

                {/* Attendance Card */}
                <div className="px-6 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-5 text-white shadow-[0_10px_30px_rgba(59,130,246,0.3)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                        <div className="text-sm text-blue-100 font-medium">Attendance</div>
                        <div className="text-xs text-blue-200">This Month</div>
                      </div>
                      <div className="flex flex-col gap-1.5 text-xs font-medium">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400"></div> Present <span className="ml-auto font-bold">23</span></div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400"></div> Absent <span className="ml-auto font-bold">2</span></div>
                      </div>
                    </div>
                    
                    <div className="flex items-end gap-3 relative z-10">
                      <div className="text-6xl font-extrabold tracking-tighter">92%</div>
                      <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-md text-xs font-semibold text-yellow-300 flex items-center gap-1 mb-2 shadow-sm">
                        ⭐ Excellent
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 grid grid-cols-4 gap-3 mb-6">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 text-xl border border-slate-100">📅</div>
                    <div className="text-[10px] font-semibold text-slate-600">Schedule</div>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 text-xl border border-slate-100">📝</div>
                    <div className="text-[10px] font-semibold text-slate-600">Tasks</div>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 text-xl border border-slate-100">📊</div>
                    <div className="text-[10px] font-semibold text-slate-600">Grades</div>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 text-xl border border-slate-100">💬</div>
                    <div className="text-[10px] font-semibold text-slate-600">Chat</div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="px-6 flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm font-bold text-slate-900 tracking-wide">Today's Schedule</div>
                    <div className="text-xs font-semibold text-blue-600 cursor-pointer">View All</div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-4 relative">
                    {/* Timeline Line */}
                    <div className="absolute left-6 top-6 bottom-6 w-px bg-slate-200"></div>
                    
                    <div className="flex gap-4 items-start relative z-10">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 shadow-[0_0_0_4px_white]"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="text-sm font-bold text-slate-900">Data Structures</div>
                          <div className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">In Progress</div>
                        </div>
                        <div className="text-[10px] font-medium text-slate-500 mt-0.5">08:30 AM • Room 301</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start relative z-10">
                      <div className="w-3 h-3 rounded-full bg-slate-300 mt-1.5 shadow-[0_0_0_4px_white]"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="text-sm font-bold text-slate-900">Algorithms</div>
                          <div className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Upcoming</div>
                        </div>
                        <div className="text-[10px] font-medium text-slate-500 mt-0.5">10:30 AM • Room 302</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start relative z-10">
                      <div className="w-3 h-3 rounded-full bg-slate-300 mt-1.5 shadow-[0_0_0_4px_white]"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="text-sm font-bold text-slate-900">Database Systems</div>
                          <div className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Upcoming</div>
                        </div>
                        <div className="text-[10px] font-medium text-slate-500 mt-0.5">01:30 PM • Lab 4</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Html>
          </RoundedBox>
        </group>
      </PresentationControls>
    </Float>
  );
}

function Scene({ activeId }: { activeId: string }) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <Environment preset="city" />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#2563eb" />
      
      {activeId === "smartboard" && <SmartBoardModel />}
      {activeId === "faculty" && <FacultyLaptopModel />}
      {activeId === "student" && <StudentPhoneModel />}
      
      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
    </>
  );
}

// -------------------------------------------------------------
// Mega Menu Component
// -------------------------------------------------------------

const menuItems = [
  {
    id: "smartboard",
    icon: MonitorPlay,
    title: "SmartBoard",
    description: "Interactive classroom displays",
    href: "/products/smartboard"
  },
  {
    id: "faculty",
    icon: Users,
    title: "Faculty",
    description: "Manage classes and attendance",
    href: "/products/faculty"
  },
  {
    id: "student",
    icon: GraduationCap,
    title: "Student",
    description: "Track progress and schedules",
    href: "/products/student"
  }
];

export function MegaMenuProducts3D() {
  const [activeId, setActiveId] = useState("smartboard");

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute top-full left-0 right-0 w-full z-50 overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] border-t border-slate-100"
    >
      {/* Reduced padding from py-6 to py-4, and no hardcoded height */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4 flex gap-10">
        
        {/* Left Column (Title & Button) */}
        <div className="flex-[0.8] border-r border-slate-100 pr-8 flex flex-col justify-between max-w-[280px]">
          <div>
            <motion.h3 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.1 }}
              className="text-[22px] tracking-tight font-bold text-[#0F172A] leading-[1.2] mt-2"
            >
              Intelligent solutions for modern campuses
            </motion.h3>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="mb-2"
          >
            <Link href="/products" className="inline-flex items-center justify-center px-4 py-2 bg-slate-50 hover:bg-slate-100 text-sm font-semibold text-slate-700 rounded-full transition-colors">
              See overview
            </Link>
          </motion.div>
        </div>

        {/* Middle Column (Links) */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-[11px] font-bold text-slate-400 mb-2 px-3 uppercase tracking-wider">Products</div>
          <div className="flex flex-col gap-0.5">
            {menuItems.map((item, index) => (
              <div 
                key={item.id} 
                onMouseEnter={() => setActiveId(item.id)}
                className={`px-3 py-2.5 rounded-xl transition-colors cursor-pointer block group/item ${activeId === item.id ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
              >
                <Link href={item.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <div className={`text-[15px] font-semibold transition-colors ${activeId === item.id ? 'text-primary' : 'text-slate-900 group-hover/item:text-primary'}`}>
                      {item.title}
                    </div>
                    <div className="text-[13px] text-slate-500">{item.description}</div>
                  </motion.div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (3D Scene) - Reduced minimum height to 200px */}
        <div className="flex-[1.5] relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/50 min-h-[200px]">
          {/* Cinematic Backdrop Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0%,transparent_70%)] pointer-events-none" />

          {/* 3D Canvas */}
          <div className="absolute inset-0 w-full h-full pointer-events-auto">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
              <Scene activeId={activeId} />
            </Canvas>
          </div>

          {/* Soft vignette overlay */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.03)]" />
        </div>
      </div>
    </motion.div>
  );
}
