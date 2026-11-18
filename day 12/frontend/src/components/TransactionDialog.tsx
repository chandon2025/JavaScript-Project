import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/categories";
import { useCreateTransaction, useUpdateTransaction, Transaction } from "@/hooks/useTransactions";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["income", "expense"]),
  title: z.string().trim().min(1, "Required").max(100),
  amount: z.number().positive("Must be > 0").max(1_000_000_000),
  category: z.string().min(1),
  date: z.string().min(1),
  notes: z.string().max(500).optional().nullable(),
});

type Props = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
  initial?: Transaction | null;
};

export const TransactionDialog = ({ trigger, open: openProp, onOpenChange, initial }: Props) => {
  const [openInternal, setOpenInternal] = useState(false);
  const open = openProp ?? openInternal;
  const setOpen = onOpenChange ?? setOpenInternal;

  const create = useCreateTransaction();
  const update = useUpdateTransaction();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (initial) {
        setType(initial.type);
        setTitle(initial.title);
        setAmount(String(initial.amount));
        setCategory(initial.category);
        setDate(initial.date);
        setNotes(initial.notes ?? "");
      } else {
        setType("expense"); setTitle(""); setAmount(""); setCategory("");
        setDate(new Date().toISOString().slice(0, 10)); setNotes("");
      }
      setErrors({});
    }
  }, [open, initial]);

  const cats = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ type, title, amount: Number(amount), category, date, notes: notes || null });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach(i => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    const payload = {
      type: parsed.data.type,
      title: parsed.data.title,
      amount: parsed.data.amount,
      category: parsed.data.category,
      date: parsed.data.date,
      notes: parsed.data.notes ?? null,
    };
    if (initial) {
      await update.mutateAsync({ id: initial.id, ...payload });
    } else {
      await create.mutateAsync(payload);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{initial ? "Edit" : "New"} Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Tabs value={type} onValueChange={(v) => { setType(v as "income" | "expense"); setCategory(""); }}>
            <TabsList className="grid w-full grid-cols-2 h-11">
              <TabsTrigger value="expense" className="data-[state=active]:bg-expense/15 data-[state=active]:text-expense">Expense</TabsTrigger>
              <TabsTrigger value="income" className="data-[state=active]:bg-income/15 data-[state=active]:text-income">Income</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Coffee, Salary…" maxLength={100} />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {cats.map(c => (
                  <SelectItem key={c.value} value={c.value}>
                    <span className="flex items-center gap-2"><span>{c.icon}</span>{c.value}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} maxLength={500} rows={2} />
          </div>

          <Button type="submit" className="w-full h-11 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-glow" disabled={create.isPending || update.isPending}>
            {initial ? "Save changes" : "Add transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
