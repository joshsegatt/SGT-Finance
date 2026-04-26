"use client";

import { useState } from "react";
import { Check, Zap, Building2, Loader2, ExternalLink, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BillingClientProps {
  plan: string;
  stripeCustomerId: string | null;
  periodEnd: Date | null;
}

type PlanDef = {
  key: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  disabled?: boolean;
};

const PLANS: PlanDef[] = [
  {
    key: "FREE",
    name: "Free",
    price: 0,
    description: "Para começar e explorar",
    features: ["1 entidade", "1 conta bancária", "10 faturas/mês", "100 transações"],
    cta: "Plano atual",
    disabled: true,
  },
  {
    key: "PRO",
    name: "Pro",
    price: 29,
    description: "Para freelancers e PMEs",
    features: ["10 entidades", "5 contas bancárias", "Faturas ilimitadas", "Transações ilimitadas", "Open Banking", "Relatórios avançados"],
    cta: "Upgrade para Pro",
    popular: true,
  },
  {
    key: "BUSINESS",
    name: "Business",
    price: 79,
    description: "Para empresas em crescimento",
    features: ["Entidades ilimitadas", "Bancos ilimitados", "Tudo do Pro", "Multi-utilizador (em breve)", "API access (em breve)", "Suporte prioritário"],
    cta: "Upgrade para Business",
  },
];

export function BillingClient({ plan, stripeCustomerId, periodEnd }: BillingClientProps) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(planKey: string) {
    setLoading(planKey);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao iniciar checkout");
    } finally {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Current plan status */}
      {stripeCustomerId && periodEnd && (
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Plano {plan}</p>
              <p className="text-xs text-muted-foreground">
                Renova em {new Date(periodEnd).toLocaleDateString("pt-PT")}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePortal}
            disabled={loading === "portal"}
            className="gap-2"
          >
            {loading === "portal" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ExternalLink className="w-3.5 h-3.5" />
            )}
            Gerir billing
          </Button>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((p) => {
          const isCurrent = plan === p.key;
          const isLoading = loading === p.key;

          return (
            <div
              key={p.key}
              className={cn(
                "relative rounded-2xl border p-6 flex flex-col gap-5 transition-all",
                p.popular
                  ? "border-primary shadow-lg shadow-primary/10 bg-card"
                  : "border-border bg-card",
                isCurrent && "ring-2 ring-primary"
              )}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full tracking-wide uppercase">
                    Popular
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1">
                  {p.key === "FREE" && <Zap className="w-4 h-4 text-muted-foreground" />}
                  {p.key === "PRO" && <Zap className="w-4 h-4 text-primary" />}
                  {p.key === "BUSINESS" && <Building2 className="w-4 h-4 text-foreground" />}
                  <p className="text-sm font-bold text-foreground">{p.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">{p.description}</p>
              </div>

              <div className="flex items-end gap-1">
                <span className="text-3xl font-extrabold text-foreground">${p.price}</span>
                {p.price > 0 && (
                  <span className="text-xs text-muted-foreground mb-1">/mês</span>
                )}
              </div>

              <ul className="space-y-2 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={p.popular ? "default" : "outline"}
                disabled={isCurrent || isLoading || p.key === "FREE"}
                onClick={() => !isCurrent && p.key !== "FREE" && handleUpgrade(p.key)}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isCurrent ? (
                  "Plano atual"
                ) : (
                  p.cta
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
