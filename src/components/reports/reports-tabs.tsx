"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsCashFlowChart } from "@/components/analytics/cash-flow-chart";
import { CategoryChart } from "@/components/analytics/category-chart";
import { formatCurrency } from "@/lib/format";

interface KPIs {
  totalBalance: number;
  cashReserve: number;
  taxExposure: number;
  taxProvision: {
    effectiveRate: number;
    provisionedPct: number;
    corporateTaxDue: number;
    vatPayable: number;
  };
  overdueInvoicesTotal: number;
}

interface CashFlowPoint {
  month: string;
  income: number;
  expense: number;
}

interface CategoryPoint {
  category: string;
  income: number;
  expense: number;
}

interface ReportsTabsProps {
  cashFlow: CashFlowPoint[];
  categories: CategoryPoint[];
  kpis: KPIs;
}

export function ReportsTabs({ cashFlow, categories, kpis }: ReportsTabsProps) {
  const totalIncome = cashFlow.reduce((s, m) => s + m.income, 0);
  const totalExpense = cashFlow.reduce((s, m) => s + m.expense, 0);

  return (
    <Tabs defaultValue="cashflow">
      <TabsList className="mb-6">
        <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
        <TabsTrigger value="tax">Tax Exposure</TabsTrigger>
      </TabsList>

      {/* Cash Flow Tab */}
      <TabsContent value="cashflow" className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Income", value: totalIncome, color: "text-emerald-500" },
            { label: "Total Expenses", value: totalExpense, color: "text-foreground" },
            { label: "Net Flow", value: totalIncome - totalExpense, color: (totalIncome - totalExpense) >= 0 ? "text-emerald-500" : "text-red-400" },
          ].map((k) => (
            <div key={k.label} className="bg-card rounded-xl border border-border p-5 card-shadow">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{k.label}</div>
              <div className={`text-2xl font-bold ${k.color}`}>{formatCurrency(k.value)}</div>
              <div className="text-xs text-muted-foreground mt-1">Last 12 months</div>
            </div>
          ))}
        </div>
        <div className="bg-card rounded-xl border border-border p-6 panel-shadow">
          <h3 className="text-sm font-semibold text-foreground mb-5">Monthly Cash Flow (12 months)</h3>
          <AnalyticsCashFlowChart data={cashFlow} />
        </div>
      </TabsContent>

      {/* Category Tab */}
      <TabsContent value="categories" className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-6 panel-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-5">Spend by Category</h3>
            <CategoryChart data={categories} />
          </div>
          <div className="bg-card rounded-xl border border-border p-6 panel-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Category Totals</h3>
            <div className="divide-y divide-border/30">
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No data</p>
              ) : (
                categories
                  .sort((a, b) => b.expense - a.expense)
                  .map((cat) => {
                    const total = cat.income + cat.expense;
                    const pct = total > 0 ? Math.round((cat.expense / total) * 100) : 0;
                    return (
                      <div key={cat.category} className="py-2.5">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">{cat.category}</span>
                          <span className="text-sm font-semibold text-foreground">{formatCurrency(cat.expense)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: "#8b5cf6" }}
                          />
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Tax Tab */}
      <TabsContent value="tax" className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Total Assets (GBP)", value: kpis.totalBalance, sub: "Across all entities" },
            { label: "Tax Exposure", value: kpis.taxExposure, sub: `${kpis.taxProvision.effectiveRate}% effective rate` },
            { label: "Cash Reserve", value: kpis.cashReserve, sub: "Savings accounts" },
            { label: "Overdue Invoices", value: kpis.overdueInvoicesTotal, sub: "Outstanding" },
          ].map((k) => (
            <div key={k.label} className="bg-card/80 rounded-xl border border-border p-5 shadow-sm">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{k.label}</div>
              <div className="text-2xl font-bold text-foreground">{formatCurrency(k.value)}</div>
              <div className="text-xs text-muted-foreground mt-1">{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="bg-card/80 rounded-xl border border-border p-6 shadow-md">
          <h3 className="text-sm font-semibold text-foreground mb-2">Tax Exposure Breakdown</h3>
          <p className="text-xs text-muted-foreground mb-5">Real-time liability calculated from business transactions</p>
          <div className="space-y-3">
            {[
              { label: "Corporate Tax", amount: kpis.taxProvision.corporateTaxDue },
              { label: "VAT Payable", amount: kpis.taxProvision.vatPayable },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center border-b border-border/30 pb-2.5">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-semibold text-foreground">{formatCurrency(item.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm font-semibold text-foreground">Total Tax Liability</span>
              <span className="text-base font-bold text-amber-400">{formatCurrency(kpis.taxExposure)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border/30">
              <span className="text-sm text-muted-foreground">Provisioned</span>
              <span className="text-sm font-bold text-emerald-500">{kpis.taxProvision.provisionedPct}%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 bg-muted/30 rounded-md p-3">
            Calculated from actual business revenue and applicable tax rates. Consult your accountant for accurate tax filings.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
