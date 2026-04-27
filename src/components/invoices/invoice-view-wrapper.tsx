"use client";

import { InvoiceKanban } from "./invoice-kanban";
import { InvoicesTable } from "./invoices-table";
import { InvoiceViewToggle, useInvoiceViewMode } from "./invoice-view-toggle";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";

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

interface InvoiceViewWrapperProps {
  invoices: Invoice[];
  clients: { id: string; name: string }[];
}

export function InvoiceViewWrapper({ invoices, clients }: InvoiceViewWrapperProps) {
  const [viewMode, setViewMode] = useInvoiceViewMode();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <InvoiceViewToggle value={viewMode} onChange={setViewMode} />
      </div>
      
      {invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="Create professional invoices, track their status and get paid faster."
          action={{
             label: "Create Invoice",
             onClick: () => {
                // Find the create button in the DOM and click it
                const btn = document.querySelector('[data-create-invoice]') as HTMLButtonElement;
                if (btn) btn.click();
             }
          }}
        />
      ) : viewMode === "kanban" ? (
        <InvoiceKanban invoices={invoices} clients={clients} />
      ) : (
        <InvoicesTable invoices={invoices} clients={clients} />
      )}
    </div>
  );
}
