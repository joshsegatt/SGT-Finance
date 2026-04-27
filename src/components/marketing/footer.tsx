import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function MarketingFooter() {
  const t = await getTranslations("Marketing.footer");

  const productLinks = [
    { label: t("lFeatures"), href: "#features" },
    { label: t("lPricing"), href: "/pricing" },
  ];

  const resourceLinks = [
    { label: t("lDocs"), href: "/docs" },
    { label: t("lHelp"), href: "/help" },
  ];

  const companyLinks = [
    { label: t("lContact"), href: "/contact" },
  ];

  const legalLinks = [
    { label: t("lTerms"), href: "/terms" },
    { label: t("lPrivacy"), href: "/privacy" },
    { label: t("lSecurity"), href: "/security" },
  ];

  return (
    <footer className="bg-background border-t border-border py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-12 mb-16">
          {/* ── Brand Section ── */}
          <div className="col-span-2 md:col-span-4 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 shrink-0 group w-fit">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" className="text-primary-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 12L12 16L20 12" stroke="currentColor" className="text-primary-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 16L12 20L20 16" stroke="currentColor" className="text-primary-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-background shadow-sm" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-foreground text-[18px] leading-none tracking-[-0.03em] uppercase">
                  SGT<span className="text-primary">.</span>
                </span>
                <span className="text-[9px] font-bold text-muted-foreground tracking-[0.2em] uppercase leading-none mt-1">
                  Finance
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          {/* ── Links Sections ── */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <h4 className="text-[13px] font-black uppercase tracking-widest text-foreground">Produto</h4>
            <nav className="flex flex-col gap-3">
              {productLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-[14px] font-medium text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <h4 className="text-[13px] font-black uppercase tracking-widest text-foreground">Recursos</h4>
            <nav className="flex flex-col gap-3">
              {resourceLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-[14px] font-medium text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <h4 className="text-[13px] font-black uppercase tracking-widest text-foreground">Empresa</h4>
            <nav className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-[14px] font-medium text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <h4 className="text-[13px] font-black uppercase tracking-widest text-foreground">Legal</h4>
            <nav className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-[14px] font-medium text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Bottom Section ── */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>

          <div className="flex items-center gap-4">
            {[
              {
                label: "GitHub",
                href: "https://github.com/joshsegatt/SGT-Finance",
                icon: <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />,
              },
              {
                label: "LinkedIn",
                href: "#",
                icon: <><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></>,
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary/20 border border-border/50 text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
