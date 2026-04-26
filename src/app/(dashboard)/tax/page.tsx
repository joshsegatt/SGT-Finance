import { getTaxSummary, getEntities } from "@/lib/data";
import { TaxComplianceView } from "@/components/tax/tax-compliance-view";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Tax",
  description: "Tax deadlines, VAT profiles and corporate tax exposure.",
};

interface PageProps {
  searchParams: Promise<{ entityId?: string }>;
}

export default async function TaxPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [entities, allEntities, t] = await Promise.all([
    getTaxSummary(),
    getEntities(),
    getTranslations("Tax"),
  ]);

  const filtered = params.entityId
    ? entities.filter((e) => e.id === params.entityId)
    : entities;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground mt-1.5">{t("subtitle")}</p>
      </div>
      <TaxComplianceView
        entities={filtered}
        allEntities={allEntities}
        selectedEntityId={params.entityId}
      />
    </div>
  );
}


