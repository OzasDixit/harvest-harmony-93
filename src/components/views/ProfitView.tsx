import { useState, useMemo } from "react";
import { Gauge, Download, TrendingUp, DollarSign, PieChart as PieIcon, ArrowUpRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ProfitViewProps {
  notify?: (msg: string) => void;
}

export function ProfitView({ notify }: ProfitViewProps) {
  const financialSummary = {
    grossRevenue: 530700, // 122 quintals * ₹4350
    seedFertilizerCost: 110000,
    irrigationCost: 28000,
    labourCost: 45000,
    storageCost: 42000,
    logisticsCost: 9400,
  };

  const totalExpense =
    financialSummary.seedFertilizerCost +
    financialSummary.irrigationCost +
    financialSummary.labourCost +
    financialSummary.storageCost +
    financialSummary.logisticsCost;

  const netProfit = financialSummary.grossRevenue - totalExpense;
  const roiMargin = Math.round((netProfit / financialSummary.grossRevenue) * 100);

  const costBreakdownData = [
    { name: "Seed & Fertilizer", value: financialSummary.seedFertilizerCost, color: "oklch(0.68 0.17 145)" },
    { name: "Labour & Tillage", value: financialSummary.labourCost, color: "oklch(0.78 0.14 82)" },
    { name: "Cold Storage", value: financialSummary.storageCost, color: "oklch(0.71 0.12 194)" },
    { name: "Irrigation & Drip", value: financialSummary.irrigationCost, color: "oklch(0.69 0.16 43)" },
    { name: "Logistics", value: financialSummary.logisticsCost, color: "oklch(0.47 0.035 145)" },
  ];

  const exportFinancials = () => {
    const report = [
      "VERDANT AGRIDECK · FARM PROFIT & LOSS REPORT",
      `Gross Revenue: ₹${financialSummary.grossRevenue.toLocaleString("en-IN")}`,
      `Total Cost: ₹${totalExpense.toLocaleString("en-IN")}`,
      `Net Profit: ₹${netProfit.toLocaleString("en-IN")}`,
      `ROI Margin: ${roiMargin}%`,
      "------------------------------------------",
      `Seed & Fertilizer: ₹${financialSummary.seedFertilizerCost.toLocaleString("en-IN")}`,
      `Labour: ₹${financialSummary.labourCost.toLocaleString("en-IN")}`,
      `Cold Storage: ₹${financialSummary.storageCost.toLocaleString("en-IN")}`,
      `Irrigation: ₹${financialSummary.irrigationCost.toLocaleString("en-IN")}`,
      `Logistics: ₹${financialSummary.logisticsCost.toLocaleString("en-IN")}`,
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "farm-financial-pnl-report.txt";
    link.click();
    URL.revokeObjectURL(url);
    if (notify) notify("Financial P&L Report exported");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-panel p-5 ring-1 ring-line">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gold">
              <Gauge className="size-4 text-gold" /> Farm Financial Cockpit
            </div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Profitability & Cost Analytics
            </h2>
            <p className="mt-1 text-sm text-mute">
              Comprehensive Financial P&L audit for Kharif Season (6.4 Acres Soybean).
            </p>
          </div>

          <button type="button" onClick={exportFinancials} className="action-primary text-xs">
            <Download className="size-3.5" /> Download P&L Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md bg-panel p-4 ring-1 ring-line">
          <div className="text-xs text-faint uppercase tracking-wider">Gross Sales Revenue</div>
          <div className="mt-1 font-mono text-2xl font-bold text-ink">
            ₹{financialSummary.grossRevenue.toLocaleString("en-IN")}
          </div>
          <div className="mt-1 text-xs text-mute">122 Quintals @ ₹4,350/q</div>
        </div>

        <div className="rounded-md bg-panel p-4 ring-1 ring-line">
          <div className="text-xs text-faint uppercase tracking-wider">Total Season Expenses</div>
          <div className="mt-1 font-mono text-2xl font-bold text-risk">
            -₹{totalExpense.toLocaleString("en-IN")}
          </div>
          <div className="mt-1 text-xs text-mute">Includes seeds, ferts, labor, storage</div>
        </div>

        <div className="rounded-md bg-panel p-4 ring-1 ring-leaf/40 bg-leaf/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-faint uppercase tracking-wider">Expected Net Profit</span>
            <span className="rounded bg-leaf/20 px-2 py-0.5 text-xs font-bold text-leaf">{roiMargin}% ROI</span>
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-leaf">
            ₹{netProfit.toLocaleString("en-IN")}
          </div>
          <div className="mt-1 text-xs text-leaf font-medium flex items-center gap-1">
            <ArrowUpRight className="size-3" /> +₹39,000 net gain from storage timing
          </div>
        </div>
      </div>

      {/* Expense Distribution Chart */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md bg-panel p-4 ring-1 ring-line flex flex-col items-center justify-center">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-mute mb-3 self-start">
            Expense Allocation Breakdown
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.24 0.028 145)",
                    borderColor: "oklch(0.32 0.035 145)",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Cost"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-md bg-panel p-4 ring-1 ring-line">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-mute mb-3">
            Itemized Expense Ledger
          </h3>
          <div className="divide-y divide-line/60 text-xs">
            {costBreakdownData.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-ink font-medium">{item.name}</span>
                </div>
                <span className="font-mono text-mute">₹{item.value.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
