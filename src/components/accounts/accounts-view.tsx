"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { syncBankAccount } from "@/lib/actions";
import { RefreshCw, Unlink } from "lucide-react";

type Account = {
  id: string;
  name: string;
  accountType: string;
  balance: number;
  currency: string;
  bankConnectionId: string | null;
  entity: { name: string };
  connection: {
    id: string;
    institution: string;
    provider: string;
    status: string;
    lastSync: Date | null;
  } | null;
};

interface AccountsViewProps {
  accounts: Account[];
}

const PROVIDER_STYLES: Record<string, string> = {
  TRUELAYER: "bg-blue-500/10 text-blue-400",
  TINK: "bg-purple-500/10 text-purple-400",
  MOCK: "bg-muted text-muted-foreground",
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "text-emerald-500",
  INACTIVE: "text-red-400",
  PENDING: "text-amber-400",
};

function formatRelativeSync(date: Date | null) {
  if (!date) return "Never";
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function AccountsView({ accounts }: AccountsViewProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [syncResult, setSyncResult] = useState<{ id: string; synced: number } | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  function handleSync(id: string) {
    setSyncResult(null);
    startTransition(async () => {
      const result = await syncBankAccount(id);
      if (result?.synced !== undefined) {
        setSyncResult({ id, synced: result.synced });
        setTimeout(() => setSyncResult(null), 4000);
      }
    });
  }

  async function handleDisconnect(connectionId: string) {
    if (!confirm("Disconnect this bank? All associated accounts and transactions will be removed.")) return;
    setDisconnecting(connectionId);
    try {
      const res = await fetch(`/api/banks/disconnect/${connectionId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to disconnect");
      router.refresh();
    } catch {
      alert("Failed to disconnect bank. Please try again.");
    } finally {
      setDisconnecting(null);
    }
  }

  return (
    <div className="bg-card/80 rounded-xl border border-border overflow-hidden shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead>Account</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Connection</TableHead>
            <TableHead>Last Sync</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                No accounts found
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((account) => (
              <TableRow key={account.id} className="border-border/30 hover:bg-muted/40">
                <TableCell className="font-medium">{account.name}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{account.entity.name}</TableCell>
                <TableCell>
                  {account.connection ? (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PROVIDER_STYLES[account.connection.provider] ?? "bg-muted"}`}>
                      {account.connection.provider}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium">
                    {account.accountType}
                  </span>
                </TableCell>
                <TableCell>
                  {account.connection ? (
                    <div>
                      <p className="text-xs font-medium">{account.connection.institution}</p>
                      <p className={`text-xs mt-0.5 ${STATUS_STYLES[account.connection.status] ?? "text-muted-foreground"}`}>
                        {account.connection.status.toLowerCase()}
                      </p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {account.connection ? formatRelativeSync(account.connection.lastSync) : "—"}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(account.balance, account.currency)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <div className="flex flex-col items-start gap-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                        disabled={pending}
                        onClick={() => handleSync(account.id)}
                      >
                        <RefreshCw className={`h-3 w-3 ${pending ? "animate-spin" : ""}`} />
                        Sync
                      </Button>
                      {syncResult?.id === account.id && (
                        <span className="text-[10px] text-emerald-500 font-semibold px-1">
                          {syncResult.synced === 0 ? "Up to date" : `+${syncResult.synced} txns`}
                        </span>
                      )}
                    </div>
                    {account.connection && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1 text-muted-foreground hover:text-red-400"
                        disabled={disconnecting === account.connection.id}
                        onClick={() => account.connection && handleDisconnect(account.connection.id)}
                        title="Disconnect bank"
                      >
                        <Unlink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
