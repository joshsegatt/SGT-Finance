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
      className="bg-[#F7F8FA]"
      style={{
        paddingTop: 100,
        paddingBottom: 100,
      }}
    >
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-block px-4 py-1.5 rounded-full mb-5 text-[11px] font-black uppercase tracking-widest bg-white border border-[#E6E9EF] shadow-sm text-[#00CFF4]"
          >
            {t("badge")}
          </div>
          <h2
            className="font-heading font-black tracking-tight text-[#323338]"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.02em" }}
          >
            {t("headline")}
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${open === i ? "bg-white shadow-figma-card border-transparent" : "bg-white border border-[#E6E9EF] shadow-sm hover:border-[#D1D9EE]"}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                aria-expanded={open === i}
              >
                <span
                  className={`text-[15px] font-bold ${open === i ? "text-[#6161FF]" : "text-[#323338]"}`}
                  style={{ lineHeight: 1.4 }}
                >
                  {faq.q}
                </span>
                <span
                  className="flex-shrink-0 ml-5 transition-transform duration-300"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M9 4v10M4 9h10"
                      stroke={open === i ? "#6161FF" : "#A0A3AF"}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>

              {open === i && (
               <div className="px-6 pb-6">
                  <p
                    className="text-sm font-medium text-[#676879] leading-relaxed"
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
