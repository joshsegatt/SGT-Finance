"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate } from "@/lib/format";
import { updateTransactionCategory, updateTransactionNotes } from "@/lib/actions";
import {
  X, CheckCircle, Tag, FileText, Building2, CreditCard,
  Upload, Image, File, MessageSquare, Clock, ArrowRight,
  Paperclip, Send, User,
} from "lucide-react";

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
  account: { name: string; entity: { name: string } };
};

interface TransactionDrawerProps {
  transaction: Transaction | null;
  categories: string[];
  open: boolean;
  onClose: () => void;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
}

interface MockReceipt {
  id: string;
  name: string;
  type: string;
  size: string;
}

export function TransactionDrawer({ transaction: tx, categories, open, onClose }: TransactionDrawerProps) {
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"details" | "receipts" | "comments">("details");
  const [comments, setComments] = useState<Comment[]>([
    { id: "1", text: "Verified with bank statement", author: "System", timestamp: new Date(Date.now() - 86400000) },
  ]);
  const [newComment, setNewComment] = useState("");
  const [receipts, setReceipts] = useState<MockReceipt[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tx) {
      setCategory(tx.category ?? "");
      setNotes(tx.notes ?? "");
      setSaved(false);
    }
  }, [tx]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  function handleSave() {
    if (!tx) return;
    startTransition(async () => {
      if (category !== tx.category) await updateTransactionCategory(tx.id, category);
      if (notes !== (tx.notes ?? "")) await updateTransactionNotes(tx.id, notes);
      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 800);
    });
  }

  function addComment() {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: String(Date.now()), text: newComment.trim(), author: "You", timestamp: new Date() },
    ]);
    setNewComment("");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const newReceipts: MockReceipt[] = files.map((f) => ({
      id: String(Date.now()) + f.name,
      name: f.name,
      type: f.type.includes("pdf") ? "PDF" : f.type.includes("image") ? "IMG" : "FILE",
      size: `${(f.size / 1024).toFixed(1)} KB`,
    }));
    setReceipts((prev) => [...prev, ...newReceipts]);
  }

  function handleMockUpload() {
    const mock: MockReceipt = {
      id: String(Date.now()),
      name: `receipt_${Date.now().toString(36)}.pdf`,
      type: "PDF",
      size: "142.3 KB",
    };
    setReceipts((prev) => [...prev, mock]);
  }

  if (!tx) return null;

  const tabs = [
    { key: "details" as const, label: "Details", icon: FileText },
    { key: "receipts" as const, label: "Receipts", icon: Paperclip, count: receipts.length },
    { key: "comments" as const, label: "Comments", icon: MessageSquare, count: comments.length },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full max-w-[480px] bg-background border-l border-border z-50 
          flex flex-col shadow-2xl transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border/40">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-sm font-semibold text-foreground truncate">{tx.description}</h2>
            <div className={`text-2xl font-bold mt-1 ${tx.amount >= 0 ? "text-emerald-500" : "text-foreground"}`}>
              {tx.amount >= 0 ? "+" : ""}{formatCurrency(tx.amount, tx.currency)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{formatDate(tx.date)}</div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border/40 px-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "details" && (
            <div className="p-5 space-y-5">
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <DetailRow icon={Building2} label="Entity" value={tx.account.entity.name} />
                <DetailRow icon={CreditCard} label="Account" value={tx.account.name} />
                <DetailRow icon={CheckCircle} label="Status" value={tx.status.charAt(0) + tx.status.slice(1).toLowerCase()} />
                <DetailRow icon={Clock} label="Date" value={formatDate(tx.date)} />
              </div>

              {/* Flags */}
              <div className="flex gap-2 flex-wrap">
                {tx.taxRelevant && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Tax Relevant</span>
                )}
                {tx.isSubscription && (
                  <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-medium">Subscription</span>
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
                    {["Income","Expense","Software","Payroll","Travel","Marketing","Office","Tax"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                    {categories
                      .filter((c) => !["Income","Expense","Software","Payroll","Travel","Marketing","Office","Tax"].includes(c))
                      .map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
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

              {/* Activity Timeline */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Activity</h3>
                <div className="space-y-0">
                  {[
                    { label: "Transaction imported", time: formatDate(tx.date), icon: ArrowRight },
                    ...(tx.category ? [{ label: `Categorized as "${tx.category}"`, time: "Auto", icon: Tag }] : []),
                    { label: tx.status === "COMPLETED" ? "Completed" : "Pending review", time: "Current", icon: CheckCircle },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-2">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                        <item.icon className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "receipts" && (
            <div className="p-5 space-y-4">
              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragOver
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-border/60 hover:border-border"
                }`}
              >
                <Upload className={`w-8 h-8 mx-auto mb-3 ${dragOver ? "text-primary" : "text-muted-foreground/30"}`} />
                <p className="text-sm font-medium text-foreground mb-1">Drop receipts here</p>
                <p className="text-xs text-muted-foreground mb-3">PDF, JPG, PNG up to 10MB</p>
                <Button variant="outline" size="sm" onClick={handleMockUpload} className="gap-1.5">
                  <Upload className="h-3.5 w-3.5" /> Browse files
                </Button>
              </div>

              {/* Uploaded Receipts */}
              {receipts.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Uploaded ({receipts.length})
                  </h3>
                  {receipts.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-card/50">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        {r.type === "PDF" ? <File className="h-4 w-4 text-primary" /> : <Image className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{r.name}</p>
                        <p className="text-[10px] text-muted-foreground">{r.type} · {r.size}</p>
                      </div>
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "comments" && (
            <div className="flex flex-col h-full">
              {/* Comments Thread */}
              <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                {comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-foreground">{c.author}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {c.timestamp.toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/80 bg-muted/40 rounded-lg px-3 py-2">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-border/40">
                <div className="flex items-end gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="resize-none text-xs min-h-[60px] flex-1"
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addComment(); } }}
                  />
                  <Button size="sm" onClick={addComment} disabled={!newComment.trim()} className="h-8 w-8 p-0 shrink-0">
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer (details tab only) */}
        {activeTab === "details" && (
          <div className="p-4 border-t border-border/40 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={pending}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={pending}>
              {saved ? "Saved!" : pending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof CheckCircle; label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="text-sm font-medium text-foreground truncate">{value}</div>
    </div>
  );
}
