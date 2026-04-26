"use client";

import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { setLocale } from "@/lib/actions";

const LOCALES = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "pt", label: "PT", flag: "🇧🇷" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
] as const;

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
        className="flex items-center gap-1.5 text-sm font-semibold px-2 py-1.5 rounded-lg transition-colors"
        style={{ color: "rgba(255,255,255,0.45)", background: "transparent" }}
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
      </button>
      <div
        className="absolute right-0 top-full mt-1 z-50 hidden group-hover:flex group-focus-within:flex flex-col rounded-xl overflow-hidden py-1"
        style={{
          background: "rgba(8,14,28,0.98)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
          minWidth: 108,
        }}
      >
        {LOCALES.map(({ code, label, flag }) => (
          <button
            key={code}
            onClick={() => handleSelect(code)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm transition-colors w-full text-left"
            style={{
              background: code === currentLocale ? "rgba(73,121,239,0.12)" : "transparent",
              color: code === currentLocale ? "#7BA4FF" : "rgba(255,255,255,0.50)",
              fontWeight: code === currentLocale ? 700 : 500,
            }}
          >
            <span>{flag}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

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
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(5,10,20,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#4979EF" />
            <rect x="6" y="18" width="4" height="8" rx="1.5" fill="white" fillOpacity="0.5" />
            <rect x="12" y="13" width="4" height="13" rx="1.5" fill="white" fillOpacity="0.75" />
            <rect x="18" y="8" width="4" height="18" rx="1.5" fill="white" />
            <path d="M7 14L13 10L19 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="19" cy="6" r="1.5" fill="white" />
          </svg>
          <span className="font-bold text-white text-lg tracking-tight group-hover:text-white/90 transition-colors">
            SGT Finance
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white rounded-lg hover:bg-white/[0.07] transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <MarketingLangSwitcher />
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-150"
          >
            {t("login")}
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #4979EF, #3B6CE0)",
              boxShadow: "0 0 20px rgba(73,121,239,0.35)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 32px rgba(73,121,239,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(73,121,239,0.35)";
            }}
          >
            {t("cta")}
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-4 pb-5 space-y-1"
          style={{
            background: "rgba(5,10,20,0.98)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-white/60 hover:text-white rounded-lg hover:bg-white/[0.07] transition-all"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2.5">
            <div className="flex justify-center pb-1">
              <MarketingLangSwitcher />
            </div>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-sm text-center font-medium text-white/60 border border-white/10 rounded-xl hover:bg-white/[0.05] transition-all"
            >
              {t("login")}
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-sm text-center font-bold text-white rounded-xl transition-all"
              style={{ background: "linear-gradient(135deg, #4979EF, #3B6CE0)" }}
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
