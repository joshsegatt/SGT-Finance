"use client";

import { useState, useCallback, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { formatCurrency, formatDate } from "@/lib/format";
import { updateInvoiceStatus } from "@/lib/actions";
import {
  GripVertical, User, Calendar, AlertCircle,
  FileText, MoreHorizontal, Printer,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Types ───────────────────────────────────────────────────────────────────

type Invoice = {
  id: string;
  number: string;
  date: Date;
  dueDate: Date;
  status: string;
  currency: string;
  notes: string | null;
  client: { name: string };
  entity: { name: string };
  lines: { amount: number; taxRate: number }[];
};

interface InvoiceKanbanProps {
  invoices: Invoice[];
  clients: { id: string; name: string }[];
}

// ─── Column Config ───────────────────────────────────────────────────────────

const COLUMNS = [
  { id: "DRAFT",     label: "Draft",     color: "#6b7280", bg: "bg-gray-500/10",    border: "border-gray-500/20",    dot: "bg-gray-400"    },
  { id: "SENT",      label: "Sent",      color: "#3b82f6", bg: "bg-blue-500/10",    border: "border-blue-500/20",    dot: "bg-blue-400"    },
  { id: "PAID",      label: "Paid",      color: "#22c55e", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  { id: "OVERDUE",   label: "Overdue",   color: "#ef4444", bg: "bg-red-500/10",     border: "border-red-500/20",     dot: "bg-red-400"     },
  { id: "CANCELLED", label: "Cancelled", color: "#9ca3af", bg: "bg-gray-400/10",    border: "border-gray-400/20",    dot: "bg-gray-300"    },
];

// ─── Sortable Invoice Card ──────────────────────────────────────────────────

function SortableInvoiceCard({ invoice, isOverlay }: { invoice: Invoice; isOverlay?: boolean }) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: invoice.id, data: { type: "invoice", status: invoice.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const subtotal = invoice.lines.reduce((s, l) => s + l.amount, 0);
  const tax = invoice.lines.reduce((s, l) => s + l.amount * (l.taxRate / 100), 0);
  const total = subtotal + tax;
  const isOverdue = invoice.status !== "PAID" && invoice.status !== "CANCELLED" && new Date(invoice.dueDate) < new Date();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-card rounded-lg border ${isOverdue && invoice.status !== "OVERDUE" ? "border-red-500/30" : "border-border/60"} 
        p-3 shadow-sm hover:shadow-md hover:border-border transition-all duration-200
        ${isOverlay ? "shadow-2xl ring-2 ring-primary/20 rotate-1 scale-[1.02]" : ""}`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-5 h-7 rounded-md flex items-center justify-center 
          cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity
          bg-card border border-border/60 hover:bg-muted z-10"
      >
        <GripVertical className="w-2.5 h-2.5 text-muted-foreground" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <span className="font-mono text-xs font-semibold text-foreground">{invoice.number}</span>
        <DropdownMenu>
          <DropdownMenuTrigger className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground/40 hover:text-foreground hover:bg-muted/50 transition-colors opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => window.open(`/invoices/${invoice.id}/print`, "_blank")}>
              <Printer className="h-3 w-3 mr-2 opacity-70" /> Print / PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Client */}
      <div className="flex items-center gap-1.5 mb-2">
        <User className="h-3 w-3 text-muted-foreground/50 shrink-0" />
        <span className="text-xs text-foreground font-medium truncate">{invoice.client.name}</span>
      </div>

      {/* Amount */}
      <div className="text-base font-bold text-foreground mb-2">
        {formatCurrency(total, invoice.currency)}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span className={`text-[10px] ${isOverdue ? "text-red-400 font-semibold" : ""}`}>
            {formatDate(invoice.dueDate)}
          </span>
        </div>
        {isOverdue && invoice.status !== "OVERDUE" && (
          <div className="flex items-center gap-1 text-red-400">
            <AlertCircle className="h-3 w-3" />
            <span className="text-[10px] font-semibold">Overdue</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Droppable Column ───────────────────────────────────────────────────────

function KanbanColumn({
  column,
  invoices,
}: {
  column: typeof COLUMNS[0];
  invoices: Invoice[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const total = invoices.reduce(
    (s, inv) => s + inv.lines.reduce((ls, l) => ls + l.amount + l.amount * (l.taxRate / 100), 0),
    0
  );

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[220px] flex-1 rounded-xl border ${column.border} ${column.bg} 
        transition-all duration-200 ${isOver ? "ring-2 ring-primary/30 scale-[1.01]" : ""}`}
    >
      {/* Column Header */}
      <div className="px-3 py-3 border-b border-border/20">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${column.dot}`} />
            <span className="text-xs font-semibold text-foreground">{column.label}</span>
          </div>
          <span className="text-[10px] font-bold bg-background/60 text-muted-foreground px-1.5 py-0.5 rounded-full">
            {invoices.length}
          </span>
        </div>
        <div className="text-[10px] text-muted-foreground font-medium">
          {formatCurrency(total)}
        </div>
      </div>

      {/* Cards */}
      <SortableContext items={invoices.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-380px)] min-h-[120px]">
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="w-5 h-5 text-muted-foreground/20 mb-2" />
              <p className="text-[10px] text-muted-foreground/40">No invoices</p>
            </div>
          ) : (
            invoices.map((inv) => (
              <SortableInvoiceCard key={inv.id} invoice={inv} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// ─── Main Kanban Board ──────────────────────────────────────────────────────

export function InvoiceKanban({ invoices, clients }: InvoiceKanbanProps) {
  const [items, setItems] = useState<Invoice[]>(invoices);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeInvoice = items.find((i) => i.id === String(active.id));
    if (!activeInvoice) return;

    // Determine target column
    const overId = String(over.id);
    const targetColumn = COLUMNS.find((c) => c.id === overId);
    const overInvoice = items.find((i) => i.id === overId);
    const newStatus = targetColumn?.id ?? overInvoice?.status;

    if (newStatus && newStatus !== activeInvoice.status) {
      setItems((prev) =>
        prev.map((i) => (i.id === activeInvoice.id ? { ...i, status: newStatus } : i))
      );
    }
  }, [items]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active } = event;
    setActiveId(null);

    const invoice = items.find((i) => i.id === String(active.id));
    const original = invoices.find((i) => i.id === String(active.id));

    if (invoice && original && invoice.status !== original.status) {
      startTransition(async () => {
        await updateInvoiceStatus(invoice.id, invoice.status);
      });
    }
  }, [items, invoices]);

  const activeInvoice = activeId ? items.find((i) => i.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            invoices={items.filter((i) => i.status === col.id)}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
        {activeInvoice ? <SortableInvoiceCard invoice={activeInvoice} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
