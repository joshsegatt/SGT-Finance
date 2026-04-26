import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/hero";
import { SocialProofSection } from "@/components/marketing/social-proof";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works";
import { PricingSection } from "@/components/marketing/pricing-section";
import { CtaSection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "SGT Finance — Controlo Financeiro Total para PMEs",
  description:
    "Conecta bancos via Open Banking, gere faturas, acompanha impostos e visualiza o teu cash flow. A plataforma financeira premium para PMEs portuguesas e europeias.",
  openGraph: {
    title: "SGT Finance — Controlo Financeiro Total para PMEs",
    description:
      "Conecta bancos, gere faturas, impostos e cash flow numa só plataforma.",
    type: "website",
  },
};

export default function MarketingPage() {
  return (
    <main>
      <HeroSection />
      <SocialProofSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CtaSection />
    </main>
  );
}
