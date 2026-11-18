const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const getToken = (): string | null => {
  return localStorage.getItem("expense_auth_token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("expense_auth_token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("expense_auth_token");
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ success: boolean; token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, fullName: string) =>
    apiRequest<{ success: boolean; token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, fullName }),
    }),

  getMe: () =>
    apiRequest<{ success: boolean; user: any }>("/auth/me"),
};

export const transactionsApi = {
  getAll: (params?: { type?: string; category?: string; search?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.type && params.type !== "all") query.append("type", params.type);
    if (params?.category && params.category !== "all") query.append("category", params.category);
    if (params?.search) query.append("search", params.search);
    if (params?.limit) query.append("limit", params.limit.toString());
    const qs = query.toString();
    return apiRequest<{ success: boolean; count: number; data: any[] }>(`/transactions${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string) =>
    apiRequest<{ success: boolean; data: any }>(`/transactions/${id}`),

  create: (transaction: any) =>
    apiRequest<{ success: boolean; data: any }>("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    }),

  update: (id: string, transaction: any) =>
    apiRequest<{ success: boolean; data: any }>(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(transaction),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean; message: string }>(`/transactions/${id}`, {
      method: "DELETE",
    }),

  getSummary: () =>
    apiRequest<{ success: boolean; data: { income: number; expense: number; balance: number; monthExp: number } }>("/transactions/summary"),
};

export const userApi = {
  getProfile: () =>
    apiRequest<{ success: boolean; data: any }>("/user/profile"),

  updateProfile: (profile: { displayName?: string; avatarUrl?: string }) =>
    apiRequest<{ success: boolean; data: any }>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    }),
};
