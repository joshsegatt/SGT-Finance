import { getCashFlowReport, getCategoryReport, getDashboardKPIs } from "@/lib/data";
import { ReportsTabs } from "@/components/reports/reports-tabs";
import { ExportButton } from "@/components/reports/export-button";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Reports",
  description: "Cash flow reports, category breakdowns and tax exposure analysis.",
};

export default async function ReportsPage() {
  const [cashFlow, categories, kpis, t] = await Promise.all([
    getCashFlowReport(12),
    getCategoryReport(),
    getDashboardKPIs(),
    getTranslations("Reports"),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground mt-1.5">{t("subtitle")}</p>
        </div>
        <ExportButton label={t("export")} />
      </div>

      <ReportsTabs cashFlow={cashFlow} categories={categories} kpis={kpis} />
    </div>
  );
}
