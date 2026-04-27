import { getAccounts, getEntities } from "@/lib/data";
import { AccountsView } from "@/components/accounts/accounts-view";
import { formatCurrency } from "@/lib/format";
import { getTranslations } from "next-intl/server";
import { ConnectBankButton } from "@/components/accounts/connect-bank-button";
import { getFxRates } from "@/lib/fx";

export const metadata = {
  title: "Accounts",
  description: "Connected bank accounts, balances and sync status.",
};

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [accounts, t, entities, fx] = await Promise.all([
    getAccounts(userId),
    getTranslations("Accounts"),
    getEntities(userId),
    getFxRates(),
  ]);

  const totalGBP = accounts.reduce(
    (sum, a) => sum + a.balance * (fx[a.currency] ?? 1),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground mt-1.5">
            {accounts.length} {accounts.length !== 1 ? t("subtitlePlural") : t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t("totalGBP")}</div>
            <div className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalGBP)}</div>
          </div>
          <ConnectBankButton entities={entities.map((e) => ({ id: e.id, name: e.name, country: e.country }))} />
        </div>
      </div>

      <AccountsView accounts={accounts} />
    </div>
  );
}
