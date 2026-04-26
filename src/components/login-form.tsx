"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("Login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(t("invalidCredentials"));
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError(t("unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card/60 backdrop-blur border-border/50 shadow-2xl relative z-10">
      <CardHeader className="space-y-3 pb-6">
        <div className="w-14 h-14 bg-primary text-primary-foreground rounded-lg flex items-center justify-center mb-2 mx-0 font-bold text-2xl tracking-tighter">
          SGT
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-muted-foreground font-medium">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="admin@sgt.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 h-11"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t("password")}</Label>
              <a href="/forgot-password" className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                {t("forgotPassword")}
              </a>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50 h-11"
            />
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex gap-2 items-center">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full h-11 text-base font-semibold mt-4">
            {loading ? t("authenticating") : t("signIn")}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 border-t border-border/50 pt-6 mt-4">
        <div className="text-sm text-muted-foreground text-center">
          {t("noAccount")}{" "}
          <a href="/register" className="text-primary hover:underline font-medium">
            {t("createOne")}
          </a>
        </div>
        <div className="text-xs font-medium text-muted-foreground flex gap-4">
          <span>{t("secure")}</span>
          <span className="opacity-50">•</span>
          <span>{t("institutional")}</span>
        </div>
      </CardFooter>
    </Card>
  );
}