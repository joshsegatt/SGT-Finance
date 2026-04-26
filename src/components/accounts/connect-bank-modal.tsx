"use client";

import { useState, useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building2, ChevronRight, Globe, Loader2 } from "lucide-react";

interface Entity {
  id: string;
  name: string;
  country: string;
}

interface ConnectBankModalProps {
  open: boolean;
  onClose: () => void;
  entities: Entity[];
}

type Step = "entity" | "provider" | "redirecting";
type Provider = "truelayer" | "saltedge";

export function ConnectBankModal({ open, onClose, entities }: ConnectBankModalProps) {
  const [step, setStep] = useState<Step>("entity");
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("ConnectBank");

  useEffect(() => {
    if (open) {
      setStep("entity");
      setSelectedEntity(null);
    }
  }, [open]);

  function handleEntitySelect(entity: Entity) {
    setSelectedEntity(entity);
    setStep("provider");
  }

  function handleProviderSelect(provider: Provider) {
    if (!selectedEntity) return;
    setStep("redirecting");
    const endpoint =
      provider === "saltedge" ? "/api/banks/saltedge/connect" : "/api/banks/connect";
    startTransition(async () => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityId: selectedEntity.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? t("failed"));
        window.location.href = data.link;
      } catch (err) {
        alert(err instanceof Error ? err.message : t("failed"));
        setStep("provider");
      }
    });
  }

  const stepDesc: Record<Step, string> = {
    entity: t("selectEntity"),
    provider: t("selectProvider"),
    redirecting: t("redirectingDesc"),
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5 text-white" />
            </div>
            <DialogTitle className="text-base">{t("title")}</DialogTitle>
          </div>
          <DialogDescription className="text-xs">{stepDesc[step]}</DialogDescription>
        </DialogHeader>

        {/* Step: Entity */}
        {step === "entity" && (
          <div className="space-y-2 mt-2">
            {entities.map((entity) => (
              <button
                key={entity.id}
                onClick={() => handleEntitySelect(entity)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{entity.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{entity.country}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
            {entities.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">{t("noEntities")}</p>
            )}
          </div>
        )}

        {/* Step: Provider */}
        {step === "provider" && (
          <div className="space-y-2 mt-2">
            <button
              onClick={() => handleProviderSelect("truelayer")}
              disabled={isPending}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left disabled:opacity-50"
            >
              <div className="w-9 h-9 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">TrueLayer</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("truelayerDesc")}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
            <button
              onClick={() => handleProviderSelect("saltedge")}
              disabled={isPending}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left disabled:opacity-50"
            >
              <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950 rounded-lg flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Salt Edge</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("saltedgeDesc")}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          </div>
        )}

        {/* Step: Redirecting */}
        {step === "redirecting" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{t("openingTitle")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("openingDesc")}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
