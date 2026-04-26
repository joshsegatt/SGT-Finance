"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "loading" | "success" | "error";

interface Result {
  accountsCreated: number;
  institution: string;
}

export default function SaltEdgeCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const connectionId = searchParams.get("connection_id");
    const entityId = searchParams.get("entityId");
    const seError = searchParams.get("error");

    if (seError) {
      setError(seError);
      setStatus("error");
      return;
    }

    if (!connectionId || !entityId) {
      setError("Missing parameters. Please try connecting again.");
      setStatus("error");
      return;
    }

    fetch(
      `/api/banks/saltedge/callback?connection_id=${encodeURIComponent(connectionId)}&entityId=${encodeURIComponent(entityId)}`
    )
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Callback failed");
        setResult(data);
        setStatus("success");
      })
      .catch((err) => {
        setError(err.message ?? "Something went wrong");
        setStatus("error");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 text-white rounded-xl flex items-center justify-center font-bold tracking-tighter text-sm shadow-lg shadow-primary/30">
            SGT
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-md space-y-5">
          {status === "loading" && (
            <>
              <div className="flex justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Connecting your bank</p>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Fetching accounts and balances via Salt Edge…
                </p>
              </div>
            </>
          )}

          {status === "success" && result && (
            <>
              <div className="flex justify-center">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Bank connected!</p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  <span className="font-medium text-foreground">{result.institution}</span> —{" "}
                  {result.accountsCreated} account
                  {result.accountsCreated !== 1 ? "s" : ""} imported successfully.
                </p>
              </div>
              <Button className="w-full" onClick={() => router.push("/accounts")}>
                View Accounts
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center">
                <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center">
                  <XCircle className="w-7 h-7 text-red-500" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Connection failed</p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{error}</p>
              </div>
              <Button variant="ghost" className="w-full" onClick={() => router.push("/accounts")}>
                Back to Accounts
              </Button>
            </>
          )}
        </div>

        {status === "loading" && (
          <p className="text-xs text-muted-foreground">This may take a few seconds…</p>
        )}
      </div>
    </div>
  );
}
