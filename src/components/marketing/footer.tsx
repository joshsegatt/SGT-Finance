import Link from "next/link";

const COLUMNS = [
  {
    title: "Produto",
    links: [
      { label: "Funcionalidades", href: "#features" },
      { label: "Preços", href: "/pricing" },
      { label: "Open Banking", href: "#features" },
      { label: "Facturação", href: "#features" },
      { label: "Analytics", href: "#features" },
      { label: "Impostos", href: "#features" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre Nós", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Carreiras", href: "/careers" },
      { label: "Parceiros", href: "/partners" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Documentação", href: "/docs" },
      { label: "Centro de Ajuda", href: "/help" },
      { label: "Estado do Sistema", href: "/status" },
      { label: "Contacto", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termos de Serviço", href: "/terms" },
      { label: "Privacidade & RGPD", href: "/privacy" },
      { label: "Cookies", href: "/privacy#cookies" },
      { label: "Segurança", href: "/security" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer
      style={{
        background: "#030710",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        paddingTop: 64,
        paddingBottom: 32,
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#4979EF" />
                <rect x="6" y="18" width="4" height="8" rx="1.5" fill="white" fillOpacity="0.5" />
                <rect x="12" y="13" width="4" height="13" rx="1.5" fill="white" fillOpacity="0.75" />
                <rect x="18" y="8" width="4" height="18" rx="1.5" fill="white" />
                <path d="M7 14L13 10L19 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="19" cy="6" r="1.5" fill="white" />
              </svg>
              <span style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.01em" }}>
                SGT Finance
              </span>
            </Link>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 220 }}>
              Controlo financeiro total para PMEs portuguesas e europeias.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {[
                {
                  label: "GitHub",
                  href: "https://github.com/joshsegatt/SGT-Finance",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  href: "#",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex items-center justify-center transition-all duration-150"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.40)",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div
                className="font-bold uppercase tracking-widest mb-4"
                style={{ fontSize: 10, color: "rgba(255,255,255,0.30)" }}
              >
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors duration-150"
                      style={{ fontSize: 13, color: "rgba(255,255,255,0.40)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} Segatt Labs · Todos os direitos reservados · Lisboa, Portugal
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "Termos", href: "/terms" },
              { label: "Privacidade", href: "/privacy" },
              { label: "Cookies", href: "/privacy#cookies" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors duration-150"
                style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
