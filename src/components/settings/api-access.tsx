"use client";

import { useState } from "react";
import { KeyRound, RefreshCw, Copy, Check } from "lucide-react";
import { regenerateApiKey } from "@/lib/actions";

interface ApiAccessProps {
  apiKey: string | null;
}

export function ApiAccess({ apiKey: initialKey }: ApiAccessProps) {
  const [key, setKey] = useState(initialKey);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRegenerate = async () => {
    if (!confirm("Regenerating the API key will immediately revoke the current one. Continue?")) return;
    setLoading(true);
    try {
      const res = await regenerateApiKey();
      if (res.success) {
        setKey(res.apiKey);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card rounded-xl border border-border panel-shadow overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border/40">
        <KeyRound className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">API Access</h2>
      </div>
      <div className="p-6 space-y-4">
        <p className="text-xs text-muted-foreground">
          Use this API key to authenticate requests to the SGT Finance API. Keep it secure and never share it publicly.
        </p>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1 group">
            <input
              type="text"
              readOnly
              value={key || "No key generated yet"}
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-sm font-mono text-foreground focus:outline-none pr-10"
            />
            {key && (
              <button
                onClick={handleCopy}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-border/60 rounded-md transition-colors text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-secondary/80 hover:bg-secondary text-secondary-foreground rounded-lg text-sm font-medium transition-all border border-border/60 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            {key ? "Regenerate" : "Generate Key"}
          </button>
        </div>

        <div className="bg-primary/5 rounded-lg border border-primary/10 p-3">
          <p className="text-[10px] uppercase tracking-wider font-bold text-primary mb-1">Documentation</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Include this key in the <code className="text-primary font-mono px-1">x-api-key</code> header for all requests to <code className="bg-border/40 px-1 rounded">/api/v1/*</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
