"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ─────────────────────────────────────────────────────────
   DESIGN TOKENS
   ───────────────────────────────────────────────────────── */
const COLORS = {
  bg: "#F9FAFB",
  card: "#FFFFFF",
  indigo: "#6366F1",
  indigoBg: "rgba(99,102,241,0.08)",
  emerald: "#10B981",
  emeraldBg: "rgba(16,185,129,0.08)",
  text: "#111827",
  textMuted: "#6B7280",
  textFaint: "#9CA3AF",
  border: "rgba(0,0,0,0.06)",
};

const CARD_SHADOW =
  "0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)";
const CARD_SHADOW_LG =
  "0 20px 40px -8px rgba(0,0,0,0.07), 0 8px 16px -4px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.03)";
const CARD_SHADOW_FLOAT =
  "0 24px 48px -12px rgba(0,0,0,0.10), 0 12px 24px -8px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)";

/* ─────────────────────────────────────────────────────────
   FLOATING CARD WRAPPER
   ───────────────────────────────────────────────────────── */
function FloatCard({
  children,
  className = "",
  delay = 0,
  shadow = CARD_SHADOW,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  shadow?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-white rounded-[24px] ${className}`}
      style={{
        boxShadow: shadow,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN DASHBOARD CARD (center/right, perspective)
   ───────────────────────────────────────────────────────── */
function DashboardCard() {
  const kpis = [
    { label: "TOTAL BALANCE", value: "£158,338.59", sub: "Across all accounts", badge: "+12%", badgeColor: COLORS.emerald, badgeBg: COLORS.emeraldBg },
    { label: "CASH RESERVE", value: "£9,044.24", sub: "Savings accounts only", badge: "+8.2%", badgeColor: COLORS.emerald, badgeBg: COLORS.emeraldBg },
    { label: "TAX EXPOSURE", value: "£10,292.01", sub: "Est. effective rate 6.5%", badge: "On track", badgeColor: COLORS.indigo, badgeBg: COLORS.indigoBg },
  ];

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-[#6366F1] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 12L12 16L20 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 16L12 20L20 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white shadow-sm" />
          </div>
          <div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-[#111827] text-[15px] leading-none tracking-[-0.03em] uppercase">
                SGT<span className="text-[#6366F1]">.</span>
              </span>
              <span className="text-[8px] font-bold text-[#9CA3AF] tracking-[0.2em] uppercase leading-none mt-1">
                Finance
              </span>
            </div>
            <div className="text-[9px] font-medium text-[#9CA3AF] tracking-wide uppercase mt-1">Command Center</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 px-3 bg-[#F3F4F6] rounded-lg flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="4" stroke="#9CA3AF" strokeWidth="1.5" /><path d="M10 10l3 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <span className="text-[10px] text-[#9CA3AF] font-medium">Search...</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-[9px] font-bold">SA</div>
        </div>
      </div>

      {/* Overview Title */}
      <div>
        <div className="text-[16px] font-bold text-[#111827]">Overview</div>
        <div className="text-[11px] font-medium text-[#9CA3AF]">Complete financial command center</div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-[#F9FAFB] rounded-[16px] p-4" style={{ border: `1px solid ${COLORS.border}` }}>
            <div className="text-[8px] font-bold text-[#9CA3AF] uppercase tracking-[0.1em] mb-2">{kpi.label}</div>
            <div className="text-[18px] font-bold text-[#111827] leading-tight mb-1.5" style={{ fontFeatureSettings: "'tnum'" }}>{kpi.value}</div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-medium text-[#9CA3AF]">{kpi.sub}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ color: kpi.badgeColor, background: kpi.badgeBg }}>{kpi.badge}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mini Chart Row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-[#F9FAFB] rounded-[16px] p-4 flex flex-col" style={{ border: `1px solid ${COLORS.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-bold text-[#111827]">Cash Flow</div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[9px] font-medium text-[#9CA3AF]"><span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] inline-block" />Income</span>
              <span className="flex items-center gap-1 text-[9px] font-medium text-[#9CA3AF]"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block" />Expenses</span>
            </div>
          </div>
          <svg className="w-full h-[60px]" viewBox="0 0 300 60" fill="none" preserveAspectRatio="none">
            <path d="M0 50 Q40 42,80 30 T160 18 T240 28 T300 38" stroke="#6366F1" strokeWidth="2" />
            <path d="M0 50 Q40 42,80 30 T160 18 T240 28 T300 38 V60 H0 Z" fill="url(#cfGrad)" opacity="0.12" />
            <path d="M0 52 Q40 50,80 45 T160 42 T240 44 T300 48" stroke="#10B981" strokeWidth="1.5" opacity="0.7" />
            <defs><linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366F1" /><stop offset="100%" stopColor="#6366F1" stopOpacity="0" /></linearGradient></defs>
          </svg>
        </div>
        <div className="col-span-2 bg-[#F9FAFB] rounded-[16px] p-4 flex flex-col gap-2" style={{ border: `1px solid ${COLORS.border}` }}>
          <div className="text-[11px] font-bold text-[#111827]">Alerts</div>
          {[
            { dot: "#EF4444", text: "Overdue Invoice" },
            { dot: "#F59E0B", text: "VAT due in 13d" },
            { dot: "#6366F1", text: "Subscription idle" },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: a.dot }} />
              <span className="text-[10px] font-medium text-[#6B7280] truncate">{a.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CASH FLOW CARD (floating bottom-right)
   Area chart with gradient + dashed projection
   ───────────────────────────────────────────────────────── */
function CashFlowFloat() {
  return (
    <div className="p-5 w-[280px]">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[12px] font-bold text-[#111827]">Cash Flow</div>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md" style={{ color: COLORS.emerald, background: COLORS.emeraldBg }}>+18% YoY</span>
      </div>
      <div className="text-[9px] font-medium text-[#9CA3AF] mb-3">Last 6 months · Projection included</div>
      <svg className="w-full h-[80px]" viewBox="0 0 260 80" fill="none">
        {/* Actual data line */}
        <path d="M0 65 C30 58,50 40,80 35 S130 22,160 28 S190 32,200 30" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
        {/* Gradient fill */}
        <path d="M0 65 C30 58,50 40,80 35 S130 22,160 28 S190 32,200 30 V80 H0 Z" fill="url(#cfFloatGrad)" opacity="0.15" />
        {/* Dashed projection line */}
        <path d="M200 30 C220 26,240 22,260 18" stroke="#6366F1" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" opacity="0.5" />
        {/* Expenses line */}
        <path d="M0 68 C30 66,50 60,80 58 S130 52,160 54 S190 56,200 55" stroke="#10B981" strokeWidth="1.5" opacity="0.6" />
        <defs><linearGradient id="cfFloatGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366F1" /><stop offset="100%" stopColor="#6366F1" stopOpacity="0" /></linearGradient></defs>
      </svg>
      <div className="flex items-center gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-[9px] font-medium text-[#6B7280]"><span className="w-2 h-0.5 rounded-full bg-[#6366F1] inline-block" />Actual</span>
        <span className="flex items-center gap-1.5 text-[9px] font-medium text-[#6B7280]"><span className="w-2 h-0.5 rounded-full bg-[#6366F1] inline-block opacity-50 border-dashed" />Projection</span>
        <span className="flex items-center gap-1.5 text-[9px] font-medium text-[#6B7280]"><span className="w-2 h-0.5 rounded-full bg-[#10B981] inline-block" />Expenses</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TAX WIDGET (floating top-right)
   Shield icon + Provisioned status
   ───────────────────────────────────────────────────────── */
function TaxWidget() {
  return (
    <div className="p-5 w-[220px]">
      <div className="flex items-center gap-3 mb-3">
        {/* Shield icon */}
        <div className="w-9 h-9 rounded-[12px] flex items-center justify-center" style={{ background: COLORS.emeraldBg }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.emerald} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <div>
          <div className="text-[12px] font-bold text-[#111827]">Tax Status</div>
          <div className="text-[10px] font-medium text-[#10B981]">Provisioned ✓</div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-[0.08em]">IVA Q2 2026</span>
        <span className="text-[14px] font-bold text-[#111827]" style={{ fontFeatureSettings: "'tnum'" }}>£10,292</span>
      </div>
      {/* Progress */}
      <div className="w-full h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "78%" }}
          transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
          className="h-full rounded-full bg-[#10B981]"
        />
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[9px] font-medium text-[#9CA3AF]">78% provisioned</span>
        <span className="text-[9px] font-bold text-[#10B981]">On schedule</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FINANCIAL MIX BADGE (floating left-center)
   Business vs Personal split
   ───────────────────────────────────────────────────────── */
function FinancialMixBadge() {
  return (
    <div className="p-4 w-[200px]">
      <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.08em] mb-3">Financial Mix</div>
      <div className="flex items-center gap-2 mb-3">
        {/* Stacked bar */}
        <div className="flex-1 h-3 rounded-full overflow-hidden flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "72%" }}
            transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
            className="h-full bg-[#6366F1] rounded-l-full"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "28%" }}
            transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
            className="h-full bg-[#10B981] rounded-r-full"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-[#6366F1]" />
          <span className="text-[10px] font-bold text-[#111827]">Business</span>
          <span className="text-[10px] font-medium text-[#9CA3AF]">72%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-[#10B981]" />
          <span className="text-[10px] font-bold text-[#111827]">Personal</span>
          <span className="text-[10px] font-medium text-[#9CA3AF]">28%</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   HERO SECTION
   ───────────────────────────────────────────────────────── */
export function HeroSection() {
  const t = useTranslations("Marketing.hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const floatY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const floatOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ background: COLORS.bg, minHeight: "100vh" }}
    >
      {/* Subtle background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full opacity-[0.035]" style={{ background: "radial-gradient(circle, #6366F1, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #10B981, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-36 md:pt-44 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ═══ LEFT: Headline + CTA ═══ */}
          <div className="flex flex-col items-start text-left max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="font-heading font-black tracking-tight text-[#111827] mb-6 leading-[1.08]"
              style={{ fontSize: "clamp(40px, 5.5vw, 64px)" }}
            >
              {t("headline1")}
              <br />
              <span className="text-[#6366F1]">{t("headline2")}</span>
              <br />
              {t("headline3")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-[17px] font-medium leading-relaxed text-[#6B7280] mb-10 max-w-md"
            >
              {t("subhead")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-8"
            >
              <Link
                href="/register"
                className="group flex items-center justify-center gap-3 font-bold text-white transition-all duration-300 bg-[#6366F1] hover:bg-[#5558E6] hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  padding: "16px 36px",
                  borderRadius: 14,
                  fontSize: 16,
                  boxShadow: "0 8px 20px -4px rgba(99,102,241,0.4), 0 2px 6px -1px rgba(99,102,241,0.2)",
                }}
              >
                {t("cta1")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-2 font-bold transition-all duration-300 text-[#111827] hover:bg-white hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  padding: "16px 36px",
                  borderRadius: 14,
                  fontSize: 16,
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${COLORS.border}`,
                  boxShadow: CARD_SHADOW,
                }}
              >
                {t("cta2")}
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[13px] font-medium text-[#9CA3AF]"
            >
              {t("trust")}
            </motion.p>
          </div>

          {/* ═══ RIGHT: Orbital Dashboard Composition ═══ */}
          <motion.div
            className="relative w-full min-h-[520px] lg:min-h-[580px]"
            style={{ y: floatY, opacity: floatOpacity }}
          >
            {/* ── Main Dashboard (center, with perspective) ── */}
            <motion.div
              initial={{ opacity: 0, y: 60, rotateY: -4, rotateX: 4 }}
              animate={{ opacity: 1, y: 0, rotateY: 0, rotateX: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
              style={{ perspective: "1200px" }}
            >
              <div
                className="rounded-[24px] overflow-hidden bg-white"
                style={{ boxShadow: CARD_SHADOW_LG, border: `1px solid ${COLORS.border}` }}
              >
                {/* Browser chrome */}
                <div className="flex items-center h-10 bg-[#F3F4F6] border-b px-4 gap-3" style={{ borderColor: COLORS.border }}>
                  <div className="flex items-center gap-[6px]">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#FF5F57]" />
                    <div className="w-[10px] h-[10px] rounded-full bg-[#FEBC2E]" />
                    <div className="w-[10px] h-[10px] rounded-full bg-[#28C840]" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="h-[22px] w-[50%] max-w-[240px] rounded-md bg-white flex items-center justify-center gap-1.5" style={{ border: `1px solid ${COLORS.border}` }}>
                      <span className="text-[10px] font-medium text-[#9CA3AF] tracking-tight">sgt-finance.vercel.app</span>
                    </div>
                  </div>
                  <div className="w-[42px]" />
                </div>
                <DashboardCard />
              </div>
            </motion.div>

            {/* ── Tax Widget (floating top-right, higher Z) ── */}
            <div className="absolute -top-4 -right-4 md:right-0 z-20">
              <FloatCard delay={0.9} shadow={CARD_SHADOW_FLOAT}>
                <TaxWidget />
              </FloatCard>
            </div>

            {/* ── Cash Flow (floating bottom-left, lower Z) ── */}
            <div className="absolute -bottom-6 -left-6 md:-left-8 z-20">
              <FloatCard delay={1.0} shadow={CARD_SHADOW_FLOAT}>
                <CashFlowFloat />
              </FloatCard>
            </div>

            {/* ── Financial Mix (floating mid-left) ── */}
            <div className="absolute top-[38%] -left-10 md:-left-12 z-20">
              <FloatCard delay={1.1} shadow={CARD_SHADOW_FLOAT}>
                <FinancialMixBadge />
              </FloatCard>
            </div>

            {/* ── ROI Badge (floating bottom-right) ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="absolute bottom-8 right-2 md:right-6 z-30 rounded-[16px] px-4 py-3 flex items-center gap-3"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(16px)",
                boxShadow: CARD_SHADOW_FLOAT,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm font-black" style={{ background: COLORS.emeraldBg, color: COLORS.emerald }}>↑</div>
              <div>
                <div className="text-[14px] font-bold text-[#111827] leading-none">ROI <span className="text-[#10B981]">+34%</span></div>
                <div className="text-[10px] font-medium text-[#9CA3AF]">this quarter</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
