import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function CtaSection() {
  const t = await getTranslations("Marketing.cta");
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#050A14", paddingTop: 100, paddingBottom: 100, borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: 800, height: 600, background: "radial-gradient(ellipse, rgba(73,121,239,0.12) 0%, transparent 70%)", filter: "blur(40px)" }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {[t("badge1"), t("badge2"), t("badge3"), t("badge4")].map((badge) => (
            <div
              key={badge}
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              {badge}
            </div>
          ))}
        </div>

        <h2
          className="font-black text-white tracking-tight mb-6"
          style={{ fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.05 }}
        >
          {t("headline1")}
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #4979EF 0%, #7C3AED 50%, #06B6D4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("headline2")}
          </span>
        </h2>

        <p className="mb-10" style={{ fontSize: 18, color: "rgba(255,255,255,0.40)", lineHeight: 1.7 }}>
          {t("body")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="group flex items-center gap-2.5 font-bold text-white transition-all duration-200"
            style={{
              padding: "16px 36px",
              borderRadius: 14,
              fontSize: 16,
              background: "linear-gradient(135deg, #4979EF, #3B6CE0)",
              boxShadow: "0 0 40px rgba(73,121,239,0.45), 0 4px 24px rgba(0,0,0,0.4)",
            }}
          >
            {t("button1")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link
            href="/pricing"
            className="flex items-center gap-2 font-semibold transition-all duration-200"
            style={{
              padding: "16px 36px",
              borderRadius: 14,
              fontSize: 16,
              color: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            {t("button2")}
          </Link>
        </div>

        <p className="mt-6 text-sm" style={{ color: "rgba(255,255,255,0.22)" }}>
          {t("trust")}
        </p>
      </div>
    </section>
  );
}
