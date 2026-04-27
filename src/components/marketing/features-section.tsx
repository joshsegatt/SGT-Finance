"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────
   DESIGN TOKENS (matching Hero)
   ───────────────────────────────────────────────────────── */
const SHADOW = "0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)";
const SHADOW_LG = "0 20px 40px -8px rgba(0,0,0,0.07), 0 8px 16px -4px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.03)";
const BORDER = "rgba(0,0,0,0.06)";

/* ─────────────────────────────────────────────────────────
   FEATURE 1 MOCKUP: Cash Flow Command Center
   Real feature: AreaChart with Income/Expenses + projection
   Benefit: "Saiba para onde vai cada centavo"
   ───────────────────────────────────────────────────────── */
function CashFlowMockup() {
  return (
    <div className="bg-white rounded-[24px] p-6 w-full" style={{ boxShadow: SHADOW_LG, border: `1px solid ${BORDER}` }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[14px] font-bold text-[#111827]">Cash Flow</div>
          <div className="text-[11px] font-medium text-[#9CA3AF]">Last 6 months · Projection included</div>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#6B7280]"><span className="w-2 h-2 rounded-full bg-[#6366F1] inline-block" />Income</span>
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#6B7280]"><span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" />Expenses</span>
        </div>
      </div>
      {/* Chart */}
      <svg className="w-full h-[140px]" viewBox="0 0 400 120" fill="none" preserveAspectRatio="none">
        <line x1="0" y1="30" x2="400" y2="30" stroke="#F3F4F6" strokeWidth="1" />
        <line x1="0" y1="60" x2="400" y2="60" stroke="#F3F4F6" strokeWidth="1" />
        <line x1="0" y1="90" x2="400" y2="90" stroke="#F3F4F6" strokeWidth="1" />
        {/* Income area */}
        <path d="M0 95 C40 85,70 65,100 55 S160 35,200 30 S260 25,300 28" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M0 95 C40 85,70 65,100 55 S160 35,200 30 S260 25,300 28 V120 H0 Z" fill="url(#feat1Grad)" opacity="0.15" />
        {/* Dashed projection */}
        <path d="M300 28 C330 24,360 18,400 12" stroke="#6366F1" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" opacity="0.4" />
        <path d="M300 28 C330 24,360 18,400 12 V120 H300 V28 Z" fill="url(#feat1Grad)" opacity="0.06" />
        {/* Projection label */}
        <rect x="340" y="2" width="56" height="18" rx="4" fill="rgba(99,102,241,0.1)" />
        <text x="368" y="14" textAnchor="middle" fill="#6366F1" fontSize="8" fontWeight="700">Forecast</text>
        {/* Expenses line */}
        <path d="M0 98 C40 96,70 88,100 84 S160 76,200 74 S260 72,300 73 C330 74,360 75,400 76" stroke="#10B981" strokeWidth="1.5" opacity="0.6" />
        <defs><linearGradient id="feat1Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366F1" /><stop offset="100%" stopColor="#6366F1" stopOpacity="0" /></linearGradient></defs>
      </svg>
      {/* Bottom KPIs */}
      <div className="grid grid-cols-3 gap-3 mt-5">
        {[
          { label: "Net Income", value: "£32,800", badge: "+18.2%", color: "#10B981" },
          { label: "Avg Monthly", value: "£7,533", badge: "Stable", color: "#6366F1" },
          { label: "Forecast Q3", value: "£48,200", badge: "+22%", color: "#10B981" },
        ].map((k, i) => (
          <div key={i} className="bg-[#F9FAFB] rounded-[12px] p-3" style={{ border: `1px solid ${BORDER}` }}>
            <div className="text-[8px] font-bold text-[#9CA3AF] uppercase tracking-[0.1em] mb-1">{k.label}</div>
            <div className="text-[14px] font-bold text-[#111827]" style={{ fontFeatureSettings: "'tnum'" }}>{k.value}</div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-1 inline-block" style={{ color: k.color, background: k.color === "#10B981" ? "rgba(16,185,129,0.08)" : "rgba(99,102,241,0.08)" }}>{k.badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FEATURE 2 MOCKUP: Tax Compliance Shield
   Real feature: ComplianceScore, Deadlines, VAT tracking
   Benefit: "Nunca mais tenha medo de impostos"
   ───────────────────────────────────────────────────────── */
function TaxComplianceMockup() {
  const deadlines = [
    { title: "VAT Q2 Return", type: "VAT", days: "13d left", status: "upcoming", color: "#6366F1", bg: "rgba(99,102,241,0.06)" },
    { title: "Corporation Tax", type: "CT", days: "Done", status: "completed", color: "#10B981", bg: "rgba(16,185,129,0.06)" },
    { title: "Payroll PAYE", type: "PAYE", days: "5d overdue", status: "overdue", color: "#EF4444", bg: "rgba(239,68,68,0.06)" },
  ];

  return (
    <div className="bg-white rounded-[24px] p-6 w-full" style={{ boxShadow: SHADOW_LG, border: `1px solid ${BORDER}` }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] flex items-center justify-center" style={{ background: "rgba(16,185,129,0.1)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-bold text-[#111827]">Tax & Compliance</div>
            <div className="text-[11px] font-medium text-[#10B981]">All obligations tracked</div>
          </div>
        </div>
        {/* Score ring */}
        <div className="w-14 h-14 rounded-full border-[3px] border-[#10B981] flex flex-col items-center justify-center bg-white" style={{ boxShadow: "0 0 0 4px rgba(16,185,129,0.08)" }}>
          <span className="text-[16px] font-bold text-[#10B981] leading-none">92</span>
          <span className="text-[7px] font-bold text-[#9CA3AF] uppercase tracking-wider">Score</span>
        </div>
      </div>

      {/* Tax cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-[#F9FAFB] rounded-[12px] p-3" style={{ border: `1px solid ${BORDER}` }}>
          <div className="text-[8px] font-bold text-[#9CA3AF] uppercase tracking-[0.1em] mb-1">VAT Number</div>
          <div className="text-[12px] font-bold text-[#111827] font-mono">GB 123 4567 89</div>
        </div>
        <div className="bg-[#F9FAFB] rounded-[12px] p-3" style={{ border: `1px solid ${BORDER}` }}>
          <div className="text-[8px] font-bold text-[#9CA3AF] uppercase tracking-[0.1em] mb-1">Corp. Tax Rate</div>
          <div className="text-[12px] font-bold text-[#111827]">25%</div>
        </div>
      </div>

      {/* Provision bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-[#111827]">IVA Q2 Provisioned</span>
          <span className="text-[10px] font-bold text-[#10B981]">78%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#F3F4F6] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "78%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="h-full rounded-full bg-[#10B981]"
          />
        </div>
      </div>

      {/* Deadline rows */}
      <div className="flex flex-col gap-2">
        {deadlines.map((d, i) => (
          <div key={i} className="flex items-center gap-3 rounded-[12px] p-3" style={{ background: d.bg, border: `1px solid ${d.color}15` }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: `${d.color}15` }}>
              {d.status === "completed" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={d.color} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
              ) : d.status === "overdue" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={d.color} strokeWidth="2.5" strokeLinecap="round"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={d.color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-[#111827]">{d.title}</div>
              <div className="text-[9px] font-medium text-[#9CA3AF]">{d.type}</div>
            </div>
            <span className="text-[10px] font-bold shrink-0" style={{ color: d.color }}>{d.days}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FEATURE 3 MOCKUP: Invoice & Alert Control
   Real feature: Invoices table, aging, alerts system
   Benefit: "Foco total no crescimento"
   ───────────────────────────────────────────────────────── */
function InvoiceAlertMockup() {
  const invoices = [
    { id: "INV-2025-602", client: "Global Tech Ltd", amount: "£5,000.00", status: "Overdue", statusColor: "#EF4444", statusBg: "rgba(239,68,68,0.08)" },
    { id: "INV-2025-603", client: "Azure Solutions", amount: "£12,450.00", status: "Paid", statusColor: "#10B981", statusBg: "rgba(16,185,129,0.08)" },
    { id: "INV-2025-604", client: "Nordic Finance", amount: "£3,200.00", status: "Pending", statusColor: "#F59E0B", statusBg: "rgba(245,158,11,0.08)" },
  ];

  const alerts = [
    { icon: "🔴", title: "Overdue Invoice", desc: "INV-602 is 5 days overdue" },
    { icon: "🟡", title: "Tax Deadline", desc: "VAT return due in 13 days" },
    { icon: "🔵", title: "Idle Subscription", desc: "Consider cancelling unused tool" },
  ];

  return (
    <div className="bg-white rounded-[24px] p-6 w-full" style={{ boxShadow: SHADOW_LG, border: `1px solid ${BORDER}` }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-[14px] font-bold text-[#111827]">Invoices & Alerts</div>
        <span className="text-[9px] font-bold px-2 py-1 rounded-lg" style={{ color: "#6366F1", background: "rgba(99,102,241,0.08)" }}>3 active</span>
      </div>

      {/* Invoice table */}
      <div className="rounded-[14px] overflow-hidden mb-5" style={{ border: `1px solid ${BORDER}` }}>
        <div className="grid grid-cols-4 gap-2 px-4 py-2 bg-[#F9FAFB]">
          {["Invoice", "Client", "Amount", "Status"].map((h) => (
            <div key={h} className="text-[8px] font-bold text-[#9CA3AF] uppercase tracking-[0.1em]">{h}</div>
          ))}
        </div>
        {invoices.map((inv, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 px-4 py-3 items-center" style={{ borderTop: `1px solid ${BORDER}` }}>
            <div className="text-[11px] font-bold text-[#6366F1] font-mono">{inv.id}</div>
            <div className="text-[11px] font-medium text-[#111827] truncate">{inv.client}</div>
            <div className="text-[11px] font-bold text-[#111827]" style={{ fontFeatureSettings: "'tnum'" }}>{inv.amount}</div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md w-fit" style={{ color: inv.statusColor, background: inv.statusBg }}>{inv.status}</span>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="flex flex-col gap-2">
        {alerts.map((a, i) => (
          <div key={i} className="flex items-center gap-3 rounded-[12px] p-3 bg-[#F9FAFB]" style={{ border: `1px solid ${BORDER}` }}>
            <span className="text-[12px] shrink-0">{a.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-[#111827]">{a.title}</div>
              <div className="text-[9px] font-medium text-[#9CA3AF]">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Z-LAYOUT FEATURE SECTIONS
   ───────────────────────────────────────────────────────── */

interface FeatureRowProps {
  reverse?: boolean;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  title: string;
  highlight: string;
  description: string;
  bullets: string[];
  bulletIcon: string;
  bulletColor: string;
  children: React.ReactNode;
  delay?: number;
}

function FeatureRow({ reverse, badge, badgeColor, badgeBg, title, highlight, description, bullets, bulletIcon, bulletColor, children, delay = 0 }: FeatureRowProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${reverse ? "lg:[direction:rtl]" : ""}`}>
      {/* Text side */}
      <motion.div
        initial={{ opacity: 0, x: reverse ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay }}
        className="flex flex-col items-start lg:[direction:ltr]"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-lg mb-6" style={{ color: badgeColor, background: badgeBg }}>{badge}</span>
        <h3 className="text-[32px] md:text-[38px] font-bold text-[#111827] leading-[1.15] tracking-tight mb-4">
          {title}{" "}
          <span style={{ color: badgeColor }}>{highlight}</span>
        </h3>
        <p className="text-[16px] font-medium text-[#6B7280] leading-relaxed mb-8 max-w-md">
          {description}
        </p>
        <ul className="flex flex-col gap-3">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: badgeBg }}>
                <span className="text-[11px]">{bulletIcon}</span>
              </span>
              <span className="text-[14px] font-medium text-[#374151]">{b}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Mockup side */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay: delay + 0.15 }}
        className="lg:[direction:ltr]"
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN EXPORT
   ───────────────────────────────────────────────────────── */
export function FeaturesSection() {
  const t = useTranslations("Marketing.features");

  return (
    <section id="features" className="bg-[#F9FAFB]" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 max-w-2xl mx-auto"
        >
          <h2 className="text-[36px] md:text-[44px] font-bold text-[#111827] tracking-tight leading-tight mb-4">
            {t("tab0")}{" "}
            <span className="text-[#6366F1]">{t("tab1")}</span>
          </h2>
          <p className="text-[16px] font-medium text-[#6B7280] leading-relaxed">
            {t("f0desc")}
          </p>
        </motion.div>

        {/* Feature rows – Z Layout */}
        <div className="flex flex-col gap-24 lg:gap-32">
          {/* ── FEATURE 1: Cash Flow (Text Left / Mockup Right) ── */}
          <FeatureRow
            badge="Cash Flow"
            badgeColor="#6366F1"
            badgeBg="rgba(99,102,241,0.08)"
            title={t("f0title")}
            highlight=""
            description="Visualize income vs expenses with gradient area charts, AI-powered forecasts shown as dashed projections, and monthly net income breakdowns. Know exactly where your money flows — past, present, and future."
            bullets={[
              t("f0b0"),
              t("f0b1"),
              t("f0b2"),
              "Future projections with dashed forecast lines",
            ]}
            bulletIcon="📈"
            bulletColor="#6366F1"
            delay={0}
          >
            <CashFlowMockup />
          </FeatureRow>

          {/* ── FEATURE 2: Tax (Text Right / Mockup Left) ── */}
          <FeatureRow
            reverse
            badge="Tax & Compliance"
            badgeColor="#10B981"
            badgeBg="rgba(16,185,129,0.08)"
            title={t("f1title")}
            highlight=""
            description="Never miss a deadline again. Your compliance score updates in real-time, with provisioned tax amounts, VAT tracking, and automated deadline alerts. Financial peace of mind, on autopilot."
            bullets={[
              t("f1b0"),
              t("f1b1"),
              t("f1b2"),
              "Compliance score ring with real-time status",
            ]}
            bulletIcon="🛡️"
            bulletColor="#10B981"
            delay={0}
          >
            <TaxComplianceMockup />
          </FeatureRow>

          {/* ── FEATURE 3: Invoices & Alerts (Text Left / Mockup Right) ── */}
          <FeatureRow
            badge="Invoices & Alerts"
            badgeColor="#F59E0B"
            badgeBg="rgba(245,158,11,0.08)"
            title={t("f2title")}
            highlight=""
            description="Track every invoice from creation to payment. Get instant alerts for overdue invoices, approaching deadlines, and idle subscriptions. Your financial command center catches what you'd miss."
            bullets={[
              t("f2b0"),
              t("f2b1"),
              t("f2b2"),
              "Smart alert system with priority levels",
            ]}
            bulletIcon="⚡"
            bulletColor="#F59E0B"
            delay={0}
          >
            <InvoiceAlertMockup />
          </FeatureRow>
        </div>
      </div>
    </section>
  );
}
