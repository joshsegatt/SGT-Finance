import { getTransactions, getTransactionCategories, getBankAccounts, getInvoices } from "@/lib/data";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Transactions",
  description: "Browse, categorise and export all bank transactions across your accounts.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TransactionsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const [result, categories, accounts, invoices, t] = await Promise.all([
    getTransactions(userId, {
      search: params.search,
      category: params.category,
      status: params.status,
      accountId: params.accountId,
      from: params.from,
      to: params.to,
      sort: params.sort,
      order: params.order,
      page,
    }),
    getTransactionCategories(userId),
    getBankAccounts(userId),
    getInvoices(userId, {}), // Fetch all for reconciliation
    getTranslations("Transactions"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground mt-1.5">
          {result.total} {result.total !== 1 ? t("subtitlePlural") : t("subtitle")}
        </p>
      </div>
      <TransactionsTable
        transactions={result.items}
        categories={categories}
        accounts={accounts.map((a) => ({ id: a.id, name: a.name }))}
        invoices={invoices}
        pagination={{ page: result.page, totalPages: result.totalPages, total: result.total }}
      />
    </div>
  );
}

