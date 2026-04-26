"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const FAQ_INDICES = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export function FaqSection() {
  const t = useTranslations("Marketing.faq");
  const [open, setOpen] = useState<number | null>(null);

  const FAQS = FAQ_INDICES.map((n) => ({
    q: t(`q${n}` as "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8"),
    a: t(`a${n}` as "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7" | "a8"),
  }));

  return (
    <section
      style={{
        background: "#050A14",
        paddingTop: 100,
        paddingBottom: 100,
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-block px-3 py-1 rounded-full mb-5 text-[11px] font-semibold uppercase tracking-widest"
            style={{
              background: "rgba(6,182,212,0.10)",
              border: "1px solid rgba(6,182,212,0.20)",
              color: "#22D3EE",
            }}
          >
            {t("badge")}
          </div>
          <h2
            className="font-black tracking-tight text-white"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.02em" }}
          >
            {t("headline")}
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="faq-item rounded-xl overflow-hidden"
              style={{
                border: open === i
                  ? "1px solid rgba(73,121,239,0.28)"
                  : "1px solid rgba(255,255,255,0.07)",
                background: open === i
                  ? "rgba(73,121,239,0.04)"
                  : "rgba(255,255,255,0.025)",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                aria-expanded={open === i}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: open === i ? "white" : "rgba(255,255,255,0.72)",
                    lineHeight: 1.4,
                  }}
                >
                  {faq.q}
                </span>
                <span
                  className="faq-icon flex-shrink-0 ml-5"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M9 4v10M4 9h10"
                      stroke={open === i ? "#7BA4FF" : "rgba(255,255,255,0.32)"}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>

              {open === i && (
                <div className="px-6 pb-5 faq-answer">
                  <p
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.50)",
                      lineHeight: 1.78,
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
