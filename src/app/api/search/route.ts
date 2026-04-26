import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ clients: [], transactions: [], invoices: [] });

  const [clients, transactions, invoices] = await Promise.all([
    db.client.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, email: true, status: true },
      take: 5,
    }),
    db.transaction.findMany({
      where: {
        OR: [
          { description: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { notes: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, description: true, amount: true, currency: true, date: true },
      orderBy: { date: "desc" },
      take: 5,
    }),
    db.invoice.findMany({
      where: {
        OR: [
          { number: { contains: q, mode: "insensitive" } },
          { notes: { contains: q, mode: "insensitive" } },
          { client: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      select: {
        id: true,
        number: true,
        status: true,
        date: true,
        client: { select: { name: true } },
        lines: { select: { amount: true } },
      },
      orderBy: { date: "desc" },
      take: 5,
    }),
  ]);

  return NextResponse.json({ clients, transactions, invoices });
}
