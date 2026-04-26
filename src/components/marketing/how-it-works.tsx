import { getTranslations } from "next-intl/server";

const STEP_ICONS = [
  {
    number: "01",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="8" fill="rgba(73,121,239,0.15)" />
        <path d="M7 14C7 10.134 10.134 7 14 7s7 3.134 7 7-3.134 7-7 7" stroke="#4979EF" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 11v3l2 2" stroke="#4979EF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="14" r="1.5" fill="#4979EF" />
      </svg>
    ),
    title: "Conecta os teus bancos",
    description:
      "Em menos de 2 minutos, conecta todas as tuas contas bancárias via Open Banking. Suportamos 300+ bancos portugueses e europeus.",
    detail: "TrueLayer · Salt Edge · Sem passwords partilhadas",
  },
  {
    number: "02",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="8" fill="rgba(124,58,237,0.15)" />
        <path d="M6 20l5-7 4 4 3-5 4 8" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="22" cy="8" r="2" fill="#7C3AED" />
      </svg>
    ),
    title: "Rastreia as tuas finanças",
    description:
      "As transações são importadas e categorizadas automaticamente. Visualiza o teu cash flow, impostos e faturas em tempo real.",
    detail: "Dashboard · Analytics · Alertas automáticos",
  },
  {
    number: "03",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="8" fill="rgba(6,182,212,0.15)" />
        <path d="M14 6l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" stroke="#06B6D4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Faz crescer o teu negócio",
    description:
      "Com dados financeiros precisos e em tempo real, toma decisões informadas, reduz custos e identifica oportunidades de crescimento.",
    detail: "Relatórios · Previsões · Exportação para contabilista",
  },
];

export async function HowItWorksSection() {
  const t = await getTranslations("Marketing.howItWorks");
  return (
    <section
      id="how-it-works"
      style={{ background: "#080E1C", paddingTop: 100, paddingBottom: 100, borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div
            className="inline-block px-3 py-1 rounded-full mb-5 text-[11px] font-semibold uppercase tracking-widest"
            style={{ background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.20)", color: "#A78BFA" }}
          >
            {t("badge")}
          </div>
          <h2
            className="font-black tracking-tight text-white"
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
          >
            {t("headline1")}{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("headline2")}
            </span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto" style={{ fontSize: 16, color: "rgba(255,255,255,0.38)", lineHeight: 1.7 }}>
            {t("subhead")}
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            className="hidden md:block absolute top-[52px] left-0 right-0"
            style={{ height: 1, background: "linear-gradient(90deg, transparent 8%, rgba(73,121,239,0.25) 25%, rgba(124,58,237,0.25) 75%, transparent 92%)" }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {STEP_ICONS.map((step, i) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number bubble */}
                <div
                  className="relative z-10 flex items-center justify-center font-black mb-6"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#080E1C",
                    border: "1px solid rgba(255,255,255,0.10)",
                    fontSize: 18,
                    color: "rgba(255,255,255,0.15)",
                    letterSpacing: "-0.02em",
                    boxShadow: i === 0
                      ? "0 0 30px rgba(73,121,239,0.25)"
                      : i === 1
                      ? "0 0 30px rgba(124,58,237,0.20)"
                      : "0 0 30px rgba(6,182,212,0.20)",
                  }}
                >
                  {/* Icon inside */}
                  {step.icon}
                </div>

                <div className="text-[11px] font-bold tracking-widest mb-3" style={{ color: i === 0 ? "#4979EF" : i === 1 ? "#7C3AED" : "#06B6D4", opacity: 0.7 }}>
                  {t("step")} {step.number}
                </div>

                <h3 className="font-bold text-white mb-3" style={{ fontSize: 18 }}>
                  {t(`s${i + 1}title` as "s1title" | "s2title" | "s3title")}
                </h3>

                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.40)", lineHeight: 1.7, marginBottom: 16 }}>
                  {t(`s${i + 1}desc` as "s1desc" | "s2desc" | "s3desc")}
                </p>

                <div
                  className="px-3 py-1.5 rounded-lg text-[11px] font-medium"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.38)",
                  }}
                >
                  {t(`s${i + 1}detail` as "s1detail" | "s2detail" | "s3detail")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
