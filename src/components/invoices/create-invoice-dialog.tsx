"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createInvoice } from "@/lib/actions";
import { Plus, Trash2 } from "lucide-react";

const lineSchema = z.object({
  description: z.string().min(1, "Required"),
  quantity: z.number().positive("Must be > 0"),
  unitPrice: z.number().positive("Must be > 0"),
  taxRate: z.number().min(0).max(100),
});

const schema = z.object({
  clientId: z.string().min(1, "Select a client"),
  entityId: z.string().min(1, "Select an entity"),
  number: z.string().min(1, "Required"),
  date: z.string().min(1, "Required"),
  dueDate: z.string().min(1, "Required"),
  currency: z.string().min(1, "Required"),
  notes: z.string().optional(),
  lines: z.array(lineSchema).min(1, "Add at least one line"),
});

type FormValues = z.infer<typeof schema>;

interface Client { id: string; name: string }
interface Entity { id: string; name: string }

interface CreateInvoiceDialogProps {
  clients: Client[];
  entities: Entity[];
  open: boolean;
  onClose: () => void;
  nextNumber: string;
}

export function CreateInvoiceDialog({
  clients, entities, open, onClose, nextNumber,
}: CreateInvoiceDialogProps) {
  const [serverError, setServerError] = useState("");
  const [, startTransition] = useTransition();

  const today = new Date().toISOString().split("T")[0];
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const { register, control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      number: nextNumber,
      date: today,
      dueDate: nextMonth,
      currency: "GBP",
      lines: [{ description: "", quantity: 1, unitPrice: 0, taxRate: 20 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });
  const watchLines = watch("lines");

  const subtotal = watchLines.reduce((s, l) => s + (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0), 0);
  const taxTotal = watchLines.reduce(
    (s, l) => s + (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0) * ((Number(l.taxRate) || 0) / 100),
    0
  );

  function onSubmit(values: FormValues) {
    setServerError("");
    startTransition(async () => {
      try {
        await createInvoice(values);
        onClose();
      } catch (e: unknown) {
        setServerError(e instanceof Error ? e.message : "Failed to create invoice");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
          <div className="grid grid-cols-2 gap-4">
            {/* Client */}
            <div className="space-y-1.5">
              <Label>Client *</Label>
              <Select onValueChange={(v) => setValue("clientId", v as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientId && <p className="text-xs text-destructive">{errors.clientId.message}</p>}
            </div>

            {/* Entity */}
            <div className="space-y-1.5">
              <Label>Entity *</Label>
              <Select onValueChange={(v) => setValue("entityId", v as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.entityId && <p className="text-xs text-destructive">{errors.entityId.message}</p>}
            </div>

            {/* Invoice # */}
            <div className="space-y-1.5">
              <Label>Invoice Number *</Label>
              <Input {...register("number")} />
              {errors.number && <p className="text-xs text-destructive">{errors.number.message}</p>}
            </div>

            {/* Currency */}
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Select defaultValue="GBP" onValueChange={(v) => setValue("currency", v as string)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["GBP", "EUR", "USD"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label>Invoice Date *</Label>
              <Input type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <Label>Due Date *</Label>
              <Input type="date" {...register("dueDate")} />
              {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate.message}</p>}
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Line Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => append({ description: "", quantity: 1, unitPrice: 0, taxRate: 20 })}
              >
                <Plus className="h-3 w-3" /> Add Line
              </Button>
            </div>

            {fields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-[1fr_80px_100px_70px_32px] gap-2 items-start">
                <div>
                  <Input
                    {...register(`lines.${i}.description`)}
                    placeholder="Description"
                    className="h-8"
                  />
                  {errors.lines?.[i]?.description && (
                    <p className="text-xs text-destructive mt-0.5">{errors.lines[i]?.description?.message}</p>
                  )}
                </div>
                <Input {...register(`lines.${i}.quantity`, { valueAsNumber: true })} type="number" placeholder="Qty" className="h-8" />
                <Input {...register(`lines.${i}.unitPrice`, { valueAsNumber: true })} type="number" step="0.01" placeholder="Unit price" className="h-8" />
                <Input {...register(`lines.${i}.taxRate`, { valueAsNumber: true })} type="number" placeholder="Tax %" className="h-8" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="mt-0 text-muted-foreground hover:text-destructive"
                  disabled={fields.length === 1}
                  onClick={() => remove(i)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            {errors.lines?.root && (
              <p className="text-xs text-destructive">{errors.lines.root.message}</p>
            )}
          </div>

          {/* Totals */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>£{subtotal.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>£{taxTotal.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-semibold text-foreground border-t border-border/50 pt-1.5">
              <span>Total</span>
              <span>£{(subtotal + taxTotal).toLocaleString("en-GB", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Textarea {...register("notes")} placeholder="Payment terms, references..." className="resize-none min-h-[64px]" />
          </div>

          {serverError && (
            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{serverError}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
