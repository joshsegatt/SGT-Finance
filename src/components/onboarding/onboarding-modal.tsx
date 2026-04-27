"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Landmark, ChevronRight, Check, Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface OnboardingModalProps {
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

type Step = 0 | 1 | 2 | 3;
const STEPS = ["Welcome", "Entity", "Bank", "Ready"];

export function OnboardingModal({ userName, isOpen, onClose }: OnboardingModalProps) {
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
      if (!res.ok) throw new Error("Failed to create entity");
      setStep(2);
    } catch {
      alert("Could not create entity. Please try again.");
    } finally {
      setCreatingEntity(false);
    }
  }

  function handleComplete() {
    startTransition(async () => {
      await fetch("/api/onboarding/complete", { method: "POST" });
      onClose();
      router.refresh();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-card shadow-2xl">
        <div className="relative">
          {/* Decorative Header */}
          <div className="h-32 bg-gradient-to-br from-primary/20 via-blue-500/10 to-transparent relative">
            <div className="absolute top-6 left-1/2 -translate-x-1/2">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 ring-4 ring-background">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </div>

          <div className="px-8 pb-8 pt-2">
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mb-6">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === step ? "w-6 bg-primary" : "w-1.5 bg-muted"
                  )} 
                />
              ))}
            </div>

            {/* Steps */}
            <div className="space-y-6">
              {step === 0 && (
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl font-bold text-foreground">Welcome to SGT Finance</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Let's get your workspace ready in 2 simple steps. Ready to start?
                  </p>
                  <Button className="w-full mt-8 group" onClick={() => setStep(1)}>
                    Let's Go <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Initial Setup</h2>
                    <p className="text-xs text-muted-foreground mt-1">Create your first entity to start tracking.</p>
                  </div>
                  <div className="space-y-3">
                    <input
                      value={entityName}
                      onChange={(e) => setEntityName(e.target.value)}
                      placeholder="Company Name"
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={entityType}
                        onChange={(e) => setEntityType(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none"
                      >
                        <option value="COMPANY">Company</option>
                        <option value="INDIVIDUAL">Individual</option>
                      </select>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none"
                      >
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={handleCreateEntity}
                    disabled={!entityName.trim() || creatingEntity}
                  >
                    {creatingEntity ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Continue"}
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                   <div>
                    <h2 className="text-lg font-bold text-foreground">Connect Bank</h2>
                    <p className="text-xs text-muted-foreground mt-1">Import your transactions automatically.</p>
                  </div>
                  <div className="grid gap-3">
                    <Button 
                      variant="outline" 
                      className="h-20 justify-start px-4 border-dashed hover:border-primary/50 hover:bg-primary/5"
                      onClick={() => {
                        window.location.href = "/accounts?connect=true";
                      }}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <Landmark className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold">Connect your bank</p>
                        <p className="text-[10px] text-muted-foreground">TrueLayer / SaltEdge Secure Sync</p>
                      </div>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-muted-foreground text-xs"
                      onClick={() => setStep(3)}
                    >
                      I'll do this later
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 text-emerald-500" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-foreground">You're all set!</h2>
                    <p className="text-sm text-muted-foreground">Welcome aboard. Your dashboard is ready.</p>
                  </div>
                  <Button className="w-full mt-4" onClick={handleComplete} disabled={isPending}>
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Go to Dashboard"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
