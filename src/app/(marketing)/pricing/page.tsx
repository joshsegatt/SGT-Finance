import { Metadata } from "next";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FaqSection } from "@/components/marketing/faq";
import { CtaSection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "Pricing — SGT Finance",
  description: "Escolha o plano ideal para a sua empresa. Transparência total, sem taxas ocultas.",
};

export default function PricingPage() {
  return (
    <main className="pt-24 pb-16">
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
