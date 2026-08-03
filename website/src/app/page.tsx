import { HeroSection } from "@/components/home/HeroSection";
import { AIFeatures } from "@/components/home/AIFeatures";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyIntelliAttend } from "@/components/home/WhyIntelliAttend";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactSection } from "@/components/home/ContactSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
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
