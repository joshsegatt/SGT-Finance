"use client";

import {
  useEffect, useState, useRef, useCallback, useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard, PieChart, RefreshCcw, Receipt, Repeat,
  FileText, Users, Landmark, BarChart3, Settings, Search,
  ArrowRight, Plus, CreditCard, ShieldCheck,
} from "lucide-react";

interface SearchResult {
  clients: { id: string; name: string; email: string | null }[];
  transactions: { id: string; description: string; amount: number; currency: string }[];
  invoices: { id: string; number: string; status: string; client: { name: string } | null; lines: { amount: number }[] }[];
}

type RouteEntry = { id: string; icon: React.ElementType; keywords?: string };
type ActionEntry = { id: string; labelKey: string; subKey: string; icon: React.ElementType; keywords?: string };

const ROUTES: RouteEntry[] = [
  { id: "dashboard", icon: LayoutDashboard, keywords: "home overview" },
  { id: "analytics", icon: PieChart, keywords: "charts graphs" },
  { id: "transactions", icon: RefreshCcw, keywords: "payments bank" },
  { id: "invoices", icon: Receipt, keywords: "billing invoice" },
  { id: "recurring", icon: Repeat, keywords: "subscription" },
  { id: "clients", icon: Users, keywords: "customer contact" },
  { id: "accounts", icon: Landmark, keywords: "bank account" },
  { id: "tax", icon: ShieldCheck, keywords: "vat deadline fiscal" },
  { id: "reports", icon: BarChart3, keywords: "export statement" },
  { id: "settings", icon: Settings, keywords: "profile preferences" },
];

const ACTIONS: ActionEntry[] = [
  { id: "new-invoice", labelKey: "createInvoice", subKey: "createInvoiceSub", icon: Plus, keywords: "new create invoice" },
  { id: "new-client", labelKey: "addClient", subKey: "addClientSub", icon: Users, keywords: "new add client" },
  { id: "export-tx", labelKey: "exportTransactions", subKey: "exportTransactionsSub", icon: FileText, keywords: "export download csv" },
  { id: "accounts-view", labelKey: "viewAccounts", subKey: "viewAccountsSub", icon: CreditCard, keywords: "bank balance" },
];

function formatAmt(n: number, cur: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: cur.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(Math.abs(n));
}

export function CommandPalette() {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const tNav = useTranslations("Navigation");
  const tCmd = useTranslations("CommandPalette");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Open on ⌘K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSearchResults(null);
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const fetchSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setSearchResults(null); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) setSearchResults(await res.json());
    } finally {
      setSearching(false);
    }
  }, []);

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQuery(v);
    setActiveIdx(0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSearch(v), 300);
  }

  function navigate(href: string) {
    setOpen(false);
    startTransition(() => router.push(href));
  }

  function runAction(id: string) {
    setOpen(false);
    switch (id) {
      case "new-invoice": return navigate("/invoices?create=1");
      case "new-client": return navigate("/clients?create=1");
      case "export-tx": return void (window.location.href = "/api/export/transactions");
      case "accounts-view": return navigate("/accounts");
      default: return;
    }
  }

  // Build items list
  const lq = query.toLowerCase();
  const filteredRoutes = ROUTES.filter(
    (r) => !lq || tNav(r.id as Parameters<typeof tNav>[0]).toLowerCase().includes(lq) || (r.keywords ?? "").includes(lq)
  );
  const filteredActions = ACTIONS.filter(
    (a) => !lq || tCmd(`actions.${a.labelKey}` as Parameters<typeof tCmd>[0]).toLowerCase().includes(lq)
      || tCmd(`actions.${a.subKey}` as Parameters<typeof tCmd>[0]).toLowerCase().includes(lq)
      || (a.keywords ?? "").includes(lq)
  );

  type FlatItem =
    | { type: "route"; data: RouteEntry }
    | { type: "action"; data: ActionEntry }
    | { type: "client"; data: SearchResult["clients"][number] }
    | { type: "transaction"; data: SearchResult["transactions"][number] }
    | { type: "invoice"; data: SearchResult["invoices"][number] };

  const flatItems: FlatItem[] = [
    ...filteredRoutes.map((r) => ({ type: "route" as const, data: r })),
    ...filteredActions.map((a) => ({ type: "action" as const, data: a })),
    ...(searchResults?.clients ?? []).map((c) => ({ type: "client" as const, data: c })),
    ...(searchResults?.transactions ?? []).map((t) => ({ type: "transaction" as const, data: t })),
    ...(searchResults?.invoices ?? []).map((i) => ({ type: "invoice" as const, data: i })),
  ];

  function execItem(item: FlatItem) {
    switch (item.type) {
      case "route": navigate(item.data.id === "dashboard" ? "/" : `/${item.data.id}`); break;
      case "action": runAction(item.data.id); break;
      case "client": navigate(`/clients?clientId=${item.data.id}`); break;
      case "transaction": navigate(`/transactions?search=${encodeURIComponent(item.data.description)}`); break;
      case "invoice": navigate(`/invoices`); break;
    }
  }

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, flatItems.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && flatItems[activeIdx]) {
        execItem(flatItems[activeIdx]);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, flatItems, activeIdx]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  if (!open) return null;

  // Group rendering
  const sections: { label: string; items: FlatItem[] }[] = [];
  if (filteredRoutes.length > 0) {
    sections.push({ label: tCmd("sections.navigation"), items: filteredRoutes.map((r) => ({ type: "route", data: r })) });
  }
  if (filteredActions.length > 0) {
    sections.push({ label: tCmd("sections.quickActions"), items: filteredActions.map((a) => ({ type: "action", data: a })) });
  }
  if (searchResults) {
    if (searchResults.clients.length > 0)
      sections.push({ label: tCmd("sections.clients"), items: searchResults.clients.map((c) => ({ type: "client", data: c })) });
    if (searchResults.transactions.length > 0)
      sections.push({ label: tCmd("sections.transactions"), items: searchResults.transactions.map((t) => ({ type: "transaction", data: t })) });
    if (searchResults.invoices.length > 0)
      sections.push({ label: tCmd("sections.invoices"), items: searchResults.invoices.map((i) => ({ type: "invoice", data: i })) });
  }

  let globalIdx = 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative w-full max-w-[560px] bg-popover border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder={tCmd("placeholder")}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
          {searching && (
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin shrink-0" />
          )}
          <kbd className="text-[10px] border border-border/50 rounded px-1.5 py-0.5 text-muted-foreground/60 shrink-0">ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="overflow-y-auto flex-1">
          {flatItems.length === 0 && query.length > 0 && !searching ? (
            <div className="flex flex-col items-center py-10 gap-2 text-muted-foreground">
              <Search className="w-8 h-8 opacity-20" />
              <p className="text-sm">{tCmd("noResults")} &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.label}>
                <div className="px-4 py-2 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
                  {section.label}
                </div>
                {section.items.map((item) => {
                  const idx = globalIdx++;
                  const isActive = idx === activeIdx;

                  let icon: React.ElementType = ArrowRight;
                  let label = "";
                  let sub = "";

                  if (item.type === "route") {
                    icon = item.data.icon;
                    label = tNav(item.data.id as Parameters<typeof tNav>[0]);
                  } else if (item.type === "action") {
                    icon = item.data.icon;
                    label = tCmd(`actions.${item.data.labelKey}` as Parameters<typeof tCmd>[0]);
                    sub = tCmd(`actions.${item.data.subKey}` as Parameters<typeof tCmd>[0]);
                  } else if (item.type === "client") {
                    icon = Users;
                    label = item.data.name;
                    sub = item.data.email ?? "Client";
                  } else if (item.type === "transaction") {
                    icon = RefreshCcw;
                    label = item.data.description;
                    sub = formatAmt(item.data.amount, item.data.currency);
                  } else if (item.type === "invoice") {
                    icon = Receipt;
                    label = `#${item.data.number}`;
                    sub = item.data.client?.name ?? "";
                  }

                  const Icon = icon;

                  return (
                    <div
                      key={`${item.type}-${item.type === "route" ? item.data.id : item.type === "action" ? item.data.id : item.type === "client" ? item.data.id : item.type === "transaction" ? item.data.id : item.data.id}`}
                      data-idx={idx}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => execItem(item)}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                        isActive ? "bg-primary/10 text-foreground" : "text-foreground/80 hover:bg-muted/40"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? "bg-primary/20" : "bg-muted/50"
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{label}</p>
                        {sub && <p className="text-[11px] text-muted-foreground truncate">{sub}</p>}
                      </div>
                      {isActive && <ArrowRight className="w-3.5 h-3.5 text-primary/60 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border/30 flex items-center gap-4 text-[10px] text-muted-foreground/50">
          <span><kbd className="border border-border/40 rounded px-1 py-0.5">⇕</kbd> {tCmd("footer.navigate")}</span>
          <span><kbd className="border border-border/40 rounded px-1 py-0.5">↵</kbd> {tCmd("footer.select")}</span>
          <span><kbd className="border border-border/40 rounded px-1 py-0.5">ESC</kbd> {tCmd("footer.close")}</span>
          <span className="ml-auto opacity-60">⌘K {tCmd("footer.open")}</span>
        </div>
      </div>
    </div>
  );
}
