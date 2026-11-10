"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MonitorPlay, Users, GraduationCap, ArrowRight, BrainCircuit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { Float, PresentationControls, useTexture, ContactShadows, Environment, RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";

// -------------------------------------------------------------
// 3D Models mapped with our new Professional Flat UIs
// -------------------------------------------------------------

function SmartBoardModel() {
  const texture = useTexture("/images/products/smartboard_screen_display.png");
  const tex = texture.clone();
  
  if (tex && tex.image) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    
    const img = tex.image as HTMLImageElement;
    const imgAspect = img.width / img.height;
    const planeAspect = 4.0 / 2.18;
    
    if (imgAspect > planeAspect) {
      tex.repeat.set(planeAspect / imgAspect, 1);
      tex.offset.set((1 - (planeAspect / imgAspect)) / 2, 0);
    } else {
      tex.repeat.set(1, imgAspect / planeAspect);
      tex.offset.set(0, (1 - (imgAspect / planeAspect)) / 2);
    }
  }
  
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
          <RoundedBox args={[4.3, 2.65, 0.15]} radius={0.12} smoothness={8} position={[0, -0.05, 0]}>
            <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.3} />
          </RoundedBox>

          {/* Camera Hole (Top Center) */}
          <mesh position={[0, 1.175, 0.076]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02]} />
            <meshBasicMaterial color="#000000" />
          </mesh>

          {/* Sensors (Bottom Right) */}
          <mesh position={[1.8, -1.225, 0.076]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.02]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[1.9, -1.225, 0.076]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.02]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[2.0, -1.225, 0.076]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.02]} />
            <meshBasicMaterial color="#000000" />
          </mesh>

          {/* Logo Placeholder (Bottom Left) */}
          <RoundedBox args={[0.4, 0.06, 0.02]} radius={0.02} smoothness={2} position={[-1.7, -1.225, 0.076]}>
            <meshBasicMaterial color="#94a3b8" />
          </RoundedBox>

          {/* Inner Black Bezel (Shifted up slightly) */}
          <RoundedBox args={[4.06, 2.24, 0.16]} radius={0.04} smoothness={4} position={[0, 0.05, 0]}>
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </RoundedBox>

          {/* Screen Content as Texture */}
          <mesh position={[0, 0.05, 0.082]}>
            <planeGeometry args={[4.0, 2.18]} />
            <meshBasicMaterial map={tex} toneMapped={false} />
          </mesh>
        </group>
      </PresentationControls>
    </Float>
  );
}

function FacultyLaptopModel() {
  const texture = useTexture("/images/products/faculty_dashboard_screen.png");
  const tex = texture.clone();
  
  if (tex && tex.image) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    
    const img = tex.image as HTMLImageElement;
    const imgAspect = img.width / img.height;
    const planeAspect = 3.26 / 1.66;
    
    if (imgAspect > planeAspect) {
      tex.repeat.set(planeAspect / imgAspect, 1);
      tex.offset.set((1 - (planeAspect / imgAspect)) / 2, 0);
    } else {
      tex.repeat.set(1, imgAspect / planeAspect);
      tex.offset.set(0, (1 - (imgAspect / planeAspect)) / 2);
    }
  }
  
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
          <RoundedBox args={[3.4, 0.1, 2.2]} radius={0.05} smoothness={4} position={[0, 0, 1.2]} rotation={[-0.1, 0, 0]}>
            <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.4} />
          </RoundedBox>

          {/* Screen Body */}
          <RoundedBox args={[3.4, 1.8, 0.05]} radius={0.05} smoothness={4} position={[0, 0.9, 0.1]} rotation={[-0.1, 0, 0]}>
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </RoundedBox>
          
          {/* Screen Content */}
          <mesh position={[0, 0.9, 0.13]} rotation={[-0.1, 0, 0]}>
            <planeGeometry args={[3.26, 1.66]} />
            <meshBasicMaterial map={tex} toneMapped={false} />
          </mesh>
        </group>
      </PresentationControls>
    </Float>
  );
}

function StudentPhoneModel() {
  const texture = useTexture("/images/products/student_app_iphone18.png");
  const tex = texture.clone();

  if (tex && tex.image) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    
    const img = tex.image as HTMLImageElement;
    const imgAspect = img.width / img.height;
    const planeAspect = 1.48 / 3.16;
    
    if (imgAspect > planeAspect) {
      tex.repeat.set(planeAspect / imgAspect, 1);
      tex.offset.set((1 - (planeAspect / imgAspect)) / 2, 0);
    } else {
      tex.repeat.set(1, imgAspect / planeAspect);
      tex.offset.set(0, (1 - (imgAspect / planeAspect)) / 2);
    }
  }

  return (
    <Float rotationIntensity={0.35} floatIntensity={0.8} speed={1.8}>
      <PresentationControls
        global={false}
        cursor={true}
        rotation={[0.05, -0.25, 0]}
        polar={[-0.25, 0.25]}
        azimuth={[-0.45, 0.45]}
        snap={true}
      >
        <group position={[0, 0, 0.5]} scale={0.84}>
          {/* Main Aerospace Grade Space Black Titanium Frame */}
          <RoundedBox args={[1.56, 3.26, 0.16]} radius={0.24} smoothness={10} position={[0, 0, 0]}>
            <meshStandardMaterial color="#2d3139" metalness={0.92} roughness={0.22} />
          </RoundedBox>

          {/* Frosted Matte Glass Backplate */}
          <RoundedBox args={[1.52, 3.22, 0.015]} radius={0.22} smoothness={8} position={[0, 0, -0.082]}>
            <meshStandardMaterial color="#1f232b" metalness={0.4} roughness={0.35} />
          </RoundedBox>

          {/* Rear Camera Island Plateau (iPhone Pro Rounded Island) */}
          <RoundedBox args={[0.72, 0.74, 0.04]} radius={0.16} smoothness={8} position={[-0.34, 1.14, -0.1]}>
            <meshStandardMaterial color="#252932" metalness={0.85} roughness={0.2} />
          </RoundedBox>

          {/* Camera 1: Top-Left Primary Sapphire Lens */}
          <group position={[-0.48, 1.30, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.025, 32]} />
            <meshStandardMaterial color="#3f4552" metalness={0.95} roughness={0.15} />
            <mesh position={[0, 0.013, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.005, 32]} />
              <meshStandardMaterial color="#0b101b" metalness={0.98} roughness={0.05} />
            </mesh>
          </group>

          {/* Camera 2: Bottom-Left Ultra-Wide Sapphire Lens */}
          <group position={[-0.48, 0.98, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.025, 32]} />
            <meshStandardMaterial color="#3f4552" metalness={0.95} roughness={0.15} />
            <mesh position={[0, 0.013, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.005, 32]} />
              <meshStandardMaterial color="#0b101b" metalness={0.98} roughness={0.05} />
            </mesh>
          </group>

          {/* Camera 3: Right Telephoto Periscope Lens */}
          <group position={[-0.20, 1.14, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.025, 32]} />
            <meshStandardMaterial color="#3f4552" metalness={0.95} roughness={0.15} />
            <mesh position={[0, 0.013, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.005, 32]} />
              <meshStandardMaterial color="#0b101b" metalness={0.98} roughness={0.05} />
            </mesh>
          </group>

          {/* Rear LiDAR Scanner */}
          <mesh position={[-0.20, 0.96, -0.115]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.01, 24]} />
            <meshStandardMaterial color="#06090e" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Rear TrueTone Dual-LED Flash */}
          <mesh position={[-0.20, 1.32, -0.115]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.01, 24]} />
            <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.2} roughness={0.2} />
          </mesh>

          {/* Left Side: Action Button */}
          <RoundedBox args={[0.02, 0.14, 0.04]} radius={0.01} smoothness={4} position={[-0.79, 0.85, 0]}>
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </RoundedBox>

          {/* Left Side: Volume Up & Down Buttons */}
          <RoundedBox args={[0.02, 0.22, 0.04]} radius={0.01} smoothness={4} position={[-0.79, 0.55, 0]}>
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </RoundedBox>
          <RoundedBox args={[0.02, 0.22, 0.04]} radius={0.01} smoothness={4} position={[-0.79, 0.25, 0]}>
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </RoundedBox>

          {/* Right Side: Power Button */}
          <RoundedBox args={[0.02, 0.36, 0.04]} radius={0.01} smoothness={4} position={[0.79, 0.58, 0]}>
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </RoundedBox>

          {/* Right Side: Camera Control Capacitive Sensor */}
          <RoundedBox args={[0.015, 0.28, 0.03]} radius={0.01} smoothness={4} position={[0.785, -0.45, 0]}>
            <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.1} />
          </RoundedBox>

          {/* Ultra-Narrow Black OLED Screen Bezel */}
          <RoundedBox args={[1.50, 3.20, 0.162]} radius={0.22} smoothness={8} position={[0, 0, 0]}>
            <meshStandardMaterial color="#05070a" metalness={0.8} roughness={0.1} />
          </RoundedBox>

          {/* Dynamic Island 2.0 (Front Floating Pill) */}
          <RoundedBox args={[0.34, 0.08, 0.02]} radius={0.04} smoothness={8} position={[0, 1.48, 0.09]}>
            <meshStandardMaterial color="#000000" metalness={0.98} roughness={0.05} />
          </RoundedBox>
          {/* Front TrueDepth Camera Micro-Glint */}
          <mesh position={[-0.07, 1.48, 0.101]}>
            <circleGeometry args={[0.016, 16]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.06, 1.48, 0.101]}>
            <circleGeometry args={[0.012, 16]} />
            <meshBasicMaterial color="#020617" />
          </mesh>

          {/* Screen Content: Authentic IntelliAttend Student App */}
          <mesh position={[0, 0, 0.084]}>
            <planeGeometry args={[1.48, 3.16]} />
            <meshBasicMaterial map={tex} toneMapped={false} />
          </mesh>
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
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#2DD4BF" />
      
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

export function MegaMenuProducts3D({
  isOpen,
  onMouseEnter,
  onClose,
}: {
  isOpen: boolean;
  onMouseEnter?: () => void;
  onClose?: () => void;
}) {
  const [activeId, setActiveId] = useState("smartboard");

  return (
    <motion.div
      initial={false}
      onMouseEnter={onMouseEnter}
      animate={
        isOpen
          ? {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              pointerEvents: "auto",
              visibility: "visible",
            }
          : {
              opacity: 0,
              y: -15,
              filter: "blur(8px)",
              pointerEvents: "none",
              transitionEnd: { visibility: "hidden" },
            }
      }
      transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
      className={`absolute top-full left-0 right-0 w-full z-50 overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
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
            transition={{ delay: 0.1 }}
            className="mb-2"
          >
            <Link href="/products" onClick={onClose} className="inline-flex items-center justify-center px-4 py-2 bg-slate-50 hover:bg-slate-100 text-sm font-semibold text-slate-700 rounded-full transition-colors">
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
                <Link href={item.href} onClick={onClose}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <div className={`text-[15px] font-semibold transition-colors ${activeId === item.id ? 'text-slate-500' : 'text-slate-900 group-hover/item:text-slate-500'}`}>
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(100,116,139,0.08)_0%,transparent_70%)] pointer-events-none" />

          {/* 3D Canvas */}
          <div className={`absolute inset-0 w-full h-full ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <Canvas
              camera={{ position: [0, 0, 6], fov: 45 }}
              frameloop={isOpen ? 'always' : 'never'}
              style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
            >
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

useTexture.preload("/images/products/smartboard_screen_display.png");
useTexture.preload("/images/products/faculty_dashboard_screen.png");
useTexture.preload("/images/products/student_dashboard_v4.png");
useTexture.preload("/images/products/student_app_iphone18.png");
