"use client";

import { UserCircle, CheckCircle, MonitorPlay, GraduationCap, School, Shield, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOPICS = [
  {
    title: "Account & Login",
    icon: <UserCircle className="w-6 h-6 text-slate-500" />,
    desc: "Password reset, account verification, user roles.",
    links: ["Reset your password", "Understanding user roles", "Troubleshoot login"]
  },
  {
    title: "Attendance & Records",
    icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
    desc: "Attendance issues, records corrections, synchronization.",
    links: ["Attendance not recording", "Manual attendance override", "Syncing offline data"]
  },
  {
    title: "SmartBoard",
    icon: <MonitorPlay className="w-6 h-6 text-teal-500" />,
    desc: "Connection issues, display troubleshooting, content sharing.",
    links: ["SmartBoard offline", "Screen mirroring issues", "Updating firmware"]
  },
  {
    title: "Faculty Support",
    icon: <GraduationCap className="w-6 h-6 text-rose-500" />,
    desc: "Schedules, resources, reports, notifications.",
    links: ["Uploading lecture notes", "Sending push notifications", "Viewing attendance reports"]
  },
  {
    title: "Student Support",
    icon: <School className="w-6 h-6 text-amber-500" />,
    desc: "Attendance, assignments, timetable, profile.",
    links: ["Viewing your timetable", "Submitting assignments", "Updating profile details"]
  },
  {
    title: "Administration",
    icon: <Shield className="w-6 h-6 text-violet-500" />,
    desc: "Departments, analytics, approvals, permissions.",
    links: ["Managing permissions", "Generating campus reports", "Approving faculty requests"]
  },
  {
    title: "Billing & Licensing",
    icon: <CreditCard className="w-6 h-6 text-green-500" />,
    desc: "Plans, subscriptions, invoices, enterprise licensing.",
    links: ["View current invoices", "Upgrading your plan", "Enterprise SLAs"]
  }
];

const LINK_CONTENT: Record<string, string> = {
  "Reset your password": "To reset your password, click on 'Forgot Password' on the login screen. You will receive an email with a secure link to create a new password. Ensure you check your spam folder if it doesn't arrive within 5 minutes.",
  "Understanding user roles": "IntelliAttend supports four primary roles: Student, Faculty, Admin, and Super Admin. Each role has specific permissions. Students can view attendance, while Faculty can mark attendance and Admins can configure systemic settings.",
  "Troubleshoot login": "If you are unable to login, ensure your credentials are correct and your caps lock is off. If you use Single Sign-On (SSO), verify that your campus identity provider is currently operational.",
  
  "Attendance not recording": "If attendance isn't registering, verify your device's network connection. If using biometric scanners, ensure the hardware is properly connected to the local network and the IntelliAttend sync service is running.",
  "Manual attendance override": "Faculty and Admins can manually override attendance records. Navigate to the specific class session in your dashboard, select the student, and click 'Edit Status' to change their attendance state.",
  "Syncing offline data": "If you took attendance offline, the system will automatically synchronize the data once your device reconnects to the internet. You can also manually trigger a sync from the settings menu.",
  
  "SmartBoard offline": "Check the power source and network cable connected to your SmartBoard. Navigate to the network settings on the board's interface to ensure it has acquired a valid IP address.",
  "Screen mirroring issues": "Ensure both your personal device and the SmartBoard are connected to the same campus Wi-Fi network. If using Apple AirPlay or Miracast, check if your IT department has restricted peer-to-peer sharing.",
  "Updating firmware": "SmartBoard firmware updates are pushed automatically by IT administrators during off-hours. To force a manual update, go to Settings > System > Software Update on the SmartBoard.",
  
  "Uploading lecture notes": "Navigate to your 'Courses' tab, select the specific class, and click 'Add Resource'. You can upload PDF, PPTX, or DOCX files up to 50MB in size.",
  "Sending push notifications": "To broadcast a message to your students, go to the 'Communications' tab. Select your target class, type your message, and click 'Send Alert'. This will push instantly to their mobile apps.",
  "Viewing attendance reports": "Click on 'Reports' in the sidebar, select 'Attendance Analytics', and filter by your specific course and date range. You can export these reports as CSV or PDF files.",
  
  "Viewing your timetable": "Your class schedule is available on the main dashboard of your mobile app or web portal. It syncs automatically with the registrar's office. Changes may take up to 24 hours to reflect.",
  "Submitting assignments": "Go to the 'Assignments' section, click on the pending task, and use the upload button to attach your file. Ensure you click the final 'Submit' button to complete the process.",
  "Updating profile details": "You can update your personal information, emergency contacts, and profile picture by clicking on your avatar in the top right corner and selecting 'Account Settings'.",
  
  "Managing permissions": "Super Admins can modify role-based access controls from the 'Security' dashboard. You can create custom roles or assign specific granular permissions to individual staff members.",
  "Generating campus reports": "The 'Enterprise Analytics' module allows you to aggregate attendance, resource usage, and incident reports across the entire campus. These can be scheduled for automated delivery.",
  "Approving faculty requests": "Pending requests for leave, room changes, or resource allocation will appear in your 'Action Items' inbox. Click on a request to review details and approve or deny.",
  
  "View current invoices": "Billing administrators can access all past and current invoices by navigating to 'Settings > Billing & Subscription'. Invoices are generated on the 1st of every month.",
  "Upgrading your plan": "To add more student licenses or enable premium modules like AI Analytics, go to the 'Subscription' tab and select 'Modify Plan'. Changes take effect immediately.",
  "Enterprise SLAs": "Enterprise customers with premium support have a guaranteed 99.9% uptime SLA. To view your SLA status and support metrics, check the 'Enterprise' tab in your admin console."
};

function AccordionLink({ link }: { link: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const content = LINK_CONTENT[link] || `Here is some helpful information regarding ${link.toLowerCase()}. If you are experiencing issues with this, please check your settings or contact our support team for further assistance.`;

  return (
    <li className="flex flex-col">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-sm font-medium text-[#64748B] flex items-center justify-between w-full hover:text-primary group-hover:text-[#0F172A] py-1 text-left"
      >
        <span className="flex items-center gap-2">
          <ChevronRight className={`w-3.5 h-3.5 text-primary transition-all ${isOpen ? 'rotate-90' : ''}`} />
          {link}
        </span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pl-4 py-2 pr-2 text-xs text-slate-500 leading-relaxed border-l-2 border-primary/20 ml-[7px] mt-1 mb-2">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function HelpTopics() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-2xl font-bold text-[#0F172A] mb-8 text-center">Popular Help Topics</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOPICS.map((topic, idx) => (
            <div key={idx} className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 hover:border-primary/30 hover:bg-primary/5 transition-colors group cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                  {topic.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-primary transition-colors">{topic.title}</h3>
              </div>
              <p className="text-sm text-[#64748B] mb-4">{topic.desc}</p>
              <ul className="space-y-2">
                {topic.links.map((link, i) => (
                  <AccordionLink key={i} link={link} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
