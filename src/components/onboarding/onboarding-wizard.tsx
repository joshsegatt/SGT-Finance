"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, Landmark, ChevronRight, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Step = 0 | 1 | 2 | 3;

const STEPS = ["Bem-vindo", "Entidade", "Banco", "Pronto"];

interface OnboardingWizardProps {
  userName: string;
}

export function OnboardingWizard({ userName }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [entityName, setEntityName] = useState("");
  const [entityType, setEntityType] = useState("COMPANY");
  const [entityCountry, setEntityCountry] = useState("PT");
  const [currency, setCurrency] = useState("EUR");
  const [isPending, startTransition] = useTransition();
  const [creatingEntity, setCreatingEntity] = useState(false);

  async function handleCreateEntity() {
    if (!entityName.trim()) return;
    setCreatingEntity(true);
    try {
      const res = await fetch("/api/entities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: entityName, type: entityType, country: entityCountry, currency }),
      });
      if (!res.ok) throw new Error("Erro ao criar entidade");
      setStep(2);
    } catch {
      alert("Não foi possível criar a entidade. Tente novamente.");
    } finally {
      setCreatingEntity(false);
    }
  }

  function handleComplete() {
    startTransition(async () => {
      await fetch("/api/onboarding/complete", { method: "POST" });
      router.push("/");
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
              <rect x="2" y="16" width="4" height="10" rx="1.2" fill="white" fillOpacity="0.5"/>
              <rect x="9" y="11" width="4" height="15" rx="1.2" fill="white" fillOpacity="0.75"/>
              <rect x="16" y="6" width="4" height="20" rx="1.2" fill="white"/>
              <path d="M4 12 L11 8 L18 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.9"/>
              <circle cx="18" cy="4" r="1.5" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                i < step ? "bg-primary text-white" :
                i === step ? "bg-primary text-white ring-4 ring-primary/20" :
                "bg-muted text-muted-foreground"
              )}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("w-10 h-0.5 rounded", i < step ? "bg-primary" : "bg-muted")} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">

          {/* Step 0 — Welcome */}
          {step === 0 && (
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-2">
                  <Sparkles className="w-3 h-3" /> Bem-vindo ao Dashboard
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  Olá{userName ? `, ${userName.split(" ")[0]}` : ""}! 👋
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Em 2 passos rápidos o seu espaço de trabalho estará pronto. Vamos configurar a sua primeira entidade e conta bancária.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: "🏢", label: "Entidade" },
                  { icon: "🏦", label: "Banco" },
                  { icon: "📊", label: "Dashboard" },
                ].map((item) => (
                  <div key={item.label} className="bg-muted/50 rounded-xl p-3">
                    <div className="text-xl mb-1">{item.icon}</div>
                    <p className="text-xs font-medium text-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full" onClick={() => setStep(1)}>
                Começar <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Step 1 — Create Entity */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">Criar entidade</h2>
                <p className="text-xs text-muted-foreground mt-1">A entidade representa a sua empresa ou perfil pessoal.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">Nome</label>
                  <input
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    placeholder="Ex: Segatt Labs Lda"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">Tipo</label>
                    <select
                      value={entityType}
                      onChange={(e) => setEntityType(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="COMPANY">Empresa</option>
                      <option value="INDIVIDUAL">Individual</option>
                      <option value="TRUST">Trust</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">Moeda</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="EUR">EUR €</option>
                      <option value="USD">USD $</option>
                      <option value="GBP">GBP £</option>
                      <option value="CHF">CHF ₣</option>
                      <option value="BRL">BRL R$</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">País</label>
                  <select
                    value={entityCountry}
                    onChange={(e) => setEntityCountry(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="PT">Portugal</option>
                    <option value="BR">Brasil</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="CH">Switzerland</option>
                    <option value="US">United States</option>
                  </select>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleCreateEntity}
                disabled={!entityName.trim() || creatingEntity}
              >
                {creatingEntity ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Criar entidade <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Step 2 — Connect Bank */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">Conectar banco</h2>
                <p className="text-xs text-muted-foreground mt-1">Importe transações reais automaticamente. Pode fazer isto mais tarde.</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push("/accounts?connect=true")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Landmark className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Conectar banco agora</p>
                    <p className="text-xs text-muted-foreground mt-0.5">TrueLayer ou Salt Edge — 5000+ bancos</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
                </button>

                <button
                  onClick={() => setStep(3)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-dashed border-border hover:border-primary/30 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Fazer mais tarde</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Pode conectar em Contas → Adicionar banco</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Done */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">Tudo pronto!</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  O seu espaço de trabalho está configurado. Explore o dashboard e descubra todas as funcionalidades.
                </p>
              </div>
              <Button className="w-full" onClick={handleComplete} disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Ir para o Dashboard
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Pode alterar tudo isto mais tarde em Definições
        </p>
      </div>
    </div>
  );
}
