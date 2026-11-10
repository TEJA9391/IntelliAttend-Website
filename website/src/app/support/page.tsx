import { HelpHero } from "@/components/support/HelpHero";
import { HelpTopics } from "@/components/support/HelpTopics";
import { HelpContact } from "@/components/support/HelpContact";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-slate-100 selection:text-slate-700">
      <HelpHero />
      <HelpTopics />
      <HelpContact />
    </div>
  );
}
