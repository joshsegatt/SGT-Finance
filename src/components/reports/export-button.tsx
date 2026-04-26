"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { subMonths, startOfMonth, endOfMonth, startOfYear, format } from "date-fns";

export function ExportButton({ label = "Export" }: { label?: string }) {
  const [open, setOpen] = useState(false);

  function buildUrl(from?: Date, to?: Date) {
    const params = new URLSearchParams();
    if (from) params.set("from", format(from, "yyyy-MM-dd"));
    if (to) params.set("to", format(to, "yyyy-MM-dd"));
    return `/api/export/transactions?${params.toString()}`;
  }

  const now = new Date();
  const periods = [
    {
      label: "This month",
      url: buildUrl(startOfMonth(now), endOfMonth(now)),
    },
    {
      label: "Last month",
      url: buildUrl(startOfMonth(subMonths(now, 1)), endOfMonth(subMonths(now, 1))),
    },
    {
      label: "Last 3 months",
      url: buildUrl(startOfMonth(subMonths(now, 2)), now),
    },
    {
      label: "Last 6 months",
      url: buildUrl(startOfMonth(subMonths(now, 5)), now),
    },
    {
      label: "Year to date",
      url: buildUrl(startOfYear(now), now),
    },
  ];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-md bg-card border border-border text-foreground hover:bg-muted/50 transition-colors cursor-pointer font-medium">
        <Download className="w-3.5 h-3.5" />
        {label}
        <ChevronDown className="w-3 h-3 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">Transactions</div>
        {periods.map((p) => (
          <DropdownMenuItem key={p.label} onClick={() => { window.location.href = p.url; }}>
            {p.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={() => { window.location.href = "/api/export/transactions"; }}>
          All time
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">Reports</div>
        <DropdownMenuItem onClick={() => { window.location.href = "/api/export/reports?type=cashflow&months=12"; }}>
          Cash Flow (12 months)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { window.location.href = "/api/export/reports?type=categories"; }}>
          Category Breakdown
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">Invoices</div>
        <DropdownMenuItem onClick={() => { window.location.href = "/api/export/invoices"; }}>
          All Invoices
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { window.location.href = "/api/export/clients"; }}>
          All Clients
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
