"use client";

import { useState, useMemo } from "react";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  CheckCircle, X, ArrowRight, Search, Zap,
  Link2, AlertCircle, ChevronRight, Sparkles,
} from "lucide-react";

type Transaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  currency: string;
  category: string | null;
  status: string;
  notes: string | null;
  taxRelevant: boolean;
  isSubscription: boolean;
  account: { name: string; entity: { name: string } };
};

type SimpleInvoice = {
  id: string;
  number: string;
  date: Date;
  dueDate: Date;
  status: string;
  currency: string;
  client: { name: string };
  lines: { amount: number; taxRate: number }[];
};

interface ReconciliationViewProps {
  transactions: Transaction[];
  invoices: SimpleInvoice[];
  onExit: () => void;
}

type MatchSuggestion = {
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  invoiceTotal: number;
  currency: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  reason: string;
};

type MatchedPair = {
  transactionId: string;
  invoiceId: string;
};

function getConfidenceColor(c: string) {
  switch (c) {
    case "HIGH": return "text-emerald-500 bg-emerald-500/10";
    case "MEDIUM": return "text-amber-500 bg-amber-500/10";
    case "LOW": return "text-muted-foreground bg-muted/50";
    default: return "text-muted-foreground bg-muted/50";
  }
}

function generateSuggestions(tx: Transaction, invoices: SimpleInvoice[]): MatchSuggestion[] {
  const absTxAmount = Math.abs(tx.amount);
  const suggestions: MatchSuggestion[] = [];

  for (const inv of invoices) {
    if (inv.status === "PAID" || inv.status === "CANCELLED") continue;
    const invTotal = inv.lines.reduce((s, l) => s + l.amount + l.amount * (l.taxRate / 100), 0);
    const diff = Math.abs(absTxAmount - invTotal);
    const pctDiff = invTotal > 0 ? diff / invTotal : 1;

    if (pctDiff < 0.01) {
      suggestions.push({
        invoiceId: inv.id,
        invoiceNumber: inv.number,
        clientName: inv.client.name,
        invoiceTotal: invTotal,
        currency: inv.currency,
        confidence: "HIGH",
        reason: "Exact amount match",
      });
    } else if (pctDiff < 0.05) {
      suggestions.push({
        invoiceId: inv.id,
        invoiceNumber: inv.number,
        clientName: inv.client.name,
        invoiceTotal: invTotal,
        currency: inv.currency,
        confidence: "MEDIUM",
        reason: `Amount differs by ${formatCurrency(diff)}`,
      });
    } else if (pctDiff < 0.15 && tx.description.toLowerCase().includes(inv.client.name.toLowerCase().slice(0, 4))) {
      suggestions.push({
        invoiceId: inv.id,
        invoiceNumber: inv.number,
        clientName: inv.client.name,
        invoiceTotal: invTotal,
        currency: inv.currency,
        confidence: "LOW",
        reason: "Client name partial match",
      });
    }
  }

  return suggestions.sort((a, b) => {
    const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return order[a.confidence] - order[b.confidence];
  }).slice(0, 5);
}

export function ReconciliationView({ transactions, invoices, onExit }: ReconciliationViewProps) {
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [matched, setMatched] = useState<MatchedPair[]>([]);
  const [filter, setFilter] = useState("");

  const unmatchedTxs = useMemo(
    () => transactions.filter((tx) => !matched.some((m) => m.transactionId === tx.id)),
    [transactions, matched]
  );

  const filteredTxs = useMemo(
    () => filter
      ? unmatchedTxs.filter((tx) => tx.description.toLowerCase().includes(filter.toLowerCase()))
      : unmatchedTxs,
    [unmatchedTxs, filter]
  );

  const matchedTxIds = new Set(matched.map((m) => m.transactionId));
  const selectedTx = selectedTxId ? transactions.find((t) => t.id === selectedTxId) : null;
  const suggestions = selectedTx ? generateSuggestions(selectedTx, invoices) : [];

  function handleMatch(txId: string, invoiceId: string) {
    setMatched((prev) => [...prev, { transactionId: txId, invoiceId }]);
    setSelectedTxId(null);
  }

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-card/80 rounded-xl border border-border p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Reconciliation Mode</span>
          </div>
          <div className="h-4 w-px bg-border/60" />
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold text-amber-500">{unmatchedTxs.length}</span> unmatched
            </span>
            <span>
              <span className="font-semibold text-emerald-500">{matched.length}</span> matched
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onExit} className="gap-1.5 h-8">
          <X className="h-3.5 w-3.5" /> Exit
        </Button>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-5 gap-4 min-h-[500px]">
        {/* Left: Bank Feed (3/5) */}
        <div className="col-span-3 bg-card/80 rounded-xl border border-border overflow-hidden shadow-sm flex flex-col">
          <div className="px-4 py-3 border-b border-border/40 flex items-center gap-3">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Bank Feed</h3>
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter transactions..."
                className="w-full h-7 pl-7 pr-3 rounded-md bg-background border border-border/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/20">
            {/* Matched items first */}
            {matched.map((m) => {
              const tx = transactions.find((t) => t.id === m.transactionId);
              if (!tx) return null;
              return (
                <div key={tx.id} className="flex items-center px-4 py-2.5 bg-emerald-500/5 opacity-60">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mr-3" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate line-through">{tx.description}</p>
                    <p className="text-[10px] text-muted-foreground">{tx.account.entity.name} · {formatDate(tx.date)}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-500 shrink-0 ml-2">Matched</span>
                </div>
              );
            })}

            {/* Unmatched items */}
            {filteredTxs.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setSelectedTxId(tx.id)}
                className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-150 ${
                  selectedTxId === tx.id
                    ? "bg-primary/5 border-l-2 border-l-primary"
                    : "hover:bg-muted/30 border-l-2 border-l-transparent"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{tx.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{tx.account.entity.name} · {formatDate(tx.date)}</p>
                </div>
                <div className="text-right ml-3 shrink-0">
                  <p className={`text-sm font-semibold ${tx.amount >= 0 ? "text-emerald-500" : "text-foreground"}`}>
                    {tx.amount >= 0 ? "+" : ""}{formatCurrency(tx.amount, tx.currency)}
                  </p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 ml-2 shrink-0" />
              </div>
            ))}

            {filteredTxs.length === 0 && matched.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-500/20 mb-3" />
                <p className="text-sm text-muted-foreground">No transactions to reconcile</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Match Suggestions (2/5) */}
        <div className="col-span-2 bg-card/80 rounded-xl border border-border overflow-hidden shadow-sm flex flex-col">
          <div className="px-4 py-3 border-b border-border/40">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Suggested Matches</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {!selectedTx ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                  <Link2 className="w-5 h-5 text-muted-foreground/30" />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Select a transaction</p>
                <p className="text-xs text-muted-foreground/60">Click a transaction from the bank feed to see matching invoices</p>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <AlertCircle className="w-8 h-8 text-muted-foreground/20 mb-3" />
                <p className="text-sm font-medium text-muted-foreground mb-1">No matches found</p>
                <p className="text-xs text-muted-foreground/60">No invoices match this transaction amount</p>
              </div>
            ) : (
              <div className="space-y-2">
                {suggestions.map((s) => (
                  <div key={s.invoiceId} className="rounded-lg border border-border/60 p-3 hover:border-border transition-colors bg-card/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-mono text-xs font-semibold text-foreground">{s.invoiceNumber}</span>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{s.clientName}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${getConfidenceColor(s.confidence)}`}>
                        {s.confidence}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-foreground">{formatCurrency(s.invoiceTotal, s.currency)}</span>
                      <span className="text-[10px] text-muted-foreground">{s.reason}</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full h-7 text-xs gap-1.5"
                      onClick={() => handleMatch(selectedTx.id, s.invoiceId)}
                    >
                      <Zap className="h-3 w-3" /> Match 1-Click
                    </Button>
                  </div>
                ))}

                <button className="w-full text-center py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Skip — no match for this transaction
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
