import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(_req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id as string;

  // Delete all user data in safe order (cascade handles most, but explicit for clarity)
  await db.$transaction(async (tx) => {
    // Remove bank connections owned by user entities
    const entities = await tx.entity.findMany({
      where: {
        bankAccounts: {
          some: {},
        },
      },
      select: { id: true },
    });

    const entityIds = entities.map((e) => e.id);

    // Delete transactions → bank accounts → connections
    await tx.transaction.deleteMany({
      where: { account: { entityId: { in: entityIds } } },
    });
    await tx.bankAccount.deleteMany({
      where: { entityId: { in: entityIds } },
    });

    // Delete invoices, clients, entities, tax profiles
    await tx.invoiceLine.deleteMany({
      where: { invoice: { entityId: { in: entityIds } } },
    });
    await tx.invoice.deleteMany({ where: { entityId: { in: entityIds } } });
    await tx.taxProfile.deleteMany({ where: { entityId: { in: entityIds } } });
    await tx.entity.deleteMany({ where: { id: { in: entityIds } } });

    // Delete auth sessions and user
    await tx.session.deleteMany({ where: { userId } });
    await tx.account.deleteMany({ where: { userId } });
    await tx.user.delete({ where: { id: userId } });
  });

  return NextResponse.json({ ok: true });
}
