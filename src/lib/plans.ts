import { Plan } from "@prisma/client";
import { db } from "@/lib/db";
import { startOfMonth } from "date-fns";

export interface PlanLimits {
  entities: number;
  bankAccounts: number;
  invoicesPerMonth: number;
}

export const PLAN_CONFIGS: Record<Plan, PlanLimits> = {
  [Plan.FREE]: {
    entities: 1,
    bankAccounts: 2,
    invoicesPerMonth: 10,
  },
  [Plan.PRO]: {
    entities: 3,
    bankAccounts: 10,
    invoicesPerMonth: Infinity,
  },
  [Plan.BUSINESS]: {
    entities: Infinity,
    bankAccounts: Infinity,
    invoicesPerMonth: Infinity,
  },
};

export type Feature = "tax" | "analytics" | "reports" | "forecasts" | "apiAccess" | "whiteLabel";

export const FEATURE_ACCESS: Record<Plan, Feature[]> = {
  [Plan.FREE]: [], // No access to these
  [Plan.PRO]: ["tax", "analytics", "reports", "apiAccess"], // Added apiAccess
  [Plan.BUSINESS]: ["tax", "analytics", "reports", "forecasts", "apiAccess", "whiteLabel"], // Added all
};

export function hasFeatureAccess(plan: Plan, feature: Feature): boolean {
  return FEATURE_ACCESS[plan].includes(feature);
}

export function getPlanUpgradeInfo(currentPlan: Plan) {
  if (currentPlan === Plan.FREE) {
    return { label: "Upgrade to Pro", nextTier: Plan.PRO };
  }
  if (currentPlan === Plan.PRO) {
    return { label: "Upgrade to Business", nextTier: Plan.BUSINESS };
  }
  return null;
}

export async function getQuotaUsage(userId: string) {
  const [entities, bankAccounts, monthlyInvoices] = await Promise.all([
    db.entity.count({ where: { userId } }),
    db.bankAccount.count({ where: { entity: { userId } } }),
    db.invoice.count({
      where: {
        entity: { userId },
        createdAt: {
          gte: startOfMonth(new Date()),
        },
      },
    }),
  ]);

  return { entities, bankAccounts, monthlyInvoices };
}

export async function checkQuota(plan: Plan, type: keyof PlanLimits, userId: string) {
  const usage = await getQuotaUsage(userId);
  const limits = PLAN_CONFIGS[plan];
  
  if (type === "entities" && usage.entities >= limits.entities) return false;
  if (type === "bankAccounts" && usage.bankAccounts >= limits.bankAccounts) return false;
  if (type === "invoicesPerMonth" && usage.monthlyInvoices >= limits.invoicesPerMonth) return false;
  
  return true;
}

