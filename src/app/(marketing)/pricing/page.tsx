import type { Metadata } from "next";
import { PricingSection } from "@/components/marketing/pricing-section";
import { CtaSection } from "@/components/marketing/cta-section";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Preços — SGT Finance",
  description:
    "Planos simples e transparentes para PMEs. Começa grátis, sem cartão de crédito.",
};

const COMPARISON = [
  { feature: "Empresas", free: "1", pro: "3", business: "Ilimitadas" },
  { feature: "Contas bancárias", free: "2", pro: "10", business: "Ilimitadas" },
  { feature: "Faturas por mês", free: "10", pro: "Ilimitadas", business: "Ilimitadas" },
  { feature: "Open Banking (TrueLayer + Salt Edge)", free: "✓", pro: "✓", business: "✓" },
  { feature: "Dashboard & KPIs", free: "Básico", pro: "Avançado", business: "Avançado" },
  { feature: "Cash flow analytics", free: "—", pro: "✓", business: "✓" },
  { feature: "Gestão de impostos (IVA/IRC)", free: "—", pro: "✓", business: "✓" },
  { feature: "Relatórios personalizados", free: "—", pro: "—", business: "✓" },
  { feature: "API access", free: "—", pro: "—", business: "✓" },
  { feature: "White-label", free: "—", pro: "—", business: "✓" },
  { feature: "Gestor de conta dedicado", free: "—", pro: "—", business: "✓" },
  { feature: "Suporte", free: "Email", pro: "Prioritário", business: "24/7 dedicado" },
  { feature: "GDPR compliant", free: "✓", pro: "✓", business: "✓" },
  { feature: "SSL + backups diários", free: "✓", pro: "✓", business: "✓" },
];

export default async function PricingPage() {
  const t = await getTranslations("Marketing.pricingPage");
  return (
    <main style={{ background: "#050A14", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        className="relative text-center overflow-hidden"
        style={{ paddingTop: 120, paddingBottom: 80 }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full" style={{ width: 700, height: 500, background: "radial-gradient(ellipse, rgba(73,121,239,0.10) 0%, transparent 70%)" }} />
        </div>
        <div className="relative max-w-2xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 mb-8 text-sm transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {t("back")}
          </Link>
          <h1
            className="font-black text-white tracking-tight mb-4"
            style={{ fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.05 }}
          >
            {t("headline1")}{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4979EF, #7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("headline2")}
            </span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.40)", lineHeight: 1.7 }}>
            {t("subhead")}
          </p>
        </div>
      </div>

      {/* Pricing cards */}
      <PricingSection />

      {/* Full comparison table */}
      <section style={{ paddingTop: 80, paddingBottom: 100 }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-center font-bold text-white mb-12"
            style={{ fontSize: 28 }}
          >
            {t("comparison")}
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {/* Header */}
            <div
              className="grid grid-cols-4 text-center"
              style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="p-4 text-left" style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.30)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Funcionalidade
              </div>
              {["Gratuito", "Pro", "Business"].map((plan, i) => (
                <div key={plan} className="p-4" style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: i === 1 ? "#7BA4FF" : "rgba(255,255,255,0.70)" }}>
                    {plan}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.30)", marginTop: 2 }}>
                    {i === 0 ? "€0/mês" : i === 1 ? "€19/mês" : "€49/mês"}
                  </div>
                </div>
              ))}
            </div>

            {/* Rows */}
            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className="grid grid-cols-4 text-center"
                style={{
                  borderBottom: i < COMPARISON.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.012)",
                }}
              >
                <div className="p-3.5 text-left" style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                  {row.feature}
                </div>
                {[row.free, row.pro, row.business].map((val, j) => (
                  <div
                    key={j}
                    className="p-3.5 flex items-center justify-center"
                    style={{
                      fontSize: 13,
                      borderLeft: "1px solid rgba(255,255,255,0.04)",
                      color: val === "✓"
                        ? "#22c55e"
                        : val === "—"
                        ? "rgba(255,255,255,0.18)"
                        : j === 1
                        ? "rgba(255,255,255,0.75)"
                        : "rgba(255,255,255,0.55)",
                      fontWeight: val === "✓" || val === "—" ? 700 : 500,
                    }}
                  >
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </main>
  );
}
