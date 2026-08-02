"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  MessageSquare,
  FileText,
  Smartphone,
  Server,
  MonitorPlay,
  Lock,
  Key,
  Database,
  Search,
  ChevronDown,
  PlayCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-accent/10 blur-[100px]" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-2xl"
            >
              <motion.div variants={fadeIn} className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-primary bg-primary/10 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                IntelliAttend 2.0 is here
              </motion.div>
              <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                The Intelligent Campus Platform Built for <span className="text-gradient">Modern Education</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Manage attendance, schedules, communication, classroom resources, analytics, and academic operations from one intelligent platform.
              </motion.p>
              <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
                <Button size="lg" className="h-14 px-8 text-base rounded-full shadow-glow">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full">
                  <PlayCircle className="mr-2 h-5 w-5" /> Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block h-[600px] w-full"
            >
              {/* Abstract Dashboard Mockup */}
              <div className="absolute inset-0 glass rounded-[2rem] shadow-2xl overflow-hidden border-white/40 dark:border-slate-700/50 flex flex-col p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Today's Overview</h3>
                    <p className="text-sm text-slate-500">Computer Science Dept</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                    <p className="text-sm text-slate-500 mb-1">Total Attendance</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">94.2%</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                    <p className="text-sm text-slate-500 mb-1">Active Classes</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
                  </div>
                </div>

                <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 relative">
                  <div className="absolute bottom-4 left-4 right-4 h-32 flex items-end justify-between gap-2">
                    {[40, 70, 45, 90, 65, 85, 60].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                        className="w-full bg-primary/40 rounded-t-sm"
                        style={{ backgroundColor: i === 3 ? 'var(--color-primary)' : '' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Element 1 */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-12 top-20 glass p-4 rounded-2xl shadow-xl flex items-center gap-4"
              >
                <div className="bg-accent/20 p-3 rounded-full text-green-600 dark:text-accent">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Attendance Synced</p>
                  <p className="text-xs text-slate-500">Just now</p>
                </div>
              </motion.div>

              {/* Floating Element 2 */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-8 bottom-32 glass p-4 rounded-2xl shadow-xl flex items-center gap-4"
              >
                <div className="bg-secondary/20 p-3 rounded-full text-secondary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold">GPS Verified</p>
                  <p className="text-xs text-slate-500">Room 402</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center divide-x divide-slate-100 dark:divide-slate-800">
            {[
              { label: "Institutions", value: "120+" },
              { label: "Students", value: "50,000+" },
              { label: "Faculty", value: "6,500+" },
              { label: "Attendance Records", value: "2M+" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="px-4"
              >
                <h4 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</h4>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-slate-50 dark:bg-slate-950 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-primary font-semibold tracking-wide uppercase mb-3">Core Features</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Everything you need to run a smart campus</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Powerful tools designed specifically for modern educators and administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="card-premium p-8 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold mb-4">Smart Attendance</h4>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> QR & Manual Attendance</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Face Authentication Ready</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> GPS Verification</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Live Attendance Tracking</li>
              </ul>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="card-premium p-8 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold mb-4">Student Management</h4>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-secondary" /> Comprehensive Student Profiles</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-secondary" /> Attendance History</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-secondary" /> Performance Analytics</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-secondary" /> Section & Group Management</li>
              </ul>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="card-premium p-8 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center text-green-600 dark:text-accent mb-6">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold mb-4">Smart Messaging</h4>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-accent" /> Faculty ↔ Student Comms</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-accent" /> Parent Notifications</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-accent" /> Mass Announcements</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-accent" /> Attachment Support</li>
              </ul>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="card-premium p-8 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold mb-4">Advanced Analytics & Reports</h4>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Visual Charts & Trends</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Department Level Analytics</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> 1-Click PDF Export</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Excel & CSV Support</li>
              </ul>
            </motion.div>

            {/* Feature 5 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="card-premium p-8 hover:-translate-y-2 transition-transform duration-300 md:col-span-2 lg:col-span-2"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="h-12 w-12 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 mb-6">
                    <MonitorPlay className="h-6 w-6" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">SmartBoard Integration</h4>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    Push resources directly to classroom SmartBoards from your phone or tablet. Never worry about USB drives or logging in again.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium">Lecture Notes</span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium">Assignments</span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium">Lab Manuals</span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium">PPT / PDF</span>
                  </div>
                </div>
                <div className="w-full md:w-1/2 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-6 flex items-center justify-center min-h-[200px]">
                  {/* Abstract Smartboard Illustration */}
                  <div className="relative w-full aspect-video bg-slate-900 rounded-lg shadow-2xl overflow-hidden p-2">
                    <div className="w-full h-full border-2 border-slate-700 rounded flex flex-col">
                      <div className="h-4 border-b-2 border-slate-700 w-full flex gap-1 p-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                         <FileText className="text-primary h-8 w-8 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ecosystem Overview */}
      <section className="py-32 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-primary font-semibold tracking-wide uppercase mb-3">Platform Overview</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">A Complete Ecosystem</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Seamlessly connected applications ensuring data flows effortlessly between faculty, students, and administration.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex flex-col items-center gap-4 z-10">
                <div className="h-24 w-24 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <Smartphone className="h-10 w-10 text-primary" />
                </div>
                <h4 className="font-semibold text-center">Faculty App</h4>
              </div>

              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-primary hidden md:block" 
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                className="h-2 w-2 rounded-full bg-primary hidden md:block" 
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                className="h-2 w-2 rounded-full bg-primary hidden md:block" 
              />

              <div className="flex flex-col items-center gap-4 z-10 relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150"></div>
                <div className="h-32 w-32 rounded-full bg-slate-900 dark:bg-white shadow-2xl shadow-primary/20 flex items-center justify-center relative z-10">
                  <Server className="h-12 w-12 text-white dark:text-slate-900" />
                </div>
                <h4 className="font-bold text-lg text-center mt-2">Cloud API & Analytics Engine</h4>
              </div>

              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                className="h-2 w-2 rounded-full bg-primary hidden md:block" 
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                className="h-2 w-2 rounded-full bg-primary hidden md:block" 
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="h-2 w-2 rounded-full bg-primary hidden md:block" 
              />

              <div className="flex flex-col gap-8 z-10">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-20 w-20 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <MonitorPlay className="h-8 w-8 text-secondary" />
                  </div>
                  <h4 className="font-semibold text-center text-sm">Admin Dashboard</h4>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="h-20 w-20 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <Smartphone className="h-8 w-8 text-accent" />
                  </div>
                  <h4 className="font-semibold text-center text-sm">Student App</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-slate-900 to-slate-900"></div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Enterprise-Grade Security</h2>
            <p className="text-lg text-slate-400">
              Your academic data is protected by industry-leading security protocols.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Key, title: "JWT Authentication", desc: "Stateless, secure token-based authentication for all API requests." },
              { icon: Lock, title: "End-to-End Encryption", desc: "Data is encrypted in transit and at rest using AES-256." },
              { icon: Users, title: "Role-Based Access", desc: "Granular permissions for Admins, Faculty, and Students." },
              { icon: Search, title: "Biometric Login", desc: "Support for FaceID and TouchID on compatible mobile devices." },
              { icon: Smartphone, title: "Device Management", desc: "Track and revoke active sessions across all devices." },
              { icon: Database, title: "Secure Cloud Storage", desc: "Isolated databases with automated daily backups." },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6"
              >
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "How does the Smart Attendance work?", a: "Faculty can generate a dynamic QR code on the SmartBoard or their device, which students scan using the Student App. It verifies their GPS location to ensure they are physically present in the classroom." },
              { q: "Does the platform support offline mode?", a: "Yes, the Faculty App supports offline attendance taking. The data securely syncs to the cloud automatically once the device reconnects to the internet." },
              { q: "How can I export reports?", a: "Reports can be exported in one click from both the mobile app and the admin dashboard in PDF, Excel, or CSV formats." },
              { q: "Are students notified of low attendance?", a: "Yes, the system can be configured to automatically send push notifications and emails to students and parents when attendance drops below a specified threshold." }
            ].map((faq, i) => (
              <details key={i} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-slate-900 dark:text-white">
                  <span>{faq.q}</span>
                  <span className="transition group-open:rotate-180">
                    <ChevronDown className="h-5 w-5 text-slate-500" />
                  </span>
                </summary>
                <div className="text-slate-600 dark:text-slate-400 p-6 pt-0 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to transform your campus?</h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of institutions already using IntelliAttend to streamline their academic operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-14 px-8 text-base rounded-full bg-white text-primary hover:bg-slate-50">
              Get Started Now
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-white text-white hover:bg-white/10">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
