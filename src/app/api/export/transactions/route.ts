import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const p = req.nextUrl.searchParams;
  const search = p.get("search") ?? undefined;
  const category = p.get("category") ?? undefined;
  const status = p.get("status") ?? undefined;
  const accountId = p.get("accountId") ?? undefined;
  const from = p.get("from") ?? undefined;
  const to = p.get("to") ?? undefined;

  const transactions = await db.transaction.findMany({
    where: {
      ...(search ? { description: { contains: search, mode: "insensitive" } } : {}),
      ...(category && category !== "all" ? { category } : {}),
      ...(status && status !== "all" ? { status } : {}),
      ...(accountId && accountId !== "all" ? { accountId } : {}),
      ...(from || to
        ? {
            date: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to + "T23:59:59.999Z") } : {}),
            },
          }
        : {}),
    },
    include: { account: { include: { entity: true } } },
    orderBy: { date: "desc" },
  });

  const rows = [
    ["Date", "Description", "Account", "Entity", "Category", "Status", "Amount", "Currency"],
    ...transactions.map((tx) => [
      new Date(tx.date).toISOString().split("T")[0],
      `"${tx.description.replace(/"/g, '""')}"`,
      `"${tx.account.name}"`,
      `"${tx.account.entity.name}"`,
      tx.category ?? "",
      tx.status,
      tx.amount.toFixed(2),
      tx.currency,
    ]),
  ];

  const csv = rows.map((r) => r.join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="transactions-${Date.now()}.csv"`,
    },
  });
}
