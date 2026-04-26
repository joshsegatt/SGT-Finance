"use client";

import { useState, useTransition } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/format";
import { updateInvoiceStatus } from "@/lib/actions";
import { MoreHorizontal, ChevronDown, Receipt, SlidersHorizontal, Download, Printer } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Invoice = {
  id: string;
  number: string;
  date: Date;
  dueDate: Date;
  status: string;
  currency: string;
  notes: string | null;
  client: { name: string };
  entity: { name: string };
  lines: { amount: number; taxRate: number }[];
};

interface InvoicesTableProps {
  invoices: Invoice[];
  clients: { id: string; name: string }[];
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  SENT: "bg-blue-500/10 text-blue-400",
  PAID: "bg-emerald-500/10 text-emerald-500",
  OVERDUE: "bg-red-500/10 text-red-400",
  CANCELLED: "bg-muted/50 text-muted-foreground line-through",
};

const STATUSES = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"];

export function InvoicesTable({ invoices, clients }: InvoicesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function handleStatusChange(id: string, status: string) {
    startTransition(async () => {
      await updateInvoiceStatus(id, status);
    });
  }

  function getSubtotal(lines: { amount: number }[]) {
    return lines.reduce((s, l) => s + l.amount, 0);
  }

  function getTax(lines: { amount: number; taxRate: number }[]) {
    return lines.reduce((s, l) => s + l.amount * (l.taxRate / 100), 0);
  }

  const totalValue = invoices.reduce((s, inv) => s + getSubtotal(inv.lines), 0);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select
          defaultValue={searchParams.get("status") ?? "all"}
          onValueChange={(v) => setParam("status", v)}
        >
          <SelectTrigger className="w-[130px] h-8">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={searchParams.get("clientId") ?? "all"}
          onValueChange={(v) => setParam("clientId", v)}
        >
          <SelectTrigger className="w-[160px] h-8">
            <SelectValue placeholder="Client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All clients</SelectItem>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{formatCurrency(totalValue)}</span>
          </span>
          <button
            onClick={() => { window.location.href = `/api/export/invoices?${searchParams.toString()}`; }}
            className="inline-flex items-center gap-1.5 text-xs font-medium border border-border/60 rounded-md px-2.5 py-1.5 hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card/80 rounded-xl border border-border overflow-hidden shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="text-right">Tax</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="py-2">
                  <EmptyState
                    icon={searchParams.get("status") || searchParams.get("clientId") ? SlidersHorizontal : Receipt}
                    title={searchParams.get("status") || searchParams.get("clientId") ? "No invoices match" : "No invoices yet"}
                    description={searchParams.get("status") || searchParams.get("clientId") ? "Try clearing your filters to see all invoices." : "Create your first invoice to start getting paid."}
                    action={searchParams.get("status") || searchParams.get("clientId") ? { label: "Clear filters", onClick: () => { setParam("status", null); setParam("clientId", null); } } : { label: "Create Invoice", href: "/invoices?create=1" }}
                    compact
                  />
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => {
                const subtotal = getSubtotal(inv.lines);
                const tax = getTax(inv.lines);
                const total = subtotal + tax;
                const isOverdue =
                  inv.status !== "PAID" && inv.status !== "CANCELLED" && new Date(inv.dueDate) < new Date();

                return (
                  <TableRow
                    key={inv.id}
                    className={`border-border/30 hover:bg-muted/40 ${isOverdue && inv.status !== "OVERDUE" ? "bg-red-500/5" : ""}`}
                  >
                    <TableCell className="font-mono font-semibold text-sm">{inv.number}</TableCell>
                    <TableCell className="font-medium">{inv.client.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{inv.entity.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{formatDate(inv.date)}</TableCell>
                    <TableCell
                      className={`text-xs ${isOverdue ? "text-red-400 font-semibold" : "text-muted-foreground"}`}
                    >
                      {formatDate(inv.dueDate)}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[inv.status] ?? "bg-muted"}`}>
                        {inv.status.charAt(0) + inv.status.slice(1).toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(subtotal, inv.currency)}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{formatCurrency(tax, inv.currency)}</TableCell>
                    <TableCell className="text-right font-semibold text-sm">{formatCurrency(total, inv.currency)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          disabled={pending}
                          className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() => window.open(`/invoices/${inv.id}/print`, "_blank")}
                          >
                            <Printer className="h-3.5 w-3.5 mr-2 opacity-70" />
                            Print / PDF
                          </DropdownMenuItem>
                          {STATUSES.filter((s) => s !== inv.status).map((s) => (
                            <DropdownMenuItem
                              key={s}
                              onClick={() => handleStatusChange(inv.id, s)}
                            >
                              Mark as {s.charAt(0) + s.slice(1).toLowerCase()}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
