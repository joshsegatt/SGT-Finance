"use client";

import { useState, useTransition } from "react";
import { Shield, ShieldCheck, ShieldAlert, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MfaSetupProps {
  isEnabled: boolean;
}

export function MfaSetup({ isEnabled }: MfaSetupProps) {
  const [isPending, startTransition] = useTransition();
  const [enabled, setEnabled] = useState(isEnabled);

  function handleToggle() {
    startTransition(async () => {
      try {
        const res = await fetch("/api/user/mfa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: !enabled }),
        });
        if (!res.ok) throw new Error("Failed to update MFA");
        setEnabled(!enabled);
      } catch {
        alert("Failed to update MFA settings.");
      }
    });
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-6 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            enabled ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
          )}>
            {enabled ? <ShieldCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Multi-Factor Authentication (MFA)</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security to your account.</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/40">
          <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Email Verification</p>
            <p className="text-xs text-muted-foreground mt-1">
              When you log in, we'll send a 6-digit security code to your email address to verify your identity.
            </p>
          </div>
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              checked={enabled}
              onChange={handleToggle}
              disabled={isPending}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
          </div>
        </div>

        {enabled && (
          <div className="flex items-center gap-2 text-[11px] text-emerald-500 font-medium">
            <ShieldCheck className="w-3 h-3" />
            MFA is active. Your account is protected.
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-muted/20 border-t border-border/60 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          {enabled ? "Disable to use password only (not recommended)" : "Enable to secure your login"}
        </p>
        <Button 
          variant={enabled ? "outline" : "default"} 
          size="sm" 
          onClick={handleToggle}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
          {enabled ? "Disable MFA" : "Enable MFA"}
        </Button>
      </div>
    </div>
  );
}
