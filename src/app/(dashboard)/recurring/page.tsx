import { getSubscriptions } from "@/lib/data";
import { SubscriptionsView } from "@/components/recurring/subscriptions-view";
import { formatCurrency } from "@/lib/format";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Recurring",
  description: "Monitor subscriptions, detect unused services and control recurring spend.",
};

export default async function RecurringPage() {
  const [subscriptions, t] = await Promise.all([
    getSubscriptions(),
    getTranslations("Recurring"),
  ]);

  const monthly = subscriptions
    .filter((s) => s.status === "ACTIVE" || s.status === "AT_RISK")
    .reduce((sum, s) => {
      if (s.interval === "MONTHLY") return sum + s.amount;
      if (s.interval === "ANNUAL") return sum + s.amount / 12;
      return sum;
    }, 0);

  const annual = monthly * 12;
  const wasteCount = subscriptions.filter((s) => s.wasteDetected).length;
  const wasteAmount = subscriptions
    .filter((s) => s.wasteDetected)
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground mt-1.5">
          {subscriptions.length} {subscriptions.length !== 1 ? t("subtitlePlural") : t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: t("monthlySpend"), value: formatCurrency(monthly), sub: t("activeSubs") },
          { label: t("annualProjection"), value: formatCurrency(annual), sub: t("ifUnchanged") },
          { label: t("wasteDetected"), value: `${wasteCount}`, sub: t("flaggedSubs"), highlight: wasteCount > 0 },
          { label: t("wasteValue"), value: formatCurrency(wasteAmount), sub: t("perMonth"), highlight: wasteAmount > 0 },
        ].map((k) => (
          <div key={k.label} className="bg-card/80 rounded-xl border border-border p-5 shadow-sm">
            <div className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">{k.label}</div>
            <div className={`text-2xl font-bold ${k.highlight ? "text-amber-400" : "text-foreground"}`}>{k.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      <SubscriptionsView subscriptions={subscriptions} />
    </div>
  );
}
