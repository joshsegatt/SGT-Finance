import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { BillingClient } from "@/components/settings/billing-client";
import { CreditCard } from "lucide-react";

export const metadata = {
  title: "Billing",
  description: "Manage your subscription and billing.",
};

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      plan: true,
      stripeCustomerId: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Billing & Planos</h1>
          <p className="text-xs text-muted-foreground">Gerencie a sua subscrição</p>
        </div>
      </div>

      <BillingClient
        plan={user.plan}
        stripeCustomerId={user.stripeCustomerId}
        periodEnd={user.stripeCurrentPeriodEnd}
      />
    </div>
  );
}
