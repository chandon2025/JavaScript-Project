export const CATEGORIES = [
  { value: "Food", icon: "🍔", color: "hsl(25 95% 60%)" },
  { value: "Transport", icon: "🚗", color: "hsl(210 95% 60%)" },
  { value: "Shopping", icon: "🛍️", color: "hsl(330 80% 65%)" },
  { value: "Bills", icon: "📄", color: "hsl(45 95% 55%)" },
  { value: "Entertainment", icon: "🎬", color: "hsl(280 80% 65%)" },
  { value: "Health", icon: "💊", color: "hsl(0 80% 65%)" },
  { value: "Travel", icon: "✈️", color: "hsl(190 85% 55%)" },
  { value: "Education", icon: "📚", color: "hsl(160 70% 50%)" },
  { value: "Salary", icon: "💼", color: "hsl(158 84% 50%)" },
  { value: "Freelance", icon: "💻", color: "hsl(220 70% 60%)" },
  { value: "Investment", icon: "📈", color: "hsl(140 70% 55%)" },
  { value: "Other", icon: "📦", color: "hsl(220 10% 60%)" },
] as const;

export const EXPENSE_CATEGORIES = CATEGORIES.filter(c => !["Salary", "Freelance", "Investment"].includes(c.value));
export const INCOME_CATEGORIES = CATEGORIES.filter(c => ["Salary", "Freelance", "Investment", "Other"].includes(c.value));

export const getCategoryMeta = (name: string) =>
  CATEGORIES.find(c => c.value === name) || { value: name, icon: "📦", color: "hsl(220 10% 60%)" };

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
