"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } finally {
      setLoading(false);
      setSubmitted(true); // always show success to prevent enumeration
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 text-white rounded-xl flex items-center justify-center font-bold tracking-tighter text-sm shadow-lg shadow-primary/30">
            SGT
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Reset password</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {submitted
                ? "Check your inbox"
                : "Enter your email to receive reset instructions"}
            </p>
          </div>
        </div>

        {submitted ? (
          /* Success state */
          <div className="bg-card border border-border rounded-xl p-6 shadow-md text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Email sent</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                If an account exists for <span className="font-medium text-foreground">{email}</span>,
                you will receive instructions shortly.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to login
            </Link>
          </div>
        ) : (
          /* Form */
          <div className="bg-card border border-border rounded-xl p-6 shadow-md space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="admin@sgt.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
