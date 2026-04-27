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

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasFeatureAccess } from "@/lib/plans";
import { UpgradeRequired } from "@/components/upgrade-required";
import { Plan } from "@prisma/client";

export default async function TaxPage({ searchParams }: PageProps) {
  const session = await auth();
  const user = session?.user?.id ? await db.user.findUnique({ where: { id: session.user.id } }) : null;
  const currentPlan = user?.plan ?? Plan.FREE;

  if (!hasFeatureAccess(currentPlan, "tax")) {
    return <UpgradeRequired plan={currentPlan} />;
  }

  const params = await searchParams;
  const [entities, allEntities, t] = await Promise.all([
    getTaxSummary(user!.id),
    getEntities(user!.id),
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


