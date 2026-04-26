import { getTranslations } from "next-intl/server";

const BANKS = [
  "Revolut", "N26", "ING", "Santander", "BBVA",
  "Monzo", "Starling", "Montepio", "Millennium", "BPI",
  "BNP Paribas", "Deutsche Bank",
] as const;

const STATS_KEYS = [
  { value: "300+", key: "banks" },
  { value: "100%", key: "openBanking" },
  { value: "GDPR", key: "gdpr" },
  { value: "3", key: "currencies" },
] as const;

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

        {/* Bank pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5">
          {BANKS.map((bank) => (
            <div
              key={bank}
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(73,121,239,0.60)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.62)", letterSpacing: "0.01em" }}>
                {bank}
              </span>
            </div>
          ))}
          <div
            className="flex items-center px-4 py-2 rounded-lg"
            style={{ background: "rgba(73,121,239,0.07)", border: "1px solid rgba(73,121,239,0.15)" }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "#7BA4FF" }}>+ 290 more</span>
          </div>
        </div>

        {/* Infrastructure note */}
        <p className="text-center mb-16" style={{ fontSize: 11, color: "rgba(255,255,255,0.22)" }}>
          Powered by{" "}
          <span style={{ color: "rgba(255,255,255,0.40)", fontWeight: 600 }}>TrueLayer</span>
          {" & "}
          <span style={{ color: "rgba(255,255,255,0.40)", fontWeight: 600 }}>Salt Edge</span>
          {" · Read-only PSD2 access · Your credentials are never shared"}
        </p>

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
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.40)", fontWeight: 500 }}>
                {t(stat.key as "banks" | "openBanking" | "gdpr" | "currencies")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
