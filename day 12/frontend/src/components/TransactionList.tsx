import { Transaction } from "@/hooks/useTransactions";
import { getCategoryMeta, formatCurrency } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

type Props = {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
};

export const TransactionList = ({ transactions, onEdit, onDelete }: Props) => {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <div className="text-4xl mb-3">💸</div>
        <p className="font-medium">No transactions yet</p>
        <p className="text-sm text-muted-foreground mt-1">Add your first one to get started.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
      {transactions.map((t) => {
        const meta = getCategoryMeta(t.category);
        const isIncome = t.type === "income";
        return (
          <li key={t.id} className="group flex items-center gap-3 p-4 hover:bg-muted/40 transition-colors">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg" style={{ backgroundColor: `${meta.color}20` }}>
              {meta.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{t.title}</p>
              <p className="text-xs text-muted-foreground">{t.category} · {format(new Date(t.date), "MMM d, yyyy")}</p>
            </div>
            <div className="text-right">
              <p className={`font-display font-bold tabular-nums ${isIncome ? "text-income" : "text-expense"}`}>
                {isIncome ? "+" : "−"}{formatCurrency(t.amount)}
              </p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(t)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(t.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
