"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const FEATURE_EMOJIS = ["\uD83C\uDFE6", "\uD83D\uDCC4", "\uD83D\uDCCA", "\uD83D\uDCBC"] as const;

const FEATURE_MOCKUPS = [
  {
    tab: "Open Banking",
    emoji: "🏦",
    title: "Conecta todos os teus bancos automaticamente",
    description:
      "Sincronização em tempo real via TrueLayer e Salt Edge. Importa transações, saldos e movimentos de centenas de bancos europeus sem esforço manual.",
    bullets: [
      "Suporte a 300+ bancos na Europa",
      "Sincronização automática de transações",
      "Categorização inteligente por IA",
      "Alertas de saldo e movimentos suspeitos",
    ],
    mockup: (
      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
          Contas Bancárias Conectadas
        </div>
        {[
          { bank: "Millennium BCP", type: "Conta Corrente", balance: "€24.850,00", sync: "há 2 min", color: "#E63946" },
          { bank: "BPI Business", type: "Conta Empresarial", balance: "€87.200,00", sync: "há 5 min", color: "#457B9D" },
          { bank: "Santander", type: "Conta Poupança", balance: "€12.450,00", sync: "há 8 min", color: "#E63946" },
          { bank: "Revolut Business", type: "Conta Digital", balance: "€5.800,00 · £2.100", sync: "há 1 min", color: "#6200EA" },
        ].map((acc) => (
          <div
            key={acc.bank}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 8, background: acc.color + "22", border: `1px solid ${acc.color}40`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🏦</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.80)" }}>{acc.bank}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.32)", marginTop: 1 }}>{acc.type} · Sync {acc.sync}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{acc.balance}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", marginTop: 2 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ fontSize: 9, color: "#22c55e" }}>Activo</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    tab: "Facturação",
    emoji: "📄",
    title: "Faturas profissionais em segundos",
    description:
      "Cria, personaliza e envia faturas com IVA automático, multimoeda e tracking de pagamentos. Integrado com os teus dados fiscais.",
    bullets: [
      "IVA calculado automaticamente",
      "Suporte a multimoeda (EUR, USD, GBP)",
      "Envio por email integrado",
      "Tracking de pagamentos em tempo real",
    ],
    mockup: (
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Fatura #INV-2026-089</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Emitida em 26 Abr 2026</div>
            </div>
            <div style={{ padding: "4px 10px", borderRadius: 20, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.30)", fontSize: 10, fontWeight: 600, color: "#22c55e" }}>Paga</div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, marginBottom: 12 }}>
            {[
              { desc: "Consultoria financeira (20h)", qty: "20", unit: "€150", total: "€3.000,00" },
              { desc: "Relatório anual consolidado", qty: "1", unit: "€500", total: "€500,00" },
            ].map((line, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
                <span style={{ flex: 1 }}>{line.desc}</span>
                <span style={{ width: 40, textAlign: "center", color: "rgba(255,255,255,0.35)" }}>{line.qty}×</span>
                <span style={{ width: 70, textAlign: "right" }}>{line.unit}</span>
                <span style={{ width: 80, textAlign: "right", fontWeight: 600, color: "white" }}>{line.total}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { l: "Subtotal", v: "€3.500,00", muted: true },
              { l: "IVA 23%", v: "€805,00", muted: true },
              { l: "Total", v: "€4.305,00", muted: false },
            ].map((row) => (
              <div key={row.l} style={{ display: "flex", justifyContent: "space-between", fontSize: row.muted ? 11 : 14, fontWeight: row.muted ? 400 : 700, color: row.muted ? "rgba(255,255,255,0.40)" : "white" }}>
                <span>{row.l}</span>
                <span>{row.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    tab: "Analytics",
    emoji: "📊",
    title: "Visibilidade total do teu cash flow",
    description:
      "Dashboards interativos, previsões financeiras e comparações mensais para tomar decisões informadas sobre o teu negócio.",
    bullets: [
      "Cash flow em tempo real",
      "Previsões baseadas em histórico",
      "Comparação mensal e anual",
      "Exportação PDF e Excel",
    ],
    mockup: (
      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { l: "Receita Total", v: "€184.200", change: "+23%", up: true },
            { l: "Despesas", v: "€112.500", change: "-5%", up: false },
            { l: "Margem Bruta", v: "38.9%", change: "+4.2pp", up: true },
            { l: "Cash Flow", v: "€71.700", change: "+31%", up: true },
          ].map((m) => (
            <div key={m.l} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>{m.l}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>{m.v}</div>
              <div style={{ fontSize: 10, color: m.up ? "#22c55e" : "#f87171", marginTop: 3, fontWeight: 600 }}>{m.change} vs ano anterior</div>
            </div>
          ))}
        </div>
        {/* Mini bar chart */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.40)", marginBottom: 10 }}>Receita por Trimestre</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 60 }}>
            {[{ l: "T1", v: 65 }, { l: "T2", v: 80 }, { l: "T3", v: 72 }, { l: "T4", v: 100 }].map((b) => (
              <div key={b.l} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", borderRadius: "3px 3px 0 0", background: "rgba(73,121,239,0.65)", height: `${b.v}%` }} />
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.30)" }}>{b.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    tab: "Impostos",
    emoji: "💼",
    title: "Gestão fiscal sem surpresas",
    description:
      "Calcula automaticamente a exposição a IVA, IRC e IRS com base nas transações importadas. Nunca mais sejas apanhado desprevenido.",
    bullets: [
      "Cálculo automático de IVA",
      "Acompanhamento de IRC e IRS",
      "Alertas de datas fiscais críticas",
      "Relatórios prontos para o contabilista",
    ],
    mockup: (
      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
          Exposição Fiscal — T2 2026
        </div>
        {[
          { tax: "IVA a Liquidar", amount: "€6.834", due: "15 Mai 2026", status: "Urgente", statusColor: "#f59e0b", pct: 72 },
          { tax: "IRC Estimado", amount: "€12.400", due: "31 Jul 2026", status: "A tempo", statusColor: "#22c55e", pct: 35 },
          { tax: "IRS Retenção", amount: "€2.150", due: "20 Mai 2026", status: "A tempo", statusColor: "#22c55e", pct: 20 },
        ].map((item) => (
          <div key={item.tax} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.80)" }}>{item.tax}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.30)", marginTop: 2 }}>Prazo: {item.due}</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "white" }}>{item.amount}</div>
                <div style={{ fontSize: 9, color: item.statusColor, textAlign: "right", marginTop: 2 }}>{item.status}</div>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 4, overflow: "hidden" }}>
              <div style={{ width: `${item.pct}%`, height: "100%", background: `linear-gradient(90deg, ${item.statusColor}80, ${item.statusColor})`, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

export function FeaturesSection() {
  const t = useTranslations("Marketing.features");
  const [active, setActive] = useState(0);

  const FEATURES = FEATURE_EMOJIS.map((emoji, i) => ({
    emoji,
    tab: t(`tab${i}` as "tab0" | "tab1" | "tab2" | "tab3"),
    title: t(`f${i}title` as "f0title" | "f1title" | "f2title" | "f3title"),
    description: t(`f${i}desc` as "f0desc" | "f1desc" | "f2desc" | "f3desc"),
    bullets: [
      t(`f${i}b0` as "f0b0" | "f1b0" | "f2b0" | "f3b0"),
      t(`f${i}b1` as "f0b1" | "f1b1" | "f2b1" | "f3b1"),
      t(`f${i}b2` as "f0b2" | "f1b2" | "f2b2" | "f3b2"),
      t(`f${i}b3` as "f0b3" | "f1b3" | "f2b3" | "f3b3"),
    ],
    mockup: FEATURE_MOCKUPS[i].mockup,
  }));

  const feature = FEATURES[active];

  return (
    <section
      id="features"
      style={{ background: "#050A14", paddingTop: 100, paddingBottom: 100, borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className="inline-block px-3 py-1 rounded-full mb-5 text-[11px] font-semibold uppercase tracking-widest"
            style={{ background: "rgba(73,121,239,0.10)", border: "1px solid rgba(73,121,239,0.20)", color: "#7BA4FF" }}
          >
            {t("badge")}
          </div>
          <h2
            className="font-black tracking-tight text-white leading-tight"
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
          <p className="mt-4 max-w-xl mx-auto" style={{ fontSize: 16, color: "rgba(255,255,255,0.40)", lineHeight: 1.7 }}>
            {t("subhead")}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {FEATURES.map((f, i) => (
            <button
              key={f.tab}
              onClick={() => setActive(i)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: active === i ? "rgba(73,121,239,0.18)" : "rgba(255,255,255,0.04)",
                border: active === i ? "1px solid rgba(73,121,239,0.40)" : "1px solid rgba(255,255,255,0.07)",
                color: active === i ? "#7BA4FF" : "rgba(255,255,255,0.45)",
                boxShadow: active === i ? "0 0 20px rgba(73,121,239,0.15)" : "none",
              }}
            >
              <span>{f.emoji}</span>
              {f.tab}
            </button>
          ))}
        </div>

        {/* Feature content */}
        <div
          key={active}
          className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden marketing-fade-up"
          style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#0D1526" }}
        >
          {/* Left: text */}
          <div className="p-10 flex flex-col justify-center" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-3xl mb-4">{feature.emoji}</div>
            <h3 className="font-bold text-white mb-4" style={{ fontSize: 24, lineHeight: 1.25 }}>
              {feature.title}
            </h3>
            <p className="mb-7" style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
              {feature.description}
            </p>
            <ul className="space-y-3">
              {feature.bullets.map((b) => (
                <li key={b} className="flex items-center gap-3" style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>
                  <span
                    className="flex items-center justify-center shrink-0"
                    style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(73,121,239,0.20)", border: "1px solid rgba(73,121,239,0.35)" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="#7BA4FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: mockup */}
          <div style={{ background: "#080E1C" }}>
            {feature.mockup}
          </div>
        </div>
      </div>
    </section>
  );
}
