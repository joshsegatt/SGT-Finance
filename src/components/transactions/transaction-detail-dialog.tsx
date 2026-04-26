"use client";

import { useState, useTransition } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate } from "@/lib/format";
import { updateTransactionCategory, updateTransactionNotes } from "@/lib/actions";
import { CheckCircle, Tag, FileText, Building2, CreditCard } from "lucide-react";

type Transaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  currency: string;
  category: string | null;
  status: string;
  notes: string | null;
  taxRelevant: boolean;
  isSubscription: boolean;
  account: {
    name: string;
    entity: { name: string };
  };
};

interface Props {
  transaction: Transaction;
  categories: string[];
  open: boolean;
  onClose: () => void;
}

export function TransactionDetailDialog({ transaction: tx, categories, open, onClose }: Props) {
  const [category, setCategory] = useState(tx.category ?? "");
  const [notes, setNotes] = useState(tx.notes ?? "");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      if (category !== tx.category) {
        await updateTransactionCategory(tx.id, category);
      }
      if (notes !== (tx.notes ?? "")) {
        await updateTransactionNotes(tx.id, notes);
      }
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 800);
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Transaction Detail</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Amount */}
          <div className="bg-muted/40 rounded-lg p-4 text-center">
            <div
              className={`text-3xl font-bold ${tx.amount >= 0 ? "text-emerald-500" : "text-foreground"}`}
            >
              {tx.amount >= 0 ? "+" : ""}
              {formatCurrency(tx.amount, tx.currency)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{formatDate(tx.date)}</div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <DetailRow icon={FileText} label="Description" value={tx.description} />
            <DetailRow icon={Building2} label="Entity" value={tx.account.entity.name} />
            <DetailRow icon={CreditCard} label="Account" value={tx.account.name} />
            <DetailRow
              icon={CheckCircle}
              label="Status"
              value={tx.status.charAt(0) + tx.status.slice(1).toLowerCase()}
            />
          </div>

          {/* Flags */}
          <div className="flex gap-2 flex-wrap">
            {tx.taxRelevant && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                Tax Relevant
              </span>
            )}
            {tx.isSubscription && (
              <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                Subscription
              </span>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Tag className="h-3 w-3" /> Category
            </label>
            <Select value={category} onValueChange={(v) => v && setCategory(v)}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
                <SelectItem value="Software">Software</SelectItem>
                <SelectItem value="Payroll">Payroll</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
                <SelectItem value="Tax">Tax</SelectItem>
                {categories
                  .filter((c) => !["Income","Expense","Software","Payroll","Travel","Marketing","Office","Tax"].includes(c))
                  .map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note..."
              className="resize-none text-sm min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={pending}>
            {saved ? "Saved!" : pending ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof CheckCircle; label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="font-medium text-foreground truncate">{value}</div>
    </div>
  );
}
