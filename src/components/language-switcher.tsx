"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/lib/actions";

const LOCALES = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "pt", label: "PT", flag: "🇧🇷" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
] as const;

interface LanguageSwitcherProps {
  currentLocale: string;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function handleSelect(code: string) {
    if (code === currentLocale) return;
    await setLocale(code);
    startTransition(() => {
      router.refresh();
    });
  }

  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs font-semibold tracking-wider h-8 px-2 rounded-lg hover:bg-primary/10 disabled:opacity-50"
        disabled={pending}
        aria-label="Change language"
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
      </button>

      <div className="absolute right-0 top-full mt-1 z-50 hidden group-hover:flex group-focus-within:flex flex-col bg-popover border border-border rounded-lg shadow-xl shadow-black/30 overflow-hidden min-w-[100px] py-1">
        {LOCALES.map(({ code, label, flag }) => (
          <button
            key={code}
            onClick={() => handleSelect(code)}
            className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors w-full text-left ${
              code === currentLocale
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <span>{flag}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
