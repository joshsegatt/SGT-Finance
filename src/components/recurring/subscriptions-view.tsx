"use client";

import { useTransition } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/format";
import { cancelSubscription } from "@/lib/actions";
import { AlertTriangle, Zap } from "lucide-react";

type Subscription = {
  id: string;
  name: string;
  merchant: string | null;
  interval: string;
  amount: number;
  currency: string;
  status: string;
  wasteDetected: boolean;
  nextBillingDate: Date | null;
};

interface SubscriptionsViewProps {
  subscriptions: Subscription[];
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-500",
  AT_RISK: "bg-amber-500/10 text-amber-400",
  CANCELLED: "bg-muted/50 text-muted-foreground line-through",
};

export function SubscriptionsView({ subscriptions }: SubscriptionsViewProps) {
  const [pending, startTransition] = useTransition();

  function handleCancel(id: string) {
    startTransition(async () => {
      await cancelSubscription(id);
    });
  }

  return (
    <div className="bg-card/80 rounded-xl border border-border overflow-hidden shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead>Service</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Interval</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next Billing</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-28" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                No subscriptions found
              </TableCell>
            </TableRow>
          ) : (
            subscriptions.map((sub) => (
              <TableRow key={sub.id} className={`border-border/30 hover:bg-muted/40 ${sub.wasteDetected ? "bg-amber-500/5" : ""}`}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{sub.name}</span>
                    {sub.wasteDetected && (
                      <span className="flex items-center gap-0.5 text-xs text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full font-medium">
                        <AlertTriangle className="h-3 w-3" /> waste
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{sub.merchant ?? "—"}</TableCell>
                <TableCell>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium">
                    {sub.interval.charAt(0) + sub.interval.slice(1).toLowerCase()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[sub.status] ?? "bg-muted"}`}>
                    {sub.status.charAt(0) + sub.status.slice(1).toLowerCase()}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {sub.nextBillingDate ? formatDate(sub.nextBillingDate) : "—"}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(sub.amount, sub.currency)}
                </TableCell>
                <TableCell>
                  {sub.status !== "CANCELLED" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-destructive"
                      disabled={pending}
                      onClick={() => handleCancel(sub.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
