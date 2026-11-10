import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { AIFeatures } from "@/components/home/AIFeatures";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyIntelliAttend } from "@/components/home/WhyIntelliAttend";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactSection } from "@/components/home/ContactSection";
import { CTASection } from "@/components/home/CTASection";
import { FAQJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "IntelliAttend | Intelligent Attendance. Smart Campus Platform",
  description:
    "The connected campus management platform for higher education. Manage attendance, schedules, SmartBoard displays, notifications, analytics, and academic communication from one unified platform.",
  openGraph: {
    title: "IntelliAttend | Intelligent Attendance. Smart Campus Platform",
    description:
      "From 1-tap attendance and timetable scheduling to fee payments and SmartBoard displays—run your entire campus from one unified platform at your fingertips.",
    url: "https://www.intelliattend.app",
    images: [
      {
        url: "https://www.intelliattend.app/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "IntelliAttend - Intelligent Campus Platform",
      },
    ],
  },
  alternates: {
    canonical: "https://www.intelliattend.app",
  },
};

const faqItems = [
  {
    question: "What is IntelliAttend?",
    answer:
      "IntelliAttend is a connected campus operating platform that simplifies daily lectures, 1-tap attendance, SmartBoard presentations, fee payments, and academic records from one unified dashboard.",
  },
  {
    question: "How does digital attendance work?",
    answer:
      "IntelliAttend allows faculty to complete 1-tap paperless roll-calls in seconds directly from their mobile or web portal. Attendance records are instantly synchronized to student apps and administrative compliance reports, eliminating manual paper registers.",
  },
  {
    question: "What products does IntelliAttend offer?",
    answer:
      "IntelliAttend offers three main products: SmartBoard for interactive classroom displays, Faculty Portal for managing classes and attendance, and Student App for tracking progress, schedules, and accessing resources.",
  },
  {
    question: "Is IntelliAttend suitable for K-12 schools?",
    answer:
      "Yes! IntelliAttend offers tailored solutions for K-12 schools with features like parent notifications, simplified attendance tracking, resource management, and age-appropriate student interfaces.",
  },
  {
    question: "How much does IntelliAttend cost?",
    answer:
      "IntelliAttend offers flexible pricing plans starting from free for small institutions. Contact our sales team for enterprise pricing tailored to your campus size and requirements.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <FAQJsonLd items={faqItems} />
      <HeroSection />
      <AIFeatures />
      <HowItWorks />
      <WhyIntelliAttend />
      <Testimonials />
      <ContactSection />
      <CTASection />
    </div>
  );
}
