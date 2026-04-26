import { getTranslations } from "next-intl/server";

const AVATARS = [
  {
    initials: "SM",
    gradient: "linear-gradient(135deg, #4979EF, #7C3AED)",
    cardBorder: "rgba(73,121,239,0.15)",
    cardGlow: "rgba(73,121,239,0.06)",
  },
  {
    initials: "CR",
    gradient: "linear-gradient(135deg, #059669, #22c55e)",
    cardBorder: "rgba(34,197,94,0.15)",
    cardGlow: "rgba(34,197,94,0.05)",
  },
  {
    initials: "MD",
    gradient: "linear-gradient(135deg, #7C3AED, #06B6D4)",
    cardBorder: "rgba(124,58,237,0.15)",
    cardGlow: "rgba(124,58,237,0.05)",
  },
] as const;

export async function TestimonialsSection() {
  const t = await getTranslations("Marketing.testimonials");

  const TESTIMONIALS = AVATARS.map((a, i) => ({
    ...a,
    name: t(`t${i + 1}name` as "t1name" | "t2name" | "t3name"),
    role: t(`t${i + 1}role` as "t1role" | "t2role" | "t3role"),
    country: t(`t${i + 1}country` as "t1country" | "t2country" | "t3country"),
    quote: t(`t${i + 1}quote` as "t1quote" | "t2quote" | "t3quote"),
  }));

  return (
    <section
      style={{
        background: "#080E1C",
        paddingTop: 100,
        paddingBottom: 100,
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-block px-3 py-1 rounded-full mb-5 text-[11px] font-semibold uppercase tracking-widest"
            style={{
              background: "rgba(34,197,94,0.10)",
              border: "1px solid rgba(34,197,94,0.20)",
              color: "#4ade80",
            }}
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
                background: "linear-gradient(135deg, #4979EF, #7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("headline2")}
            </span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl p-7"
              style={{
                background: `rgba(255,255,255,0.025)`,
                border: `1px solid ${t_.cardBorder}`,
                boxShadow: `0 0 60px ${t_.cardGlow}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top gradient line */}
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${t_.cardBorder.replace("0.15", "0.6")}, transparent)` }}
              />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[0, 1, 2, 3, 4].map((s) => (
                  <svg key={s} width="13" height="13" viewBox="0 0 14 14" fill="#F59E0B">
                    <path d="M7 1.5l1.4 3.2 3.6.3-2.7 2.3.9 3.5L7 8.9l-3.2 1.9.9-3.5L2 4.9l3.6-.3z" />
                  </svg>
                ))}
              </div>

              {/* Quote mark */}
              <div
                className="absolute"
                style={{
                  top: 24,
                  right: 24,
                  fontSize: 64,
                  lineHeight: 1,
                  color: "rgba(255,255,255,0.04)",
                  fontFamily: "Georgia, serif",
                  fontWeight: 900,
                  pointerEvents: "none",
                }}
              >
                "
              </div>

              {/* Quote */}
              <p
                className="flex-1 mb-7 leading-relaxed"
                style={{ fontSize: 15, color: "rgba(255,255,255,0.68)", lineHeight: 1.72 }}
              >
                &ldquo;{t_.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-full text-white font-black flex-shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    background: t_.gradient,
                    fontSize: 13,
                    letterSpacing: "-0.01em",
                    boxShadow: `0 0 16px ${t_.cardBorder}`,
                  }}
                >
                  {t_.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
                    {t_.name}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginTop: 1 }}>
                    {t_.role}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.25)",
                    textAlign: "right",
                    lineHeight: 1.4,
                    flexShrink: 0,
                  }}
                >
                  {t_.country}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
