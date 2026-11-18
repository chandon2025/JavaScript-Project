import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type Transaction = {
  id: string;
  user_id: string;
  type: "income" | "expense";
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type TransactionInput = Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">;

export const useTransactions = (filters?: { type?: string; category?: string; search?: string }) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["transactions", user?.id, filters],
    enabled: !!user,
    queryFn: async () => {
      const res = await transactionsApi.getAll(filters);
      return (res.data || []) as Transaction[];
    },
  });
};

export const useCreateTransaction = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: TransactionInput) => {
      if (!user) throw new Error("Not authenticated");
      return await transactionsApi.create(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction added");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useUpdateTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: TransactionInput & { id: string }) => {
      return await transactionsApi.update(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useDeleteTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await transactionsApi.delete(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};
