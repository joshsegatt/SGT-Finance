"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/format";
import { TransactionDetailDialog } from "./transaction-detail-dialog";
import { updateTransactionCategory } from "@/lib/actions";
import { ArrowDown, ArrowUp, ArrowUpDown, Download, Search, RefreshCcw, SlidersHorizontal, Pencil } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

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
  account: {
    name: string;
    entity: { name: string };
  };
};

interface TransactionsTableProps {
  transactions: Transaction[];
  categories: string[];
  accounts: { id: string; name: string }[];
  pagination: { page: number; totalPages: number; total: number };
}

export function TransactionsTable({ transactions, categories, accounts, pagination }: TransactionsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkPending, startBulkTransition] = useTransition();
  const [, startTransition] = useTransition();

  function toggleSelect(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedIds.size === transactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(transactions.map((t) => t.id)));
    }
  }

  function handleBulkExport() {
    const ids = Array.from(selectedIds).join(",");
    window.location.href = `/api/export/transactions?ids=${ids}`;
  }

  function handleBulkCategorize(cat: string) {
    startBulkTransition(async () => {
      await Promise.all(Array.from(selectedIds).map((id) => updateTransactionCategory(id, cat)));
      setSelectedIds(new Set());
      setBulkCategory("");
    });
  }

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 when filter changes
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function toggleSort(field: string) {
    const params = new URLSearchParams(searchParams.toString());
    const currentSort = params.get("sort");
    const currentOrder = params.get("order") ?? "desc";
    if (currentSort === field) {
      params.set("order", currentOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", field);
      params.set("order", "desc");
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleExport() {
    window.location.href = `/api/export/transactions?${searchParams.toString()}`;
  }

  const currentSort = searchParams.get("sort") ?? "date";
  const currentOrder = searchParams.get("order") ?? "desc";

  function SortIcon({ field }: { field: string }) {
    if (currentSort !== field) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40 inline" />;
    return currentOrder === "asc"
      ? <ArrowUp className="ml-1 h-3 w-3 inline text-primary" />
      : <ArrowDown className="ml-1 h-3 w-3 inline text-primary" />;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search transactions..."
            defaultValue={searchParams.get("search") ?? ""}
            className="pl-8 h-8"
            onChange={(e) => {
              const val = e.target.value;
              const params = new URLSearchParams(searchParams.toString());
              if (val) params.set("search", val);
              else params.delete("search");
              startTransition(() => router.push(`${pathname}?${params.toString()}`));
            }}
          />
        </div>

        <Select
          defaultValue={searchParams.get("category") ?? "all"}
          onValueChange={(v) => setParam("category", v)}
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={searchParams.get("status") ?? "all"}
          onValueChange={(v) => setParam("status", v)}
        >
          <SelectTrigger className="w-[130px] h-8">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          defaultValue={searchParams.get("accountId") ?? "all"}
          onValueChange={(v) => setParam("accountId", v)}
        >
          <SelectTrigger className="w-[160px] h-8">
            <SelectValue placeholder="Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All accounts</SelectItem>
            {accounts.map((a) => (
              <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date range */}
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            defaultValue={searchParams.get("from") ?? ""}
            onChange={(e) => setParam("from", e.target.value || null)}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            title="From date"
          />
          <span className="text-muted-foreground text-xs">–</span>
          <input
            type="date"
            defaultValue={searchParams.get("to") ?? ""}
            onChange={(e) => setParam("to", e.target.value || null)}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            title="To date"
          />
        </div>

        <Button variant="outline" size="sm" className="ml-auto h-8 gap-1.5" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" />
          CSV
        </Button>
      </div>

      {/* Bulk action floating bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-popover border border-border shadow-2xl rounded-2xl px-5 py-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-200">
          <span className="text-sm font-medium text-foreground">{selectedIds.size} selected</span>
          <div className="h-4 w-px bg-border/60" />
          <Select value={bulkCategory} onValueChange={(v) => { setBulkCategory(v ?? ""); handleBulkCategorize(v ?? ""); }}>
            <SelectTrigger className="h-7 w-[130px] text-xs border-border/50">
              <SelectValue placeholder="Set category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            onClick={handleBulkExport}
            className="inline-flex items-center gap-1.5 text-xs font-medium border border-border/50 rounded-md px-2.5 py-1.5 hover:bg-muted/50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
          >
            Clear
          </button>
          {bulkPending && <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />}
        </div>
      )}

      {/* Table */}
      <div className="bg-card/80 rounded-xl border border-border overflow-hidden shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="w-8">
                <input
                  type="checkbox"
                  className="accent-primary w-3.5 h-3.5 rounded cursor-pointer"
                  checked={transactions.length > 0 && selectedIds.size === transactions.length}
                  onChange={toggleAll}
                />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("date")}
              >
                Date <SortIcon field="date" />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("description")}
              >
                Description <SortIcon field="description" />
              </TableHead>
              <TableHead>Account</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("category")}
              >
                Category <SortIcon field="category" />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("status")}
              >
                Status <SortIcon field="status" />
              </TableHead>
              <TableHead
                className="text-right cursor-pointer select-none"
                onClick={() => toggleSort("amount")}
              >
                Amount <SortIcon field="amount" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-2">
                  <EmptyState
                    icon={searchParams.get("search") || (searchParams.get("category") && searchParams.get("category") !== "all") || (searchParams.get("status") && searchParams.get("status") !== "all") || (searchParams.get("accountId") && searchParams.get("accountId") !== "all") ? SlidersHorizontal : RefreshCcw}
                    title={searchParams.get("search") || (searchParams.get("category") && searchParams.get("category") !== "all") ? "No transactions match" : "No transactions yet"}
                    description={searchParams.get("search") || searchParams.get("category") ? "Try clearing your filters or searching with different keywords." : "Transactions will appear here after syncing a bank account."}
                    action={searchParams.get("search") || searchParams.get("category") || searchParams.get("status") || searchParams.get("accountId") ? { label: "Clear filters", onClick: () => { router.push("/transactions"); } } : { label: "Go to Accounts", href: "/accounts" }}
                    compact
                  />
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  className={`cursor-pointer border-border/30 hover:bg-muted/40 ${selectedIds.has(tx.id) ? "bg-primary/5" : ""}`}
                  onClick={() => setSelectedTx(tx)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()} className="w-8">
                    <input
                      type="checkbox"
                      className="accent-primary w-3.5 h-3.5 rounded cursor-pointer"
                      checked={selectedIds.has(tx.id)}
                      onChange={(e) => toggleSelect(tx.id, e as unknown as React.MouseEvent)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                    {formatDate(tx.date)}
                  </TableCell>
                  <TableCell className="font-medium max-w-[220px] truncate">
                    {tx.description}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    <div>{tx.account.name}</div>
                    <div className="text-muted-foreground/60">{tx.account.entity.name}</div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {editingCategoryId === tx.id ? (
                      <Select
                        defaultValue={tx.category ?? ""}
                        onValueChange={(val) => {
                          startTransition(async () => {
                            await updateTransactionCategory(tx.id, val ?? "");
                            setEditingCategoryId(null);
                          });
                        }}
                        onOpenChange={(open) => { if (!open) setEditingCategoryId(null); }}
                        open
                      >
                        <SelectTrigger className="h-6 w-[120px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <button
                        className="group flex items-center gap-1.5 max-w-[130px]"
                        onClick={() => setEditingCategoryId(tx.id)}
                        title="Click to edit category"
                      >
                        {tx.category ? (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {tx.category}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/40 group-hover:text-primary transition-colors">
                            + category
                          </span>
                        )}
                        <Pencil className="w-2.5 h-2.5 text-muted-foreground/30 group-hover:text-primary/50 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={tx.status} />
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold text-sm ${
                      tx.amount >= 0 ? "text-emerald-500" : "text-foreground"
                    }`}
                  >
                    {tx.amount >= 0 ? "+" : ""}
                    {formatCurrency(tx.amount, tx.currency)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedTx && (
        <TransactionDetailDialog
          transaction={selectedTx}
          categories={categories}
          open={!!selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{pagination.total} transactions · Page {pagination.page} of {pagination.totalPages}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              disabled={pagination.page <= 1}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", String(pagination.page - 1));
                startTransition(() => router.push(`${pathname}?${params.toString()}`));
              }}
            >
              ← Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", String(pagination.page + 1));
                startTransition(() => router.push(`${pathname}?${params.toString()}`));
              }}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETED: "bg-emerald-500/10 text-emerald-500",
    PENDING: "bg-amber-500/10 text-amber-500",
    FAILED: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
