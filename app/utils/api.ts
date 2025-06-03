import type { Bet } from "../types/Bet";
import type { Wallet } from "../types/Wallet";
import type { WalletTransaction } from "../types/WalletTransaction";

const API_BASE = "http://localhost:8000";

// --- JWT Token helpers ---
export function setToken(token: string) {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("jwt_token", token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem("jwt_token");
  }
  return null;
}

export function clearToken() {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.removeItem("jwt_token");
  }
}

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth: boolean = true
): Promise<T> {
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.headers && typeof options.headers === "object" && !(options.headers instanceof Headers)) {
    headers = { ...headers, ...(options.headers as Record<string, string>) };
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new AuthError("Authentication failed or token expired");
    }
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || res.statusText);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

// --- Auth ---
export async function apiLogin(role: "USER" | "VISITOR") {
  const data = await request<{ access_token: string }>(
    "/token",
    {
      method: "POST",
      body: JSON.stringify(role),
      headers: { "Content-Type": "application/json" },
    },
    false
  );
  setToken(data.access_token);
  return data.access_token;
}

// --- Bets ---
export async function apiGetBets(params?: {
  skip?: number;
  limit?: number;
  outcome?: string;
  type?: string;
  favorite?: boolean;
}) {
  const url = new URL(`${API_BASE}/bets`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
    });
  }
  return request<Bet[]>(url.pathname + url.search);
}

export async function apiGetBet(id: string) {
  return request<Bet>(`/bets/${id}`);
}

export async function apiAddBet(bet: Bet) {
  return request<Bet>("/bets", {
    method: "POST",
    body: JSON.stringify(bet),
  });
}

export async function apiUpdateBet(bet: Bet) {
  return request<Bet>(`/bets/${bet.id}`, {
    method: "PUT",
    body: JSON.stringify(bet),
  });
}

export async function apiDeleteBet(id: string) {
  return request<void>(`/bets/${id}`, { method: "DELETE" });
}

// --- Wallet ---
export async function apiGetWallet() {
  return request<Wallet>("/wallet");
}

// --- Wallet Transactions ---
export async function apiGetWalletTransactions(params?: { skip?: number; limit?: number }) {
  const url = new URL(`${API_BASE}/wallet/transactions`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
    });
  }
  return request<WalletTransaction[]>(url.pathname + url.search);
}

export async function apiGetWalletTransaction(id: string) {
  return request<WalletTransaction>(`/wallet/transactions/${id}`);
}

export async function apiAddWalletTransaction(tx: WalletTransaction) {
  return request<WalletTransaction>("/wallet/transactions", {
    method: "POST",
    body: JSON.stringify(tx),
  });
}

export async function apiDeleteWalletTransaction(id: string) {
  return request<void>(`/wallet/transactions/${id}`, { method: "DELETE" });
}

export { AuthError };