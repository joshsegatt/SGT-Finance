"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const PLAN_KEYS = [
  { key: "FREE", monthlyPrice: 0, annualPrice: 0, ctaHref: "/register", featKey: "free", popular: false },
  { key: "PRO", monthlyPrice: 19, annualPrice: 15, ctaHref: "/register?plan=pro", featKey: "pro", popular: true },
  { key: "BUSINESS", monthlyPrice: 49, annualPrice: 39, ctaHref: "/register?plan=business", featKey: "biz", popular: false },
] as const;

export function PricingSection() {
  const t = useTranslations("Marketing.pricing");
  const [annual, setAnnual] = useState(false);

  const PLANS = PLAN_KEYS.map((p) => ({
    ...p,
    name: p.key === "FREE" ? "Free" : p.key === "PRO" ? "Pro" : "Business",
    description: t(`plan${p.key.charAt(0) + p.key.slice(1).toLowerCase()}Desc` as any),
    cta: p.key === "FREE" ? t("ctaFree") : p.key === "PRO" ? t("ctaPro") : t("ctaBusiness"),
    features: t.raw(`${p.featKey}Features`) as string[],
    missing: t.raw(`${p.featKey}Missing`) as string[],
  }));

  return (
    <section
      id="pricing"
      className="font-sans relative overflow-hidden bg-[#F7F8FA]"
      style={{ paddingTop: 120, paddingBottom: 120 }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(97,97,255,0.05) 0%, transparent 60%)" }} />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full mb-6 text-xs font-black uppercase tracking-widest text-[#6161FF] bg-white border border-[#E6E9EF] shadow-sm"
          >
            Preços
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading font-black tracking-tight text-[#323338] mb-6"
            style={{ fontSize: "clamp(36px, 5vw, 56px)" }}
          >
            {t("headline1")}{" "}
            <span className="text-[#6161FF]">
              {t("headline2")}
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto text-lg font-medium text-[#676879] mb-10"
          >
            {t("subhead")}
          </motion.p>

          {/* Toggle */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 p-1.5 rounded-2xl relative bg-white border border-[#E6E9EF] shadow-sm" 
          >
            <div 
               className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl transition-all duration-300 ease-out bg-[#6161FF] shadow-figma-button"
               style={{ 
                 left: annual ? "calc(50% + 1.5px)" : "4.5px" 
               }}
            />
            <button
              onClick={() => setAnnual(false)}
              className="relative z-10 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors duration-200"
              style={{
                color: !annual ? "white" : "#676879",
                width: 140
              }}
            >
              {t("monthly")}
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="relative z-10 flex justify-center items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors duration-200"
              style={{
                color: annual ? "white" : "#676879",
                width: 140
              }}
            >
              {t("annual")}
              <span
                className="absolute -top-3 -right-3 text-[10px] font-black px-2 py-1 rounded-md bg-[#00D745] text-white shadow-sm"
              >
                {t("annualDiscount")}
              </span>
            </button>
          </motion.div>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PLANS.map((plan, i) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice;
            const isPopular = plan.popular;

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 + 0.3 }}
                className={`group relative flex flex-col rounded-[2.5rem] transition-all duration-500 hover:scale-[1.02] ${
                  isPopular 
                    ? "p-[1.5px] bg-gradient-to-b from-[#6366F1] via-[#8B5CF6] to-[#EC4899] shadow-2xl z-20" 
                    : "border border-border/50 bg-secondary/40 backdrop-blur-md shadow-xl"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-[12px] font-black uppercase tracking-wider bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg z-30">
                    {t("mostPopular")}
                  </div>
                )}

                <div className={`flex flex-col flex-1 p-8 rounded-[2.4rem] h-full ${isPopular ? "bg-white/95 backdrop-blur-sm" : ""}`}>
                  <div className="mb-8">
                    <div className={`text-sm font-black uppercase tracking-widest mb-3 ${isPopular ? "text-primary" : "text-muted-foreground"}`}>
                      {plan.name}
                    </div>
                    <div className="flex items-end gap-1.5 mb-3 h-14">
                      {price === 0 ? (
                        <span className="font-heading font-black text-foreground" style={{ fontSize: 48, letterSpacing: "-0.04em", lineHeight: 1 }}>
                          {t("free")}
                        </span>
                      ) : (
                        <>
                          <AnimatePresence mode="popLayout">
                            <motion.span 
                               key={price} 
                               initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                               animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                               exit={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                               className="font-heading font-black text-foreground" 
                               style={{ fontSize: 56, letterSpacing: "-0.04em", lineHeight: 1 }}
                            >
                              €{price}
                            </motion.span>
                          </AnimatePresence>
                          <span className="mb-2 font-medium text-muted-foreground text-sm">{t("perMonth")}</span>
                        </>
                      )}
                    </div>
                    {annual && price > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-[12px] font-bold mb-4 text-emerald-500" 
                      >
                        {t("annualSaving", { amount: (plan.monthlyPrice - plan.annualPrice) * 12 })}
                      </motion.div>
                    )}
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed" style={{ marginTop: price === 0 || !annual ? 16 : 0 }}>
                      {plan.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    href={plan.ctaHref}
                    className={`flex flex-col items-center justify-center py-4 rounded-2xl font-bold text-sm mb-8 transition-all duration-300 ${
                      isPopular 
                        ? "bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white shadow-figma-button hover:shadow-figma-button-hover hover:opacity-90" 
                        : "bg-white border border-border text-foreground hover:bg-secondary/20 shadow-sm"
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <div className="h-px w-full mb-8 bg-border/50" />

                  {/* Features */}
                  <div className="flex-1 space-y-4">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-3 text-sm font-medium text-foreground/90">
                        <span
                          className={`flex items-center justify-center shrink-0 mt-0.5 w-5 h-5 rounded-full ${isPopular ? "bg-primary/10" : "bg-secondary/50"}`}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke={isPopular ? "currentColor" : "currentColor"} className={isPopular ? "text-primary" : "text-muted-foreground"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span>{f}</span>
                      </div>
                    ))}
                    {plan.missing.map((f) => (
                      <div key={f} className="flex items-start gap-3 text-sm font-medium text-muted-foreground/60">
                        <span
                          className="flex items-center justify-center shrink-0 mt-0.5 w-5 h-5 rounded-full border border-border/50"
                        >
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M2 2l4 4M6 2L2 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                          </svg>
                        </span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 text-sm font-medium text-[#676879]" 
        >
          {t("footerNote")}{" "}
          <Link href="/pricing" className="text-[#6161FF] font-bold hover:underline">{t("comparisonLink")}</Link>
        </motion.p>
      </div>
    </section>
  );
}
