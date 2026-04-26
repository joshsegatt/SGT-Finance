"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Search, Plus, Building2, FileText, TrendingUp, Users,
  Mail, Phone, CheckCircle2, XCircle, Archive, ChevronRight,
  MoreHorizontal, Star, Download,
} from "lucide-react";
import { createClient, updateClientStatus } from "@/lib/actions";
import { formatCurrency } from "@/lib/format";

interface Client {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  totalInvoiced: number;
  totalPaid: number;
  _count: { entities: number; invoices: number };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.FC<{ className?: string }> }> = {
  ACTIVE: { label: "Active", color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50", icon: CheckCircle2 },
  INACTIVE: { label: "Inactive", color: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50", icon: XCircle },
  ARCHIVED: { label: "Archived", color: "text-slate-500 bg-slate-100 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50", icon: Archive },
};

function avatarColor(name: string) {
  const colors = [
    "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffff;
  return colors[Math.abs(h) % colors.length];
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function NewClientModal() {
  const [open, setOpen] = useState(false);
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError("");
    startTransition(async () => {
      try {
        await createClient({
          name: fd.get("name") as string,
          contactName: fd.get("contactName") as string,
          email: fd.get("email") as string,
          phone: fd.get("phone") as string,
          status: "ACTIVE",
        });
        setOpen(false);
        formRef.current?.reset();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to create client");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer">
        <Plus className="w-3.5 h-3.5" />
        New Client
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="nc-name">Company / Client Name <span className="text-destructive">*</span></Label>
            <Input id="nc-name" name="name" placeholder="Acme Corp." required minLength={2} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nc-contact">Contact Person</Label>
            <Input id="nc-contact" name="contactName" placeholder="John Smith" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="nc-email">Email</Label>
              <Input id="nc-email" name="email" type="email" placeholder="hello@acme.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nc-phone">Phone</Label>
              <Input id="nc-phone" name="phone" placeholder="+44 7700 000000" />
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Creating…" : "Create Client"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function StatusDropdown({ client }: { client: Client }) {
  const [loading, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function setStatus(status: string) {
    setOpen(false);
    startTransition(() => updateClientStatus(client.id, status));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="p-1 rounded hover:bg-muted/60 transition-colors"
        aria-label="Change status"
      >
        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-7 z-20 bg-popover border border-border rounded-lg shadow-lg p-1 w-36 text-sm">
            {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/60 transition-colors ${s === client.status ? "font-semibold text-primary" : "text-foreground"}`}
              >
                <cfg.icon className="w-3.5 h-3.5" />
                {cfg.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ClientsView({ clients, selectedClientId }: { clients: Client[]; selectedClientId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [inputVal, setInputVal] = useState(searchParams.get("search") ?? "");

  const totalInvoiced = clients.reduce((s, c) => s + c.totalInvoiced, 0);
  const totalPaid = clients.reduce((s, c) => s + c.totalPaid, 0);
  const activeCount = clients.filter((c) => c.status === "ACTIVE").length;

  function handleSearch(value: string) {
    setInputVal(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");
    params.delete("clientId");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function selectClient(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("clientId") === id) params.delete("clientId");
    else params.set("clientId", id);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  const selected = clients.find((c) => c.id === selectedClientId);
  const outstanding = selected ? selected.totalInvoiced - selected.totalPaid : 0;

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Clients", value: clients.length, icon: Users, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400" },
          { label: "Active", value: activeCount, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400" },
          { label: "Total Invoiced", value: formatCurrency(totalInvoiced), icon: TrendingUp, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/30 dark:text-violet-400" },
          { label: "Total Collected", value: formatCurrency(totalPaid), icon: Star, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card rounded-xl border border-border p-4 card-shadow flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${kpi.color}`}>
              <kpi.icon className="w-[18px] h-[18px]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground truncate">{kpi.label}</div>
              <div className="text-base font-bold text-foreground truncate">{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Client List */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search clients…"
                value={inputVal}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
            <NewClientModal />
            <button
              onClick={() => { window.location.href = `/api/export/clients?search=${encodeURIComponent(searchParams.get("search") ?? "")}`; }}
              className="inline-flex items-center gap-1.5 text-xs font-medium border border-border/60 rounded-md px-2.5 py-1.5 hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
          </div>

          <div className="space-y-1.5">
            {clients.length === 0 ? (
              <div className="border border-dashed border-border rounded-xl">
                <EmptyState
                  icon={Users}
                  title="No clients found"
                  description={searchParams.get("search") ? "No clients match your search. Try different keywords." : "Add your first client to start sending invoices."}
                  action={searchParams.get("search") ? { label: "Clear search", onClick: () => { router.push("/clients"); } } : { label: "Add Client", href: "/clients?create=1" }}
                  compact
                />
              </div>
            ) : (
              clients.map((client) => {
                const cfg = STATUS_CONFIG[client.status] ?? STATUS_CONFIG.ACTIVE;
                const StatusIcon = cfg.icon;
                const isSelected = client.id === selectedClientId;
                return (
                  <div
                    key={client.id}
                    className={`group relative rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary/5 border-primary/40 shadow-sm shadow-primary/10"
                        : "bg-card border-border/60 hover:border-primary/30 hover:shadow-sm"
                    }`}
                    onClick={() => selectClient(client.id)}
                  >
                    <div className="flex items-center gap-3 p-3 pr-2">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${avatarColor(client.name)}`}>
                        {getInitials(client.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-foreground truncate">{client.name}</p>
                          <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border font-medium shrink-0 ${cfg.color}`}>
                            <StatusIcon className="w-2.5 h-2.5" />
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{client.email ?? "No email"}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="w-3 h-3" />{client._count.entities}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <FileText className="w-3 h-3" />{client._count.invoices}
                          </span>
                          {client.totalInvoiced > 0 && (
                            <span className="text-xs font-semibold text-foreground ml-auto">
                              {formatCurrency(client.totalInvoiced)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <div onClick={(e) => e.stopPropagation()}>
                          <StatusDropdown client={client} />
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-colors ${isSelected ? "text-primary" : "text-muted-foreground/30 group-hover:text-muted-foreground"}`} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="xl:col-span-3">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-64 bg-card/50 rounded-xl border border-dashed border-border text-center p-8">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Select a client</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Click any client to view full details</p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-up">
              {/* Header card */}
              <div className="bg-card rounded-xl border border-border p-6 card-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 ${avatarColor(selected.name)}`}>
                    {getInitials(selected.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
                      {(() => {
                        const cfg = STATUS_CONFIG[selected.status] ?? STATUS_CONFIG.ACTIVE;
                        const Icon = cfg.icon;
                        return (
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>
                            <Icon className="w-3 h-3" />{cfg.label}
                          </span>
                        );
                      })()}
                    </div>
                    {selected.contactName && (
                      <p className="text-sm text-muted-foreground mt-0.5">{selected.contactName}</p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-2">
                      {selected.email && (
                        <a href={`mailto:${selected.email}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                          <Mail className="w-3.5 h-3.5" />{selected.email}
                        </a>
                      )}
                      {selected.phone && (
                        <a href={`tel:${selected.phone}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                          <Phone className="w-3.5 h-3.5" />{selected.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Revenue KPIs */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div className="bg-muted/30 rounded-lg p-3 text-center border border-border/40">
                    <div className="text-xs text-muted-foreground mb-1">Invoiced</div>
                    <div className="text-base font-bold text-foreground">{formatCurrency(selected.totalInvoiced)}</div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 text-center border border-emerald-100 dark:border-emerald-900/40">
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Collected</div>
                    <div className="text-base font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(selected.totalPaid)}</div>
                  </div>
                  <div className={`rounded-lg p-3 text-center border ${outstanding > 0 ? "bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40" : "bg-muted/30 border-border/40"}`}>
                    <div className={`text-xs mb-1 ${outstanding > 0 ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>Outstanding</div>
                    <div className={`text-base font-bold ${outstanding > 0 ? "text-amber-700 dark:text-amber-400" : "text-foreground"}`}>{formatCurrency(outstanding)}</div>
                  </div>
                </div>

                {/* Collection progress */}
                {selected.totalInvoiced > 0 && (
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Collection rate</span>
                      <span className="font-semibold text-foreground">{Math.round((selected.totalPaid / selected.totalInvoiced) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (selected.totalPaid / selected.totalInvoiced) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-xl border border-border p-4 panel-shadow flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{selected._count.entities}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      {selected._count.entities !== 1 ? "Entities" : "Entity"}
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-4 panel-shadow flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{selected._count.invoices}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      {selected._count.invoices !== 1 ? "Invoices" : "Invoice"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


