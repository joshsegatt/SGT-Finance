import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const p = req.nextUrl.searchParams;
  const status = p.get("status") ?? undefined;
  const clientId = p.get("clientId") ?? undefined;

  const invoices = await db.invoice.findMany({
    where: {
      ...(status && status !== "all" ? { status: status as "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED" } : {}),
      ...(clientId && clientId !== "all" ? { clientId } : {}),
    },
    include: {
      client: { select: { name: true } },
      entity: { select: { name: true } },
      lines: { select: { amount: true, taxRate: true } },
    },
    orderBy: { date: "desc" },
  });

  const rows = [
    ["Number", "Date", "Due Date", "Client", "Entity", "Status", "Subtotal", "Tax", "Total", "Currency"],
    ...invoices.map((inv) => {
      const subtotal = inv.lines.reduce((s, l) => s + l.amount, 0);
      const tax = inv.lines.reduce((s, l) => s + l.amount * (l.taxRate / 100), 0);
      const total = subtotal + tax;
      return [
        `"${inv.number}"`,
        new Date(inv.date).toISOString().split("T")[0],
        new Date(inv.dueDate).toISOString().split("T")[0],
        `"${(inv.client?.name ?? "").replace(/"/g, '""')}"`,
        `"${inv.entity?.name ?? ""}"`,
        inv.status,
        subtotal.toFixed(2),
        tax.toFixed(2),
        total.toFixed(2),
        inv.currency,
      ];
    }),
  ];

  const csv = rows.map((r) => r.join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="invoices-${Date.now()}.csv"`,
    },
  });
}
