"use client";

import { useState, useEffect } from "react";
import { LayoutList, Columns3 } from "lucide-react";

const STORAGE_KEY = "sgt-invoice-view";

export type InvoiceViewMode = "table" | "kanban";

interface InvoiceViewToggleProps {
  value: InvoiceViewMode;
  onChange: (mode: InvoiceViewMode) => void;
}

export function InvoiceViewToggle({ value, onChange }: InvoiceViewToggleProps) {
  return (
    <div className="flex items-center bg-muted/50 rounded-lg p-0.5 border border-border/40">
      <button
        onClick={() => onChange("table")}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
          value === "table"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Table view"
      >
        <LayoutList className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Table</span>
      </button>
      <button
        onClick={() => onChange("kanban")}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
          value === "kanban"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Kanban view"
      >
        <Columns3 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Board</span>
      </button>
    </div>
  );
}

export function useInvoiceViewMode(): [InvoiceViewMode, (m: InvoiceViewMode) => void] {
  const [mode, setMode] = useState<InvoiceViewMode>("table");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "kanban" || saved === "table") setMode(saved);
    } catch {}
  }, []);

  const setAndSave = (m: InvoiceViewMode) => {
    setMode(m);
    try { localStorage.setItem(STORAGE_KEY, m); } catch {}
  };

  return [mode, setAndSave];
}
