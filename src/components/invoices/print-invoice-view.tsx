"use client";

import { useEffect } from "react";

type InvoiceLine = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate: number;
};

type Invoice = {
  id: string;
  number: string;
  date: Date;
  dueDate: Date;
  status: string;
  currency: string;
  notes: string | null;
  client: {
    name: string;
    email: string | null;
    phone: string | null;
    contactName: string | null;
  };
  entity: {
    name: string;
    country: string;
    taxId: string | null;
    currency: string;
  };
  lines: InvoiceLine[];
};

interface Props {
  invoice: Invoice;
}

const STATUS_COLOR: Record<string, string> = {
  PAID: "#22c55e",
  OVERDUE: "#ef4444",
  SENT: "#3b82f6",
  DRAFT: "#9ca3af",
  CANCELLED: "#6b7280",
};

function fmt(value: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(value);
}

function fmtDate(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export function PrintInvoiceView({ invoice }: Props) {
  useEffect(() => {
    // Auto-print on load
    window.print();
  }, []);

  const subtotal = invoice.lines.reduce((s, l) => s + l.amount, 0);
  const totalTax = invoice.lines.reduce((s, l) => s + l.amount * (l.taxRate / 100), 0);
  const total = subtotal + totalTax;

  const statusColor = STATUS_COLOR[invoice.status] ?? "#9ca3af";

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "48px 40px",
        color: "#111",
        fontSize: "14px",
        lineHeight: "1.5",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Print button — hidden in print */}
      <div style={{ textAlign: "right", marginBottom: "24px" }} className="no-print">
        <button
          onClick={() => window.print()}
          style={{
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 20px",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Print / Save PDF
        </button>
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
        <div>
          <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px", color: "#111" }}>
            {invoice.entity.name}
          </div>
          <div style={{ marginTop: "4px", color: "#6b7280", fontSize: "13px" }}>
            {invoice.entity.country}
            {invoice.entity.taxId && ` · VAT: ${invoice.entity.taxId}`}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#111" }}>{invoice.number}</div>
          <div
            style={{
              display: "inline-block",
              marginTop: "8px",
              padding: "3px 12px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: statusColor,
              border: `1px solid ${statusColor}`,
            }}
          >
            {invoice.status}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "2px solid #f3f4f6", marginBottom: "32px" }} />

      {/* Addresses */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
            Bill To
          </div>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#111" }}>{invoice.client.name}</div>
          {invoice.client.contactName && (
            <div style={{ color: "#6b7280", fontSize: "13px" }}>{invoice.client.contactName}</div>
          )}
          {invoice.client.email && (
            <div style={{ color: "#6b7280", fontSize: "13px" }}>{invoice.client.email}</div>
          )}
          {invoice.client.phone && (
            <div style={{ color: "#6b7280", fontSize: "13px" }}>{invoice.client.phone}</div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
              Issue Date
            </div>
            <div style={{ fontWeight: 600, color: "#111" }}>{fmtDate(invoice.date)}</div>
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
              Due Date
            </div>
            <div style={{ fontWeight: 600, color: invoice.status === "OVERDUE" ? "#ef4444" : "#111" }}>
              {fmtDate(invoice.dueDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Line items */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "32px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
            {["Description", "Qty", "Unit Price", "Tax", "Amount"].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: h === "Description" ? "left" : "right",
                  padding: "8px 12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#9ca3af",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoice.lines.map((line, i) => (
            <tr key={line.id} style={{ borderBottom: "1px solid #f9fafb", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={{ padding: "12px 12px", color: "#111", fontWeight: 500 }}>{line.description}</td>
              <td style={{ padding: "12px 12px", textAlign: "right", color: "#6b7280" }}>{line.quantity}</td>
              <td style={{ padding: "12px 12px", textAlign: "right", color: "#6b7280" }}>{fmt(line.unitPrice, invoice.currency)}</td>
              <td style={{ padding: "12px 12px", textAlign: "right", color: "#6b7280" }}>{line.taxRate}%</td>
              <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: 600, color: "#111" }}>
                {fmt(line.amount * (1 + line.taxRate / 100), invoice.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ width: "260px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ color: "#6b7280" }}>Subtotal</span>
            <span style={{ fontWeight: 600 }}>{fmt(subtotal, invoice.currency)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ color: "#6b7280" }}>Tax</span>
            <span style={{ fontWeight: 600 }}>{fmt(totalTax, invoice.currency)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", marginTop: "4px" }}>
            <span style={{ fontWeight: 700, fontSize: "16px" }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: "18px", color: "#111" }}>{fmt(total, invoice.currency)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div style={{ marginTop: "40px", padding: "16px", background: "#f9fafb", borderRadius: "8px", borderLeft: "3px solid #e5e7eb" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
            Notes
          </div>
          <div style={{ color: "#374151", fontSize: "13px" }}>{invoice.notes}</div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "60px", textAlign: "center", color: "#d1d5db", fontSize: "12px", borderTop: "1px solid #f3f4f6", paddingTop: "24px" }}>
        {invoice.entity.name} · Thank you for your business
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
