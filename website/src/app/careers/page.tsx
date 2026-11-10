import type { Metadata } from "next";
import { Briefcase, MapPin, Clock, ArrowRight, GraduationCap, Code2, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers & Student Contributors | IntelliAttend",
  description: "Join the IntelliAttend team, student developer initiative, and campus contributor community.",
};

const openings = [
  { 
    title: "Full-Stack Web Developer Intern", 
    location: "Hyderabad / Hybrid", 
    type: "Internship / Contributor", 
    department: "Frontend & Next.js" 
  },
  { 
    title: "Mobile App Developer (React Native / Flutter)", 
    location: "Hyderabad / Hybrid", 
    type: "Internship / Contributor", 
    department: "Mobile Engineering" 
  },
  { 
    title: "UI/UX & Product Design Contributor", 
    location: "Remote / Hybrid", 
    type: "Contributor", 
    department: "Design & UX" 
  },
  { 
    title: "Campus Pilot & Deployment Coordinator", 
    location: "Hyderabad (Malla Reddy Colleges / Campus)", 
    type: "Campus Ambassador", 
    department: "Operations" 
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-40 pb-20 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
            <Code2 className="w-4 h-4" /> Build with Us
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#0F172A] mb-6 tracking-tight">
            Build the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Campus Technology.</span>
          </h1>
          <p className="text-xl text-[#64748B] max-w-3xl mx-auto leading-relaxed">
            IntelliAttend is built by passionate engineering students and faculty. We welcome student developers, open-source contributors, and campus ambassadors to help shape modern education.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">Why Build with IntelliAttend?</h2>
            <p className="text-slate-500 text-lg">Real impact on actual classrooms and live institutional deployments.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary">
                <Code2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Modern Tech Stack</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">
                Work with Next.js 16, TypeScript, Tailwind CSS, Framer Motion, and scalable cloud APIs.
              </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Real Campus Impact</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">
                Your code and designs directly power roll-calls, SmartBoards, and schedules used by real faculty and peers.
              </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Mentorship & Growth</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">
                Collaborate directly with professors and core maintainers on production architecture and deployments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Opportunities */}
      <section className="py-20 bg-[#F8FAFC] border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">Open Opportunities</h2>
            <p className="text-slate-500 text-lg">Interested in contributing? Reach out to connect with our core team.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {openings.map((job, i) => (
              <a
                key={i}
                href="https://wa.me/919493615849?text=Hi%20IntelliAttend%20Team%2C%20I%20am%20interested%20in%20contributing%20to%20IntelliAttend."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 hover:shadow-md transition-all group block"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2 group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-[#64748B]">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {job.type}</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {job.department}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary font-bold text-sm shrink-0">
                  Connect on WhatsApp <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-500 mb-4">Have an idea or want to run a pilot at your college?</p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
            >
              Contact our team directly <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
