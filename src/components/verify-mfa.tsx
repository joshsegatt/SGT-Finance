"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { completeMfaLogin } from "@/lib/actions";

interface VerifyMfaProps {
  userId: string;
  onSuccess: (token: string) => void;
  onCancel: () => void;
}

export function VerifyMfa({ userId, onSuccess, onCancel }: VerifyMfaProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (code.length !== 6) return setError("Enter a 6-digit code");

    startTransition(async () => {
      const res = await completeMfaLogin(userId, code) as any;
      if (res.success && res.mfaToken) {
        onSuccess(res.mfaToken);
      } else {
        setError(res.error || "Invalid code");
      }
    });
  }

  return (
    <Card className="w-full max-w-md bg-card/60 backdrop-blur border-border/50 shadow-2xl relative z-10">
      <CardHeader className="space-y-3 pb-6">
        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-2 mx-0">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Two-Factor Auth</CardTitle>
        <CardDescription className="text-muted-foreground font-medium">
          Enter the 6-digit code sent to your email to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="code">Security Code</Label>
            <Input
              id="code"
              placeholder="000000"
              className="bg-background/50 h-12 text-center text-2xl tracking-[0.5em] font-bold"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex gap-2 items-center">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button type="submit" disabled={isPending || code.length !== 6} className="w-full h-11 text-base font-semibold">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Verify & Log In
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel} className="w-full text-muted-foreground">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
