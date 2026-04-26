"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Funcionalidades", href: "#features" },
  { label: "Como Funciona", href: "#how-it-works" },
  { label: "Preços", href: "/pricing" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(5,10,20,0.92)"
          : "transparent",
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
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-150"
          >
            Entrar
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
            Começar Grátis
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
          aria-label="Abrir menu"
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
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-sm text-center font-medium text-white/60 border border-white/10 rounded-xl hover:bg-white/[0.05] transition-all"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-sm text-center font-bold text-white rounded-xl transition-all"
              style={{ background: "linear-gradient(135deg, #4979EF, #3B6CE0)" }}
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
