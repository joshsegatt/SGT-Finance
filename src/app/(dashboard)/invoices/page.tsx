import { getInvoices, getClients, getEntities, getInvoiceAging } from "@/lib/data";
import { InvoiceViewWrapper } from "@/components/invoices/invoice-view-wrapper";
import { CreateInvoiceButton } from "@/components/invoices/create-invoice-button";
import { InvoiceAgingPanel } from "@/components/invoices/invoice-aging-panel";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Invoices",
  description: "Manage client invoices, track payments and monitor aging receivables.",
};

interface PageProps {
  searchParams: Promise<{ status?: string; clientId?: string }>;
}

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getNextInvoiceNumber(userId: string) {
  const last = await db.invoice.findFirst({ 
    where: { entity: { userId } },
    orderBy: { number: "desc" } 
  });
  if (!last) return "INV-2026-001";
  const match = last.number.match(/INV-(\d+)-(\d+)/);
  if (!match) return "INV-2026-001";
  const next = String(parseInt(match[2]) + 1).padStart(3, "0");
  return `INV-${match[1]}-${next}`;
}

export default async function InvoicesPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const params = await searchParams;
  const [invoices, clients, entities, nextNumber, aging, t] = await Promise.all([
    getInvoices(userId, { status: params.status, clientId: params.clientId }),
    getClients(userId),
    getEntities(userId),
    getNextInvoiceNumber(userId),
    getInvoiceAging(userId),
    getTranslations("Invoices"),
  ]);

  const overdueCount = invoices.filter((i) => i.status === "OVERDUE").length;
  const paidCount = invoices.filter((i) => i.status === "PAID").length;
  const draftCount = invoices.filter((i) => i.status === "DRAFT").length;

  return (
    <div className="space-y-6">
      <div className="animate-fade-up stagger-1 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground mt-1.5">
            {invoices.length} {invoices.length !== 1 ? t("subtitlePlural") : t("subtitle")}
            {overdueCount > 0 && (
              <span className="ml-2 text-xs text-red-400 font-semibold">
                · {overdueCount} {t("overdue")}
              </span>
            )}
          </p>
        </div>
        <CreateInvoiceButton
          clients={clients.map((c) => ({ id: c.id, name: c.name }))}
          entities={entities}
          nextNumber={nextNumber}
        />
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Draft", count: draftCount, style: "text-muted-foreground" },
          { label: "Paid", count: paidCount, style: "text-emerald-500" },
          { label: "Overdue", count: overdueCount, style: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="bg-card/80 rounded-xl border border-border p-4 text-center shadow-sm">
            <div className={`text-2xl font-bold ${s.style}`}>{s.count}</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      <InvoiceAgingPanel aging={aging} />

      <InvoiceViewWrapper
        invoices={invoices}
        clients={clients.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}

