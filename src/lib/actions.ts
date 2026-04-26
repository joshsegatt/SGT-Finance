"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import type { Role } from "@prisma/client";

// ─── Auth helpers ──────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

const WRITE_ROLES: Role[] = ["ADMIN", "ADVISOR", "FINANCE_MANAGER"];

async function requireWriteAccess() {
  const session = await requireAuth();
  if (!WRITE_ROLES.includes(session.user.role)) {
    throw new Error("Insufficient permissions");
  }
  return session;
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export async function updateTransactionCategory(id: string, category: string) {
  await requireWriteAccess();

  await db.transaction.update({ where: { id }, data: { category } });
  revalidatePath("/transactions");
}

export async function updateTransactionNotes(id: string, notes: string) {
  await requireAuth(); // Notes can be edited by any authenticated user

  await db.transaction.update({ where: { id }, data: { notes } });
  revalidatePath("/transactions");
}

// ─── Invoices ────────────────────────────────────────────────────────────────

const InvoiceLineSchema = z.object({
  description: z.string().min(1),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().positive(),
  taxRate: z.coerce.number().min(0).max(100),
});

const CreateInvoiceSchema = z.object({
  clientId: z.string().min(1),
  entityId: z.string().min(1),
  number: z.string().min(1),
  date: z.string().min(1),
  dueDate: z.string().min(1),
  currency: z.string().min(1),
  notes: z.string().optional(),
  lines: z.array(InvoiceLineSchema).min(1),
});

export async function createInvoice(raw: unknown) {
  await requireWriteAccess();

  const data = CreateInvoiceSchema.parse(raw);

  const lines = data.lines.map((l) => ({
    description: l.description,
    quantity: l.quantity,
    unitPrice: l.unitPrice,
    amount: l.quantity * l.unitPrice,
    taxRate: l.taxRate,
  }));

  const invoice = await db.invoice.create({
    data: {
      clientId: data.clientId,
      entityId: data.entityId,
      number: data.number,
      date: new Date(data.date),
      dueDate: new Date(data.dueDate),
      currency: data.currency,
      notes: data.notes ?? null,
      status: "DRAFT",
      lines: { create: lines },
    },
  });

  revalidatePath("/invoices");
  return invoice;
}

export async function updateInvoiceStatus(id: string, status: string) {
  await requireWriteAccess();

  const validStatuses = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"];
  if (!validStatuses.includes(status)) throw new Error("Invalid status");

  await db.invoice.update({ where: { id }, data: { status } });
  revalidatePath("/invoices");
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export async function cancelSubscription(id: string) {
  await requireWriteAccess();

  await db.subscription.update({ where: { id }, data: { status: "CANCELLED" } });
  revalidatePath("/recurring");
}

// ─── Accounts ────────────────────────────────────────────────────────────────

export async function syncBankAccount(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const bankAccount = await db.bankAccount.findUnique({
    where: { id },
    include: { connection: true },
  });

  if (!bankAccount) throw new Error("Account not found");

  const tlAccountId = bankAccount.externalId;

  if (!tlAccountId) {
    // Mock account — just bump lastSync
    if (bankAccount.bankConnectionId) {
      await db.bankConnection.update({
        where: { id: bankAccount.bankConnectionId },
        data: { lastSync: new Date() },
      });
    }
    revalidatePath("/accounts");
    return { synced: 0 };
  }

  // Real TrueLayer sync
  const connection = bankAccount.connection;
  if (!connection?.accessToken) {
    revalidatePath("/accounts");
    return { synced: 0 };
  }

  const { getTransactions, getBalance, refreshAccessToken, tlAutoCategory } =
    await import("@/lib/truelayer");

  let accessToken = connection.accessToken;
  if (connection.refreshToken) {
    try {
      const newTokens = await refreshAccessToken(connection.refreshToken);
      accessToken = newTokens.access_token;
      await db.bankConnection.update({
        where: { id: connection.id },
        data: { accessToken: newTokens.access_token, refreshToken: newTokens.refresh_token },
      });
    } catch { /* continue with existing token */ }
  }

  const [transactions, balanceData] = await Promise.all([
    getTransactions(accessToken, tlAccountId),
    getBalance(accessToken, tlAccountId),
  ]);

  let synced = 0;

  for (const tx of transactions) {
    const externalId = tx.transaction_id;
    if (!externalId) continue;

    const amount = tx.amount;
    const currency = tx.currency;
    const description = tx.description;
    const date = new Date(tx.timestamp);
    const category = tlAutoCategory(tx.transaction_category, tx.description);

    await db.transaction.upsert({
      where: { accountId_externalId: { accountId: bankAccount.id, externalId } },
      create: { accountId: bankAccount.id, externalId, date, amount, currency, description, category, status: "COMPLETED" },
      update: { amount, description, date },
    });
    synced++;
  }

  await db.bankAccount.update({ where: { id }, data: { balance: balanceData.current } });

  if (bankAccount.bankConnectionId) {
    await db.bankConnection.update({
      where: { id: bankAccount.bankConnectionId },
      data: { lastSync: new Date(), status: "ACTIVE" },
    });
  }

  revalidatePath("/accounts");
  revalidatePath("/transactions");
  return { synced };
}

// ─── Alerts ──────────────────────────────────────────────────────────────────

export async function markAlertRead(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await db.alert.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/");
}

export async function markAllAlertsRead() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await db.alert.updateMany({ where: { isRead: false }, data: { isRead: true } });
  revalidatePath("/");
}


const UpdateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export async function updateUserProfile(raw: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = UpdateProfileSchema.parse(raw);

  await db.user.update({
    where: { id: session.user.id },
    data: { name: data.name },
  });

  revalidatePath("/settings");
  return { success: true };
}

// ─── Locale ───────────────────────────────────────────────────────────────────

const SUPPORTED_LOCALES = ["en", "pt", "fr"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

export async function setLocale(locale: string) {
  const valid: Locale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as Locale)
    : "en";
  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", valid, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}

// ─── Clients ─────────────────────────────────────────────────────────────────

const CreateClientSchema = z.object({
  name: z.string().min(2).max(120),
  contactName: z.string().max(120).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).default("ACTIVE"),
});

export async function createClient(raw: unknown) {
  await requireWriteAccess();
  const data = CreateClientSchema.parse(raw);
  const client = await db.client.create({
    data: {
      name: data.name,
      contactName: data.contactName || null,
      email: data.email || null,
      phone: data.phone || null,
      status: data.status,
    },
  });
  revalidatePath("/clients");
  return client;
}

export async function updateClientStatus(id: string, status: string) {
  await requireWriteAccess();
  const validStatuses = ["ACTIVE", "INACTIVE", "ARCHIVED"];
  if (!validStatuses.includes(status)) throw new Error("Invalid status");
  await db.client.update({ where: { id }, data: { status } });
  revalidatePath("/clients");
}

// ─── Tax Deadlines ────────────────────────────────────────────────────────────

export async function updateDeadlineStatus(id: string, status: string) {
  await requireWriteAccess();
  const validStatuses = ["UPCOMING", "COMPLETED", "OVERDUE"];
  if (!validStatuses.includes(status)) throw new Error("Invalid status");
  await db.taxDeadline.update({ where: { id }, data: { status } });
  revalidatePath("/tax");
}

// ─── User Avatar ──────────────────────────────────────────────────────────────

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB

export async function updateUserAvatar(dataUrl: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if (!dataUrl.startsWith("data:image/")) throw new Error("Invalid image");
  const base64 = dataUrl.split(",")[1] ?? "";
  if (Buffer.from(base64, "base64").length > MAX_AVATAR_BYTES) {
    throw new Error("Image too large (max 2 MB)");
  }
  await db.user.update({
    where: { id: session.user.id },
    data: { image: dataUrl },
  });
  revalidatePath("/settings");
  return { success: true };
}
