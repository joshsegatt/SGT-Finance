"use client";

import { markAlertRead } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info, X } from "lucide-react";
import { useTransition } from "react";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: string;
  isRead: boolean;
}

export function AlertCard({ alert }: { alert: Alert }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-card/60 border border-border/50 group">
      <div className="mt-0.5">
        {alert.type === "WARNING" ? (
          <AlertCircle className="w-4 h-4 text-amber-500" />
        ) : (
          <Info className="w-4 h-4 text-primary/70" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{alert.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{alert.description}</p>
      </div>
      {!alert.isRead && (
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={pending}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={() =>
            startTransition(async () => {
              await markAlertRead(alert.id);
            })
          }
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}
