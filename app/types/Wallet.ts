import type { WalletTransaction } from "./WalletTransaction";

export interface Wallet {
  balance: number;
  transactions: WalletTransaction[];
}