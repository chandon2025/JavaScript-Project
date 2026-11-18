import { useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { getCategoryMeta, formatCurrency } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { format, subMonths, startOfMonth } from "date-fns";

export default function Reports() {
  const { data: txs = [] } = useTransactions();

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    txs.filter(t => t.type === "expense").forEach(t => {
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value, color: getCategoryMeta(name).color }));
  }, [txs]);

  const monthly = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => startOfMonth(subMonths(new Date(), 5 - i)));
    return months.map(m => {
      const monthTxs = txs.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear();
      });
      return {
        month: format(m, "MMM"),
        income: monthTxs.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0),
        expense: monthTxs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [txs]);

  const totalExpense = byCategory.reduce((s, c) => s + c.value, 0);

  const exportCSV = () => {
    const headers = ["Date", "Type", "Title", "Category", "Amount", "Notes"];
    const rows = txs.map(t => [t.date, t.type, t.title, t.category, t.amount, t.notes ?? ""].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `finch-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1 text-sm">Visualize where your money flows.</p>
        </div>
        <Button onClick={exportCSV} variant="outline" className="h-11">
          <Download className="h-4 w-4 mr-1.5" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Last 6 months</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Legend />
                <Bar dataKey="income" fill="hsl(var(--income))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" fill="hsl(var(--expense))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Spending by category</h3>
          {byCategory.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-sm text-muted-foreground">No expense data yet</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={byCategory} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3}>
                      {byCategory.map((c) => <Cell key={c.name} fill={c.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} formatter={(v: number) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-2">
                {byCategory.sort((a, b) => b.value - a.value).slice(0, 6).map(c => (
                  <li key={c.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />{c.name}</span>
                    <span className="font-medium tabular-nums">{((c.value / totalExpense) * 100).toFixed(0)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
