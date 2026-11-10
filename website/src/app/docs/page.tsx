import { DocsHero } from "@/components/docs/DocsHero";
import { DocsContent } from "@/components/docs/DocsContent";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <DocsHero />
      <div className="container mx-auto px-4 py-16">
        <DocsContent />
      </div>
    </div>
  );
}
