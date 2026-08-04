"use client"

import { PricingHero } from "@/components/pricing/PricingHero"
import Pricing_05 from "@/components/ui/ruixen-pricing05"
import { FeatureComparison } from "@/components/pricing/FeatureComparison"
import { IncludedFeatures } from "@/components/pricing/IncludedFeatures"
import { ImplementationServices } from "@/components/pricing/ImplementationServices"
import { PricingFAQ } from "@/components/pricing/PricingFAQ"
import { PricingCTA } from "@/components/pricing/PricingCTA"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Animated Gradient Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <PricingHero />
      <Pricing_05 />
      <FeatureComparison />
      <IncludedFeatures />
      <ImplementationServices />
      <PricingFAQ />
      <PricingCTA />
    </div>
  )
}

