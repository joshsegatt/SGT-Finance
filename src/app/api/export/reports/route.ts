import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCashFlowReport, getCategoryReport } from "@/lib/data";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "cashflow";

  if (type === "categories") {
    const data = await getCategoryReport(session.user.id);
    const rows = [
      ["Category", "Income (GBP)", "Expenses (GBP)", "Net (GBP)"],
      ...data.map((r) => [
        r.category,
        r.income.toFixed(2),
        r.expense.toFixed(2),
        (r.income - r.expense).toFixed(2),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="categories-report.csv"`,
      },
    });
  }

  // Default: cashflow
  const months = parseInt(searchParams.get("months") ?? "12", 10);
  const data = await getCashFlowReport(session.user.id, months);
  const rows = [
    ["Month", "Income (GBP)", "Expenses (GBP)", "Net (GBP)"],
    ...data.map((r) => [
      r.month,
      r.income.toFixed(2),
      r.expense.toFixed(2),
      (r.income - r.expense).toFixed(2),
    ]),
  ];
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="cashflow-report.csv"`,
    },
  });
}
