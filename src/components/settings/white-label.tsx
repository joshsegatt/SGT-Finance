"use client";

import { useState } from "react";
import { Palette, Link as LinkIcon, Save, Trash2, CheckCircle2 } from "lucide-react";
import { updateCustomLogo } from "@/lib/actions";

interface WhiteLabelProps {
  currentLogoUrl: string | null;
}

export function WhiteLabel({ currentLogoUrl: initialUrl }: WhiteLabelProps) {
  const [url, setUrl] = useState(initialUrl || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateCustomLogo(url || null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Remove custom logo and revert to default?")) return;
    setLoading(true);
    try {
      await updateCustomLogo(null);
      setUrl("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border panel-shadow overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border/40">
        <Palette className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">White-label Branding</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Customize the dashboard with your own logo. This will replace the SGT Finance logo in the sidebar and topbar.
          </p>
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Logo Image URL</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary/40 focus:border-primary/40 outline-none transition-all"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={loading || url === initialUrl}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {success ? "Saved" : "Save"}
              </button>
            </div>
          </div>

          {initialUrl && (
            <button
              onClick={handleRemove}
              className="flex items-center gap-2 text-xs text-destructive hover:text-destructive/80 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove custom logo
            </button>
          )}
        </div>

        {/* Preview */}
        <div className="pt-6 border-t border-border/30">
          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">Preview</p>
          <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-dashed border-border">
            <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden">
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="Logo preview" className="max-w-full max-h-full object-contain p-1" />
              ) : (
                <div className="w-6 h-6 bg-primary/20 rounded flex items-center justify-center">
                   <Palette className="w-3 h-3 text-primary" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{url ? "Custom Logo Active" : "Default Branding"}</p>
              <p className="text-[10px] text-muted-foreground">This is how your logo will appear in the UI.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
