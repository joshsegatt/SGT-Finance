import { getTranslations } from "next-intl/server";

const STATS_KEYS = [
  { value: "300+", key: "banks" },
  { value: "100%", key: "openBanking" },
  { value: "GDPR", key: "gdpr" },
  { value: "3", key: "currencies" },
] as const;

const PARTNERS = [
  {
    name: "TrueLayer",
    desc: "Open Banking",
    color: "#4979EF",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <rect width="24" height="24" rx="6" fill="#4979EF" />
        <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Salt Edge",
    desc: "Banking API",
    color: "#10B981",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <rect width="24" height="24" rx="6" fill="#10B981" />
        <path d="M12 4C8 4 5 7 5 12s3 8 7 8 7-3 7-8" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="15" cy="9" r="2" fill="white" />
      </svg>
    ),
  },
  {
    name: "Stripe",
    desc: "Pagamentos",
    color: "#635BFF",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <rect width="24" height="24" rx="6" fill="#635BFF" />
        <path d="M10.5 9.5c0-1.1.9-1.5 2.5-1.5 2.2 0 3.5.7 3.5.7V6.5S15.3 6 12.5 6C9.5 6 8 7.5 8 9.5c0 3.7 5.5 3 5.5 5.5 0 1.1-.9 1.5-2.5 1.5-2.3 0-4-.8-4-.8v2.2s1.7.6 4 .6c3 0 4.5-1.5 4.5-3.5 0-3.8-5.5-3-5.5-5.5z" fill="white" />
      </svg>
    ),
  },
  {
    name: "Neon",
    desc: "Database",
    color: "#00E5A0",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <rect width="24" height="24" rx="6" fill="#0A0A0A" />
        <path d="M6 6h8l4 4v8H10L6 14V6z" fill="#00E5A0" opacity="0.9" />
        <path d="M14 6l4 4" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Prisma",
    desc: "ORM",
    color: "#5A67D8",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <rect width="24" height="24" rx="6" fill="#1A1A2E" />
        <path d="M12 4L19 18H5L12 4z" fill="none" stroke="#5A67D8" strokeWidth="1.5" />
        <path d="M12 4L19 18" stroke="#A5B4FC" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export async function SocialProofSection() {
  const t = await getTranslations("Marketing.socialProof");
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#080E1C", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 80, paddingBottom: 80 }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Label */}
        <p
          className="text-center font-semibold uppercase tracking-widest mb-10"
          style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}
        >
        {t("poweredBy")}
        </p>

        {/* Partner logos */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {p.icon}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.80)" }}>{p.name}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.32)" }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {STATS_KEYS.map((stat, i) => (
            <div
              key={stat.key}
              className="flex flex-col items-center py-8 px-6 text-center"
              style={{
                background: i % 2 === 0 ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.015)",
              }}
            >
              <div
                className="font-black mb-2"
                style={{
                  fontSize: 36,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.55))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.40)", fontWeight: 500 }}>{t(stat.key as "banks" | "openBanking" | "gdpr" | "currencies")}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
