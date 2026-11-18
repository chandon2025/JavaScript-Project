import { useMemo, useState } from "react";
import { useTransactions, useDeleteTransaction, Transaction } from "@/hooks/useTransactions";
import { TransactionDialog } from "@/components/TransactionDialog";
import { TransactionList } from "@/components/TransactionList";
import { Button } from "@/components/ui/button";
import { ArrowDownLeft, ArrowUpRight, Plus, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/categories";

const StatCard = ({ label, value, icon: Icon, accent, sub }: { label: string; value: string; icon: React.ElementType; accent: string; sub?: string }) => (
  <div className="stat-card animate-slide-up">
    <div className="relative flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="font-display text-3xl font-bold tabular-nums tracking-tight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  </div>
);

export default function Dashboard() {
  const { data: txs = [], isLoading } = useTransactions();
  const del = useDeleteTransaction();
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [open, setOpen] = useState(false);

  const stats = useMemo(() => {
    const income = txs.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = txs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const now = new Date();
    const monthExp = txs.filter(t => t.type === "expense" && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear()).reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense, monthExp };
  }, [txs]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Your financial pulse, at a glance.</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="h-11 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-glow">
          <Plus className="h-4 w-4 mr-1.5" /> Quick add
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Balance" value={formatCurrency(stats.balance)} icon={Wallet} accent="bg-gradient-primary text-primary-foreground" sub="Total income − expenses" />
        <StatCard label="Total income" value={formatCurrency(stats.income)} icon={ArrowDownLeft} accent="bg-income/15 text-income" />
        <StatCard label="Total expenses" value={formatCurrency(stats.expense)} icon={ArrowUpRight} accent="bg-expense/15 text-expense" sub={`${formatCurrency(stats.monthExp)} this month`} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recent activity</h2>
          <span className="text-xs text-muted-foreground">{txs.length} total</span>
        </div>
        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-12 flex justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <TransactionList
            transactions={txs.slice(0, 10)}
            onEdit={(t) => { setEditing(t); setOpen(true); }}
            onDelete={(id) => del.mutate(id)}
          />
        )}
      </div>

      <TransactionDialog open={open} onOpenChange={setOpen} initial={editing} />
    </div>
  );
}
