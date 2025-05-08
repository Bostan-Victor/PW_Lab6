export type BetOutcome = "Won" | "Lost" | "Draw" | "Pending";
export type BetType = "Winner" | "Total" | "Handicap" | "Other";

export interface Bet {
  id: string;
  date: string; // ISO string
  type: BetType;
  amount: number;
  odds: number;
  outcome: BetOutcome;
  payout: number; // auto-calculated
  profit: number; // auto-calculated
  notes?: string;
  favorite: boolean;
}