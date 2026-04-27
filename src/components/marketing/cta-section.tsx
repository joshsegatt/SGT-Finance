"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function CtaSection() {
  const t = useTranslations("Marketing.cta");
  return (
    <section
      className="relative overflow-hidden font-sans bg-background"
      style={{ paddingTop: 120, paddingBottom: 120 }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[3rem] overflow-hidden p-10 md:p-24 text-center bg-slate-950 shadow-2xl"
        >
          {/* ── Premium Mesh Gradient ── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-indigo-600/30 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-violet-600/20 blur-[100px] rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald-500/5 blur-[140px] rounded-full" />
            
            {/* Subtle Noise Texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-heading font-black text-white tracking-[-0.05em] mb-6"
              style={{ fontSize: "clamp(44px, 7vw, 72px)", lineHeight: 0.95 }}
            >
              {t("headline1")}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-300">
                {t("headline2")}
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mb-14 font-medium text-slate-300 max-w-xl mx-auto" 
              style={{ fontSize: 20, lineHeight: 1.5, letterSpacing: "-0.01em" }}
            >
              {t("body")}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            >
              <Link
                href="/register"
                className="group flex items-center justify-center gap-3 font-black text-white bg-gradient-to-r from-[#6366F1] to-[#4F46E5] transition-all duration-300 w-full sm:w-auto shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 ring-1 ring-white/20 hover:ring-white/40 ring-offset-4 ring-offset-slate-950 active:scale-95"
                style={{
                  padding: "22px 56px",
                  borderRadius: 20,
                  fontSize: 18,
                }}
              >
                {t("button1")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300 text-indigo-200" />
              </Link>
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-2 font-bold transition-all duration-300 hover:bg-white/5 w-full sm:w-auto text-white border border-white/10 backdrop-blur-sm"
                style={{
                  padding: "22px 56px",
                  borderRadius: 20,
                  fontSize: 18,
                }}
              >
                {t("button2")}
              </Link>
            </motion.div>

            {/* ── Monochromatic Discrete Badges ── */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 pt-8 border-t border-white/5"
            >
              {[
                { label: "SSL Encrypted", icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
                { label: "GDPR Compliant", icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
                { label: "Bank Grade Security", icon: <path d="M3 21h18M3 10h18M5 10v11M9 10v11M13 10v11M17 10v11M2 5l10-3 10 3v5H2V5z" /> },
                { label: "99.9% Uptime", icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /> },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors cursor-default"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {badge.icon}
                  </svg>
                  {badge.label}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
