import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const Schema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["COMPANY", "INDIVIDUAL", "TRUST"]),
  country: z.string().min(2).max(2),
  currency: z.string().min(3).max(3).default("EUR"),
  taxId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const entity = await db.entity.create({
    data: {
      name: parsed.data.name,
      type: parsed.data.type,
      country: parsed.data.country,
      currency: parsed.data.currency,
      taxId: parsed.data.taxId,
    },
  });

  return NextResponse.json(entity, { status: 201 });
}
