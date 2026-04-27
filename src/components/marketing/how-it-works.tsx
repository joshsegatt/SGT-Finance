import { getTranslations } from "next-intl/server";

const STEP_ICONS = [
  {
    number: "01",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="8" fill="rgba(97,97,255,0.15)" />
        <path d="M7 14C7 10.134 10.134 7 14 7s7 3.134 7 7-3.134 7-7 7" stroke="#6161FF" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 11v3l2 2" stroke="#6161FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="14" r="1.5" fill="#6161FF" />
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
        <rect width="28" height="28" rx="8" fill="rgba(255,90,196,0.15)" />
        <path d="M6 20l5-7 4 4 3-5 4 8" stroke="#FF5AC4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="22" cy="8" r="2" fill="#FF5AC4" />
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
        <rect width="28" height="28" rx="8" fill="rgba(0,215,69,0.15)" />
        <path d="M14 6l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" stroke="#00D745" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
      className="bg-[#F7F8FA]"
      style={{ paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div
            className="inline-block px-4 py-1.5 rounded-full mb-5 text-[11px] font-black uppercase tracking-widest bg-white border border-[#E6E9EF] shadow-sm text-[#FF5AC4]"
          >
            {t("badge")}
          </div>
          <h2
            className="font-heading font-black tracking-tight text-[#323338]"
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
          >
            {t("headline1")}{" "}
            <span className="text-[#FF5AC4]">
              {t("headline2")}
            </span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto font-medium text-[#676879]" style={{ fontSize: 16, lineHeight: 1.7 }}>
            {t("subhead")}
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            className="hidden md:block absolute top-[52px] left-0 right-0"
            style={{ height: 2, background: "linear-gradient(90deg, transparent 8%, rgba(97,97,255,0.3) 25%, rgba(255,90,196,0.3) 75%, transparent 92%)" }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {STEP_ICONS.map((step, i) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number bubble */}
                <div
                  className="relative z-10 flex items-center justify-center font-black mb-6 bg-white border border-[#E6E9EF]"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    fontSize: 18,
                    color: "#323338",
                    boxShadow: i === 0
                      ? "0 10px 20px rgba(97,97,255,0.15)"
                      : i === 1
                      ? "0 10px 20px rgba(255,90,196,0.15)"
                      : "0 10px 20px rgba(0,215,69,0.15)",
                  }}
                >
                  {/* Icon inside */}
                  {step.icon}
                </div>

                <div className="text-[11px] font-black tracking-widest mb-3" style={{ color: i === 0 ? "#6161FF" : i === 1 ? "#FF5AC4" : "#00D745" }}>
                  {t("step")} {step.number}
                </div>

                <h3 className="font-heading font-black text-[#323338] mb-3" style={{ fontSize: 18 }}>
                  {t(`s${i + 1}title` as "s1title" | "s2title" | "s3title")}
                </h3>

                <p className="font-medium text-[#676879]" style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                  {t(`s${i + 1}desc` as "s1desc" | "s2desc" | "s3desc")}
                </p>

                <div
                  className="px-4 py-2 rounded-lg text-[11px] font-bold bg-white border border-[#E6E9EF] text-[#676879] shadow-sm"
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
