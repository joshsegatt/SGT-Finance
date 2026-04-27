import { getTranslations } from "next-intl/server";

const AVATARS = [
  {
    initials: "SM",
    background: "#6161FF",
  },
  {
    initials: "CR",
    background: "#00D745",
  },
  {
    initials: "MD",
    background: "#FF5AC4",
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
      className="bg-white"
      style={{
        paddingTop: 100,
        paddingBottom: 100,
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-block px-4 py-1.5 rounded-full mb-5 text-[11px] font-black uppercase tracking-widest bg-[#F7F8FA] border border-[#E6E9EF] shadow-sm text-[#00D745]"
          >
            {t("badge")}
          </div>
          <h2
            className="font-heading font-black tracking-tight text-[#323338]"
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
          >
            {t("headline1")}{" "}
            <span className="text-[#00D745]">
              {t("headline2")}
            </span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-3xl p-8 bg-white border border-[#E6E9EF] shadow-figma-card relative overflow-hidden"
            >
              {/* Top color line */}
              <div
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ background: t_.background }}
              />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[0, 1, 2, 3, 4].map((s) => (
                  <svg key={s} width="13" height="13" viewBox="0 0 14 14" fill="#FFCC00">
                    <path d="M7 1.5l1.4 3.2 3.6.3-2.7 2.3.9 3.5L7 8.9l-3.2 1.9.9-3.5L2 4.9l3.6-.3z" />
                  </svg>
                ))}
              </div>

              {/* Quote mark */}
              <div
                className="absolute text-[#F7F8FA]"
                style={{
                  top: 24,
                  right: 24,
                  fontSize: 64,
                  lineHeight: 1,
                  fontFamily: "Georgia, serif",
                  fontWeight: 900,
                  pointerEvents: "none",
                }}
              >
                "
              </div>

              {/* Quote */}
              <p
                className="flex-1 mb-7 leading-relaxed font-medium text-[#323338]"
                style={{ fontSize: 15, lineHeight: 1.72 }}
              >
                &ldquo;{t_.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-full text-white font-black flex-shrink-0 shadow-sm"
                  style={{
                    width: 44,
                    height: 44,
                    background: t_.background,
                    fontSize: 14,
                  }}
                >
                  {t_.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#323338] text-sm">
                    {t_.name}
                  </div>
                  <div className="text-xs font-semibold text-[#676879] mt-0.5">
                    {t_.role}
                  </div>
                </div>
                <div
                  className="text-xs font-bold text-[#A0A3AF] text-right shrink-0"
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
