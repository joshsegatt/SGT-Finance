"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const PLAN_KEYS = [
  { key: "FREE", monthlyPrice: 0, annualPrice: 0, color: "rgba(255,255,255,0.07)", accentColor: "rgba(255,255,255,0.15)", ctaHref: "/register", featKey: "free", popular: false },
  { key: "PRO", monthlyPrice: 19, annualPrice: 15, color: "rgba(73,121,239,0.12)", accentColor: "#4979EF", ctaHref: "/register?plan=pro", featKey: "pro", popular: true },
  { key: "BUSINESS", monthlyPrice: 49, annualPrice: 39, color: "rgba(124,58,237,0.10)", accentColor: "#7C3AED", ctaHref: "/register?plan=business", featKey: "biz", popular: false },
] as const;


export function PricingSection() {
  const t = useTranslations("Marketing.pricing");
  const [annual, setAnnual] = useState(false);

  const PLANS = PLAN_KEYS.map((p) => ({
    ...p,
    name: p.key === "FREE" ? "Free" : p.key === "PRO" ? "Pro" : "Business",
    description: t(`plan${p.key.charAt(0) + p.key.slice(1).toLowerCase()}Desc` as "planFreeDesc" | "planProDesc" | "planBusinessDesc"),
    cta: p.key === "FREE" ? t("ctaFree") : p.key === "PRO" ? t("ctaPro") : t("ctaBusiness"),
    features: t.raw(`${p.featKey}Features`) as string[],
    missing: t.raw(`${p.featKey}Missing`) as string[],
  }));

  return (
    <section
      id="pricing"
      style={{ background: "#050A14", paddingTop: 100, paddingBottom: 100, borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-block px-3 py-1 rounded-full mb-5 text-[11px] font-semibold uppercase tracking-widest"
            style={{ background: "rgba(73,121,239,0.10)", border: "1px solid rgba(73,121,239,0.20)", color: "#7BA4FF" }}
          >
            Preços
          </div>
          <h2
            className="font-black tracking-tight text-white mb-4"
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
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
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.38)", marginBottom: 32 }}>
            {t("subhead")}
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              onClick={() => setAnnual(false)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: !annual ? "rgba(255,255,255,0.10)" : "transparent",
                color: !annual ? "white" : "rgba(255,255,255,0.40)",
                border: !annual ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
              }}
            >
              {t("monthly")}
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: annual ? "rgba(73,121,239,0.18)" : "transparent",
                color: annual ? "#7BA4FF" : "rgba(255,255,255,0.40)",
                border: annual ? "1px solid rgba(73,121,239,0.30)" : "1px solid transparent",
              }}
            >
              {t("annual")}
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: "rgba(34,197,94,0.18)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }}
              >
                {t("annualDiscount")}
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.key}
                className="relative flex flex-col rounded-2xl transition-all duration-200"
                style={{
                  background: isPopular ? "rgba(73,121,239,0.08)" : "rgba(255,255,255,0.03)",
                  border: isPopular
                    ? "1px solid rgba(73,121,239,0.35)"
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isPopular ? "0 0 60px rgba(73,121,239,0.12), 0 4px 30px rgba(0,0,0,0.4)" : "none",
                }}
              >
                {isPopular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold"
                    style={{
                      background: "linear-gradient(135deg, #4979EF, #7C3AED)",
                      color: "white",
                      boxShadow: "0 4px 20px rgba(73,121,239,0.4)",
                    }}
                  >
                    {t("mostPopular")}
                  </div>
                )}

                {/* Top gradient line */}
                {isPopular && (
                  <div
                    className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(73,121,239,0.8), transparent)" }}
                  />
                )}

                <div className="p-7 flex flex-col flex-1">
                  <div className="mb-6">
                    <div className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: isPopular ? "#7BA4FF" : "rgba(255,255,255,0.40)" }}>
                      {plan.name}
                    </div>
                    <div className="flex items-end gap-1 mb-3">
                      {price === 0 ? (
                    <span className="font-black text-white" style={{ fontSize: 40, letterSpacing: "-0.03em", lineHeight: 1 }}>
                          {t("free")}
                        </span>
                      ) : (
                        <>
                          <span className="font-black text-white" style={{ fontSize: 40, letterSpacing: "-0.03em", lineHeight: 1 }}>
                            €{price}
                          </span>
                          <span className="mb-1.5" style={{ fontSize: 14, color: "rgba(255,255,255,0.38)" }}>{t("perMonth")}</span>
                        </>
                      )}
                    </div>
                    {annual && price > 0 && (
                      <div className="text-[11px] mb-3" style={{ color: "#22c55e" }}>
                        {t("annualSaving", { amount: (plan.monthlyPrice - plan.annualPrice) * 12 })}
                      </div>
                    )}
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>
                      {plan.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    href={plan.ctaHref}
                    className="flex items-center justify-center py-3 rounded-xl font-bold text-sm mb-7 transition-all duration-200"
                    style={
                      isPopular
                        ? {
                            background: "linear-gradient(135deg, #4979EF, #3B6CE0)",
                            color: "white",
                            boxShadow: "0 0 24px rgba(73,121,239,0.40)",
                          }
                        : {
                            background: "rgba(255,255,255,0.07)",
                            color: "rgba(255,255,255,0.75)",
                            border: "1px solid rgba(255,255,255,0.10)",
                          }
                    }
                  >
                    {plan.cta}
                  </Link>

                  {/* Features */}
                  <div className="flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2.5" style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                        <span
                          className="flex items-center justify-center shrink-0"
                          style={{ width: 18, height: 18, borderRadius: "50%", background: isPopular ? "rgba(73,121,239,0.20)" : "rgba(255,255,255,0.08)" }}
                        >
                          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                            <path d="M1.5 4.5l2 2 4-4" stroke={isPopular ? "#7BA4FF" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        {f}
                      </div>
                    ))}
                    {plan.missing.map((f) => (
                      <div key={f} className="flex items-center gap-2.5" style={{ fontSize: 13, color: "rgba(255,255,255,0.22)" }}>
                        <span
                          className="flex items-center justify-center shrink-0"
                          style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }}
                        >
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M2 2l4 4M6 2L2 6" stroke="rgba(255,255,255,0.20)" strokeWidth="1.3" strokeLinecap="round" />
                          </svg>
                        </span>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center mt-10" style={{ fontSize: 13, color: "rgba(255,255,255,0.28)" }}>
          {t("footerNote")}{" "}
          <Link href="/pricing" style={{ color: "#7BA4FF" }}>{t("comparisonLink")}</Link>
        </p>
      </div>
    </section>
  );
}
