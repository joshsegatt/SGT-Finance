"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

/** Catches errors that bubble past all nested error.tsx boundaries */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-background font-sans">
        <div className="flex flex-col items-center gap-6 text-center px-4 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-foreground">Critical Error</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {error.message || "An unexpected error occurred."}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground/50 font-mono">
                {error.digest}
              </p>
            )}
          </div>
          <Button onClick={reset} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reload
          </Button>
        </div>
      </body>
    </html>
  );
}
