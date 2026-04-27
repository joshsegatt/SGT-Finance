"use client";

import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { setLocale } from "@/lib/actions";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────
   DESIGN TOKENS
   ───────────────────────────────────────────────────────── */
const LOCALES = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "pt", label: "PT", flag: "🇧🇷" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
] as const;

/* ─────────────────────────────────────────────────────────
   LANGUAGE SWITCHER (premium pill)
   ───────────────────────────────────────────────────────── */
function MarketingLangSwitcher() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [currentLocale, setCurrentLocale] = useState("en");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/);
    if (match) setCurrentLocale(decodeURIComponent(match[1]));
  }, []);

  async function handleSelect(code: string) {
    if (code === currentLocale) return;
    setCurrentLocale(code);
    await setLocale(code);
    startTransition(() => {
      router.refresh();
    });
  }

  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  return (
    <div className="relative group">
      <button
        disabled={pending}
        aria-label="Change language"
        className="flex items-center gap-1.5 text-[13px] font-semibold px-2.5 py-1.5 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-foreground/5"
      >
        <span className="text-sm">{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown className="w-3 h-3 opacity-40" />
      </button>
      <div
        className="absolute right-0 top-full mt-2 z-50 hidden group-hover:flex group-focus-within:flex flex-col rounded-[14px] overflow-hidden py-1.5 bg-background border border-border shadow-xl min-w-[120px]"
      >
        {LOCALES.map(({ code, label, flag }) => (
          <button
            key={code}
            onClick={() => handleSelect(code)}
            className={`flex items-center gap-2.5 px-3.5 py-2 text-[13px] transition-all duration-150 w-full text-left ${
              code === currentLocale ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-foreground/5"
            }`}
          >
            <span className="text-sm">{flag}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN NAV
   ───────────────────────────────────────────────────────── */
export function MarketingNav() {
  const t = useTranslations("Marketing.nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const LINKS = [
    { label: t("features"), href: "#features" },
    { label: t("howItWorks"), href: "#how-it-works" },
    { label: t("pricing"), href: "/pricing" },
  ];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out"
      style={{
        paddingTop: scrolled ? 0 : 16,
      }}
    >
      <div
        className="mx-auto transition-all duration-500 ease-in-out"
        style={{
          maxWidth: scrolled ? "100%" : "1200px",
          paddingLeft: scrolled ? 0 : 20,
          paddingRight: scrolled ? 0 : 20,
        }}
      >
        <div
          className={`transition-all duration-500 ease-in-out ${
            scrolled
              ? "bg-background/80 backdrop-blur-md border-b border-border"
              : "bg-background/40 backdrop-blur-sm border border-border/50"
          }`}
          style={{
            borderRadius: scrolled ? "0" : "20px",
            boxShadow: scrolled
              ? "none"
              : "0 8px 32px -4px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">
            {/* ── Corporate Logo ── */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
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

            {/* ── Desktop Nav ── */}
            <div className="hidden md:flex items-center gap-1">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-[13px] font-bold text-muted-foreground hover:text-foreground rounded-lg transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* ── Action Buttons ── */}
            <div className="hidden md:flex items-center gap-4">
              <MarketingLangSwitcher />
              <div className="h-4 w-px bg-border" />
              <Link
                href="/login"
                className="text-[13px] font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-[13px] font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#4F46E5] rounded-xl hover:opacity-90 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.35)] hover:-translate-y-0.5 active:translate-y-0"
              >
                {t("cta")}
              </Link>
            </div>

            {/* ── Mobile Burger ── */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-foreground hover:bg-foreground/5 transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 p-4 rounded-2xl bg-background/95 backdrop-blur-xl border border-border shadow-2xl flex flex-col gap-2"
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-[15px] font-bold text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            <div className="flex items-center justify-between px-4 py-2">
              <MarketingLangSwitcher />
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-[14px] font-bold text-foreground"
              >
                {t("login")}
              </Link>
            </div>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="mt-2 w-full py-4 text-center text-[14px] font-bold bg-primary text-primary-foreground rounded-xl shadow-lg"
            >
              {t("cta")}
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
