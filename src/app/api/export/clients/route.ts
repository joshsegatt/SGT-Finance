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
  const status = p.get("status") ?? undefined;

  const clients = await db.client.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      ...(status && status !== "all" ? { status: status as "ACTIVE" | "INACTIVE" | "PROSPECT" } : {}),
    },
    include: {
      entities: { select: { name: true } },
      invoices: { select: { id: true } },
    },
    orderBy: { name: "asc" },
  });

  const rows = [
    ["Name", "Email", "Phone", "Status", "Entities", "Invoice Count"],
    ...clients.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      c.email ? `"${c.email}"` : "",
      c.phone ? `"${c.phone}"` : "",
      c.status,
      `"${c.entities.map((e) => e.name).join("; ")}"`,
      String(c.invoices.length),
    ]),
  ];

  const csv = rows.map((r) => r.join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="clients-${Date.now()}.csv"`,
    },
  });
}
