"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const BANKS = [
  "Revolut", "N26", "ING", "Santander", "BBVA",
  "Monzo", "Starling", "Montepio", "Millennium", "BPI",
  "BNP Paribas", "Deutsche Bank", "Caixa Geral", "Crédito Agrícola", "ActivoBank", "Novobanco"
] as const;

const STATS_KEYS = [
  { value: "300+", key: "banks" },
  { value: "100%", key: "openBanking" },
  { value: "GDPR", key: "gdpr" },
  { value: "3", key: "currencies" },
] as const;

export function SocialProofSection() {
  const t = useTranslations("Marketing.socialProof");

  // Duplicate the array to create a seamless loop
  const duplicatedBanks = [...BANKS, ...BANKS];

  return (
    <section
      className="relative overflow-hidden flex flex-col items-center justify-center font-sans bg-[#F7F8FA]"
      style={{ paddingTop: 80, paddingBottom: 100 }}
    >
      <div className="w-full max-w-7xl mx-auto px-6">
        {/* Label */}
        <p
          className="text-center font-bold uppercase tracking-[0.2em] mb-12 text-[#676879] text-xs"
        >
          {t("poweredBy")}
        </p>

        {/* Marquee Container */}
        <div 
          className="relative w-full overflow-hidden flex" 
          style={{ 
            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <motion.div
            className="flex gap-4 min-w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 35,
            }}
          >
            {duplicatedBanks.map((bank, index) => (
              <div
                key={`${bank}-${index}`}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl transition-colors duration-300 bg-white border border-[#E6E9EF] shadow-sm hover:shadow-figma-card"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ background: "#00D745" }}
                />
                <span className="text-sm font-bold text-[#323338] tracking-wide">
                  {bank}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Infrastructure note */}
        <p className="text-center mt-12 mb-20 text-xs font-medium text-[#676879]">
          Powered by{" "}
          <span className="text-[#323338] font-bold">TrueLayer</span>
          {" & "}
          <span className="text-[#323338] font-bold">Salt Edge</span>
          {" · Read-only PSD2 access · Your credentials are never shared"}
        </p>

        {/* Stats */}
        <div className="max-w-5xl mx-auto">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-3xl overflow-hidden bg-white border border-[#E6E9EF] shadow-figma-card"
          >
            {STATS_KEYS.map((stat, i) => (
              <div
                key={stat.key}
                className="flex flex-col items-center py-12 px-6 text-center transition-colors border-r border-b border-[#E6E9EF]"
              >
                <div
                  className="font-heading font-black mb-3 text-5xl text-[#6161FF]"
                  style={{ letterSpacing: "-0.04em" }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-[#676879] font-bold tracking-wide">
                  {t(stat.key as any)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
