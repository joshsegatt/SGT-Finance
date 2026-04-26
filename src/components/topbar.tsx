"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition, useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight, Search, FileText, Users, CreditCard, Loader2 } from "lucide-react";

const VALID_ROUTE_KEYS = new Set(["analytics","transactions","invoices","clients","accounts","recurring","tax","reports","settings"]);

const SUB_KEY_MAP: Record<string, string> = {
  print: "subLabels.print",
  new: "subLabels.new",
  edit: "subLabels.edit",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const segments = pathname.split("/").filter(Boolean);
  const isRoot = segments.length === 0;

  // Build crumbs: Dashboard > Section > [id] > Sub
  const crumbs: { label: string; href?: string }[] = [
    { label: t("dashboard"), href: "/" },
  ];

  if (!isRoot) {
    const sectionLabel = VALID_ROUTE_KEYS.has(segments[0])
      ? t(segments[0] as Parameters<typeof t>[0])
      : segments[0];
    crumbs.push(segments.length === 1 ? { label: sectionLabel } : { label: sectionLabel, href: `/${segments[0]}` });

    if (segments.length >= 3) {
      const lastSeg = segments[segments.length - 1];
      const subKey = SUB_KEY_MAP[lastSeg];
      const subLabel = subKey ? t(subKey as Parameters<typeof t>[0]) : lastSeg;
      crumbs.push({ label: subLabel });
    }
  }

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 opacity-35" />}
          <span className={i === crumbs.length - 1 ? "text-foreground font-medium" : "hover:text-foreground/70 transition-colors"}>
            {crumb.label}
          </span>
        </span>
      ))}
    </div>
  );
}

interface SearchResults {
  clients: { id: string; name: string; email: string | null; status: string }[];
  transactions: { id: string; description: string | null; amount: number; currency: string; date: string }[];
  invoices: { id: string; number: string; status: string; client: { name: string } | null; lines: { amount: number }[] }[];
}

function fmt(amount: number, currency: string) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: currency.toUpperCase(), maximumFractionDigits: 0 }).format(Math.abs(amount));
}

export function TopbarSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const tCommon = useTranslations("Common");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json() as SearchResults;
        setResults(data);
        setOpen(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(v), 300);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const v = query.trim();
      setOpen(false);
      if (v) startTransition(() => router.push(`/transactions?search=${encodeURIComponent(v)}`));
    }
    if (e.key === "Escape") { setOpen(false); setQuery(""); setResults(null); }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const total = results ? results.clients.length + results.transactions.length + results.invoices.length : 0;
  const hasResults = total > 0;

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results && total > 0) setOpen(true); }}
          className="bg-muted/40 border border-border/50 text-sm rounded-full pl-8 pr-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50 w-56 text-foreground placeholder:text-muted-foreground/50 transition-all focus:w-72"
        />
        {loading
          ? <Loader2 className="w-3.5 h-3.5 text-muted-foreground/50 absolute left-2.5 top-2.5 animate-spin" />
          : <Search className="w-3.5 h-3.5 text-muted-foreground/50 absolute left-2.5 top-2.5" />
        }
      </div>

      {/* Dropdown */}
      {open && results && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
          {!hasResults ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">{tCommon("noResultsFor")} &ldquo;{query}&rdquo;</div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {/* Clients */}
              {results.clients.length > 0 && (
                <div>
                  <div className="px-3 py-2 flex items-center gap-1.5 sticky top-0 bg-popover/95 backdrop-blur-sm border-b border-border/30">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tCommon("clients")}</span>
                  </div>
                  {results.clients.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setOpen(false); setQuery(""); startTransition(() => router.push(`/clients?clientId=${c.id}`)); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                        {c.email && <p className="text-xs text-muted-foreground truncate">{c.email}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Transactions */}
              {results.transactions.length > 0 && (
                <div>
                  <div className="px-3 py-2 flex items-center gap-1.5 sticky top-0 bg-popover/95 backdrop-blur-sm border-b border-border/30">
                    <CreditCard className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tCommon("transactions")}</span>
                  </div>
                  {results.transactions.map((tx) => (
                    <button
                      key={tx.id}
                      onClick={() => { setOpen(false); setQuery(""); startTransition(() => router.push(`/transactions?search=${encodeURIComponent(query)}`)); }}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                    >
                      <p className="text-sm text-foreground truncate flex-1">{tx.description ?? tCommon("transaction")}</p>
                      <span className={`text-sm font-semibold shrink-0 ${tx.amount >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                        {tx.amount >= 0 ? "+" : "-"}{fmt(tx.amount, tx.currency)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Invoices */}
              {results.invoices.length > 0 && (
                <div>
                  <div className="px-3 py-2 flex items-center gap-1.5 sticky top-0 bg-popover/95 backdrop-blur-sm border-b border-border/30">
                    <FileText className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tCommon("invoices")}</span>
                  </div>
                  {results.invoices.map((inv) => (
                    <button
                      key={inv.id}
                      onClick={() => { setOpen(false); setQuery(""); startTransition(() => router.push(`/invoices`)); }}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">#{inv.number}</p>
                        {inv.client && <p className="text-xs text-muted-foreground truncate">{inv.client.name}</p>}
                      </div>
                      <span className="text-sm font-semibold text-foreground shrink-0">
                        {fmt(inv.lines.reduce((s, l) => s + l.amount, 0), "GBP")}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* View all */}
              <div className="border-t border-border/30 p-2">
                <button
                  onClick={() => { setOpen(false); startTransition(() => router.push(`/transactions?search=${encodeURIComponent(query)}`)); }}
                  className="w-full text-xs text-center py-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/40"
                >
                  {tCommon("searchAllTransactions")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


