import { useMemo, useState } from "react";
import { useTransactions, useDeleteTransaction, Transaction } from "@/hooks/useTransactions";
import { TransactionList } from "@/components/TransactionList";
import { TransactionDialog } from "@/components/TransactionDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

export default function AddPage() {
  const { data: txs = [] } = useTransactions();
  const del = useDeleteTransaction();
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [type, setType] = useState<string>("all");

  const filtered = useMemo(() => {
    return txs.filter(t => {
      if (q && !t.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat !== "all" && t.category !== cat) return false;
      if (type !== "all" && t.type !== type) return false;
      return true;
    });
  }, [txs, q, cat, type]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1 text-sm">Add, edit, and search every entry.</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="h-11 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-glow">
          <Plus className="h-4 w-4 mr-1.5" /> New
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by title…" className="pl-9 h-11" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-11 sm:w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="h-11 sm:w-[170px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map(c => (
              <SelectItem key={c.value} value={c.value}>{c.icon} {c.value}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TransactionList
        transactions={filtered}
        onEdit={(t) => { setEditing(t); setOpen(true); }}
        onDelete={(id) => del.mutate(id)}
      />

      <TransactionDialog open={open} onOpenChange={setOpen} initial={editing} />
    </div>
  );
}
