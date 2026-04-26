import Link from "next/link";
import { ArrowRight } from "lucide-react";

function DashboardPreview() {
  const alerts = [
    { color: "#fbbf24", text: "IVA T1 · Prazo em 5 dias" },
    { color: "#60a5fa", text: "3 faturas aguardam pagamento" },
    { color: "#34d399", text: "Sync bancário concluído" },
    { color: "#f87171", text: "Fatura #INV-088 em atraso" },
  ];

  const transactions = [
    { name: "Fornecedor ABC Lda", cat: "Fornecedores · Millennium", amount: "−€1.240,00", neg: true, date: "hoje, 09:32" },
    { name: "Cliente XYZ SA", cat: "Receita · BPI Business", amount: "+€4.500,00", neg: false, date: "ontem, 17:14" },
    { name: "Stripe Subscription", cat: "Software · Revolut", amount: "−€89,00", neg: true, date: "há 2 dias" },
  ];

  const bars = [
    { m: "Nov", i: 62, e: 45 }, { m: "Dez", i: 78, e: 52 },
    { m: "Jan", i: 51, e: 39 }, { m: "Fev", i: 88, e: 57 },
    { m: "Mar", i: 72, e: 50 }, { m: "Abr", i: 100, e: 63 },
  ];

  const kpis = [
    { label: "SALDO TOTAL", value: "€124.500", sub: "+12.4% vs mês anterior", accent: "#4979EF" },
    { label: "RESERVA CAIXA", value: "€32.100", sub: "+8.2% vs mês anterior", accent: "#22c55e" },
    { label: "EXPOSIÇÃO IVA", value: "€6.834", sub: "T2 2026 · estimativa", accent: "#4979EF" },
    { label: "FATURAS ATRASO", value: "3", sub: "€12.400 em aberto", accent: "#f59e0b" },
  ];

  const navItems = [
    { label: "Dashboard", active: true },
    { label: "Analytics" }, { label: "Transações" },
    { label: "Faturas" }, { label: "Recorrentes" },
    { label: "Impostos" }, { label: "Clientes" },
    { label: "Contas" }, { label: "Relatórios" },
  ];

  return (
    <div className="flex overflow-hidden select-none" style={{ height: 480 }}>
      {/* Sidebar */}
      <div style={{ width: 168, background: "#060B16", borderRight: "1px solid rgba(255,255,255,0.05)", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        {/* Logo */}
        <div style={{ height: 48, display: "flex", alignItems: "center", padding: "0 16px", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
            <rect width="32" height="32" rx="8" fill="#4979EF" />
            <rect x="6" y="18" width="4" height="8" rx="1.5" fill="white" fillOpacity="0.5" />
            <rect x="12" y="13" width="4" height="13" rx="1.5" fill="white" fillOpacity="0.75" />
            <rect x="18" y="8" width="4" height="18" rx="1.5" fill="white" />
            <path d="M7 14L13 10L19 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="19" cy="6" r="1.5" fill="white" />
          </svg>
          <div>
            <div style={{ color: "rgba(255,255,255,0.80)", fontWeight: 700, fontSize: 9, letterSpacing: "-0.01em" }}>SGT Finance</div>
            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 7, textTransform: "uppercase", letterSpacing: "0.08em" }}>Command Center</div>
          </div>
        </div>
        {/* Nav */}
        <div style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => (
            <div
              key={item.label}
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                fontSize: 9,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 7,
                color: item.active ? "#7BA4FF" : "rgba(255,255,255,0.28)",
                background: item.active ? "rgba(73,121,239,0.18)" : "transparent",
                borderLeft: item.active ? "2px solid #4979EF" : "2px solid transparent",
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: item.active ? "#4979EF" : "rgba(255,255,255,0.15)", flexShrink: 0 }} />
              {item.label}
            </div>
          ))}
        </div>
        {/* Upgrade */}
        <div style={{ padding: 10, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ borderRadius: 8, padding: "8px 10px", background: "linear-gradient(135deg, rgba(73,121,239,0.25), rgba(124,58,237,0.18))", border: "1px solid rgba(73,121,239,0.20)" }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.80)" }}>Upgrade Pro</div>
            <div style={{ fontSize: 7, color: "rgba(255,255,255,0.35)", marginTop: 2, lineHeight: 1.3 }}>Analytics + API ilimitados</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, background: "#080E1C", display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ height: 44, borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", padding: "0 16px", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.40)", fontWeight: 500 }}>
            Dashboard <span style={{ color: "rgba(255,255,255,0.18)" }}>›</span>{" "}
            <span style={{ color: "rgba(255,255,255,0.60)" }}>Visão Geral</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ height: 24, width: 100, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 6, display: "flex", alignItems: "center", padding: "0 8px", gap: 5 }}>
              <svg width="8" height="8" viewBox="0 0 16 16" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"><circle cx="7" cy="7" r="4" /><path d="M11 11l2 2" /></svg>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.22)" }}>Pesquisar...</span>
            </div>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #4979EF, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "white", boxShadow: "0 0 10px rgba(73,121,239,0.4)" }}>JD</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "14px 14px 0", overflow: "hidden", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 9 }}>
            {kpis.map((kpi) => (
              <div key={kpi.label} style={{ background: "#0E1422", borderRadius: 10, padding: "9px 10px", border: "1px solid rgba(255,255,255,0.055)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${kpi.accent}70, transparent)` }} />
                <div style={{ fontSize: 6.5, fontWeight: 700, color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>{kpi.label}</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: "white", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 3 }}>{kpi.value}</div>
                <div style={{ fontSize: 7, color: kpi.accent + "CC" }}>{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Chart + Alerts */}
          <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 9, height: 162 }}>
            {/* Bar chart */}
            <div style={{ background: "#0E1422", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.055)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Cash Flow · Últimos 6 Meses</span>
                <div style={{ display: "flex", gap: 10 }}>
                  {[{ c: "#4979EF", l: "Receita" }, { c: "rgba(239,68,68,0.5)", l: "Despesa" }].map(x => (
                    <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: x.c }} />
                      <span style={{ fontSize: 7, color: "rgba(255,255,255,0.28)" }}>{x.l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 6 }}>
                {bars.map((b) => (
                  <div key={b.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: 80 }}>
                      <div style={{ flex: 1, borderRadius: "2px 2px 0 0", background: "rgba(73,121,239,0.65)", height: `${b.i}%`, minHeight: 4 }} />
                      <div style={{ flex: 1, borderRadius: "2px 2px 0 0", background: "rgba(239,68,68,0.30)", height: `${b.e}%`, minHeight: 4 }} />
                    </div>
                    <div style={{ fontSize: 6.5, color: "rgba(255,255,255,0.22)" }}>{b.m}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Alerts */}
            <div style={{ background: "#0E1422", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.055)" }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Alertas</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {alerts.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 8px", borderRadius: 6, background: "rgba(255,255,255,0.028)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                    <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.48)", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div style={{ background: "#0E1422", borderRadius: 10, border: "1px solid rgba(255,255,255,0.055)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.42)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Transações Recentes</span>
              <span style={{ fontSize: 7, color: "#4979EF", fontWeight: 600 }}>Ver todas →</span>
            </div>
            {transactions.map((tx, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", borderBottom: i < transactions.length - 1 ? "1px solid rgba(255,255,255,0.035)" : "none" }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, background: tx.neg ? "rgba(239,68,68,0.10)" : "rgba(52,211,153,0.10)", color: tx.neg ? "rgba(248,113,113,0.80)" : "rgba(52,211,153,0.80)" }}>
                  {tx.neg ? "↓" : "↑"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 8.5, fontWeight: 600, color: "rgba(255,255,255,0.68)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.name}</div>
                  <div style={{ fontSize: 7, color: "rgba(255,255,255,0.28)", marginTop: 1 }}>{tx.cat}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 8.5, fontWeight: 700, color: tx.neg ? "rgba(248,113,113,0.80)" : "rgba(52,211,153,0.80)" }}>{tx.amount}</div>
                  <div style={{ fontSize: 7, color: "rgba(255,255,255,0.22)", marginTop: 1 }}>{tx.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden flex flex-col"
      style={{ background: "#050A14", minHeight: "100vh" }}
    >
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full blur-[140px]" style={{ top: "-20%", left: "10%", width: 800, height: 800, background: "#4979EF", opacity: 0.08 }} />
        <div className="absolute rounded-full blur-[120px]" style={{ top: "30%", right: "0%", width: 600, height: 600, background: "#7C3AED", opacity: 0.06 }} />
        <div className="absolute rounded-full blur-[130px]" style={{ bottom: "5%", left: "35%", width: 700, height: 500, background: "#06B6D4", opacity: 0.05 }} />
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,10,20,0.5) 0%, transparent 30%, rgba(5,10,20,0.8) 100%)" }} />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-[110px] pb-0">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-[11px] font-semibold tracking-wide"
          style={{
            background: "rgba(73,121,239,0.10)",
            border: "1px solid rgba(73,121,239,0.25)",
            color: "#7BA4FF",
          }}
        >
          <span className="relative flex" style={{ width: 7, height: 7 }}>
            <span
              className="animate-ping absolute inline-flex rounded-full"
              style={{ width: "100%", height: "100%", background: "#4979EF", opacity: 0.75 }}
            />
            <span className="relative inline-flex rounded-full" style={{ width: 7, height: 7, background: "#4979EF" }} />
          </span>
          Open Banking · GDPR · Multi-empresa · Multimoeda
        </div>

        {/* Headline */}
        <h1
          className="font-black tracking-tight text-white leading-[1.03] mb-6"
          style={{ fontSize: "clamp(38px, 6.5vw, 72px)", maxWidth: 900 }}
        >
          Controlo financeiro
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #4979EF 0%, #7C3AED 50%, #06B6D4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            total e inteligente
          </span>
          <br />
          para PMEs modernas.
        </h1>

        {/* Subhead */}
        <p
          className="font-light leading-relaxed mb-10"
          style={{ fontSize: "clamp(16px, 1.8vw, 19px)", color: "rgba(255,255,255,0.45)", maxWidth: 580 }}
        >
          Sincroniza bancos automaticamente, emite faturas profissionais,
          controla impostos e visualiza o teu cash flow — tudo numa só plataforma.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
          <Link
            href="/register"
            className="group flex items-center gap-2.5 font-bold text-white transition-all duration-200"
            style={{
              padding: "14px 32px",
              borderRadius: 14,
              fontSize: 16,
              background: "linear-gradient(135deg, #4979EF, #3B6CE0)",
              boxShadow: "0 0 32px rgba(73,121,239,0.45), 0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            Começar Grátis
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link
            href="/pricing"
            className="flex items-center gap-2 font-semibold transition-all duration-200"
            style={{
              padding: "14px 32px",
              borderRadius: 14,
              fontSize: 16,
              color: "rgba(255,255,255,0.65)",
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            Ver Planos & Preços
          </Link>
        </div>

        {/* Trust line */}
        <p className="text-[11px] tracking-wide mb-14" style={{ color: "rgba(255,255,255,0.22)" }}>
          Sem cartão de crédito · Plano gratuito para sempre · Cancela a qualquer momento
        </p>

        {/* Dashboard mockup */}
        <div className="relative w-full" style={{ maxWidth: 960, margin: "0 auto" }}>
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: -60,
              width: "70%",
              height: 100,
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(73,121,239,0.22) 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 50px 150px rgba(0,0,0,0.85), 0 0 0 1px rgba(73,121,239,0.07), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Browser chrome */}
            <div
              className="flex items-center gap-1.5 px-4"
              style={{ height: 36, background: "#060C1A", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
              <div
                className="flex items-center px-2.5"
                style={{ flex: 1, margin: "0 16px", height: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 5 }}
              >
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", fontFamily: "monospace" }}>
                  sgt-finance.vercel.app/dashboard
                </span>
              </div>
            </div>
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
