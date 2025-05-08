export type WalletTransactionType = "deposit" | "withdrawal" | "bet" | "payout";

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amount: number;
  date: string; // ISO string
  betId?: string; // optional, links to Bet if type is bet/payout
}