import { getCashFlowReport, getCategoryReport, getDashboardKPIs } from "@/lib/data";
import { ReportsTabs } from "@/components/reports/reports-tabs";
import { ExportButton } from "@/components/reports/export-button";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Reports",
  description: "Cash flow reports, category breakdowns and tax exposure analysis.",
};

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasFeatureAccess } from "@/lib/plans";
import { UpgradeRequired } from "@/components/upgrade-required";
import { Plan } from "@prisma/client";

export default async function ReportsPage() {
  const session = await auth();
  const user = session?.user?.id ? await db.user.findUnique({ where: { id: session.user.id } }) : null;
  const currentPlan = user?.plan ?? Plan.FREE;

  if (!hasFeatureAccess(currentPlan, "reports")) {
    return <UpgradeRequired plan={currentPlan} />;
  }

  const [cashFlow, categories, kpis, t] = await Promise.all([
    getCashFlowReport(user!.id, 12),
    getCategoryReport(user!.id),
    getDashboardKPIs(user!.id),
    getTranslations("Reports"),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground mt-1.5">{t("subtitle")}</p>
        </div>
        {currentPlan === Plan.BUSINESS && (
          <ExportButton label={t("export")} />
        )}
      </div>

      <ReportsTabs cashFlow={cashFlow} categories={categories} kpis={kpis} />
    </div>
  );
}
