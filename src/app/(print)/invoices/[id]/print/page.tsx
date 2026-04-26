import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PrintInvoiceView } from "@/components/invoices/print-invoice-view";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const invoice = await db.invoice.findUnique({
    where: { id },
    select: { number: true, client: { select: { name: true } } },
  });
  if (!invoice) return { title: "Invoice" };
  return {
    title: `${invoice.number} — ${invoice.client.name}`,
    description: `Invoice ${invoice.number} for ${invoice.client.name}`,
  };
}

export default async function InvoicePrintPage({ params }: PageProps) {
  const { id } = await params;

  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      client: true,
      entity: true,
      lines: true,
    },
  });

  if (!invoice) notFound();

  return <PrintInvoiceView invoice={invoice} />;
}
