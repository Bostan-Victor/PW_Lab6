import React, { useState, useEffect } from "react";
import type { Bet, BetType, BetOutcome } from "../types/Bet";
import { useAppState } from "../context/AppStateContext";
import { put } from "../utils/db";
import { useParams, useNavigate } from "react-router";

const betTypes: BetType[] = ["Winner", "Total", "Handicap", "Other"];
const outcomes: BetOutcome[] = ["Pending", "Won", "Lost", "Draw"];

export default function EditBetForm() {
  const { state, dispatch } = useAppState();
  const params = useParams();
  const navigate = useNavigate();
  const betId = params.id as string;
  const bet = state.bets.find((b) => b.id === betId);

  const [form, setForm] = useState<Omit<Bet, "id" | "payout" | "profit"> | null>(null);

  useEffect(() => {
    if (bet) {
      setForm({
        date: bet.date,
        type: bet.type,
        amount: bet.amount,
        odds: bet.odds,
        outcome: bet.outcome,
        notes: bet.notes || "",
        favorite: bet.favorite,
      });
    }
  }, [bet]);

  if (!bet || !form) {
    return <div>Bet not found.</div>;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const checked = type === "checkbox" && (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev!,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form || !bet) return;

    const payout = form.outcome === "Won" ? form.amount * form.odds : 0;
    const profit =
      form.outcome === "Won"
        ? form.amount * (form.odds - 1)
        : form.outcome === "Lost"
        ? -form.amount
        : 0;

    const updatedBet: Bet = {
      ...form,
      id: bet.id,
      payout,
      profit,
    };

    dispatch({
      type: "SET_BETS",
      bets: state.bets.map((b) => (b.id === bet.id ? updatedBet : b)),
    });
    put("bets", updatedBet);
    navigate("/");
  }

  return (
    <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
      <div>
        <label className="block font-medium">Date & Time</label>
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Bet Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        >
          {betTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium">Amount</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          min={0}
          step={0.01}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Odds</label>
        <input
          type="number"
          name="odds"
          value={form.odds}
          onChange={handleChange}
          min={1}
          step={0.01}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Outcome</label>
        <select
          name="outcome"
          value={form.outcome}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        >
          {outcomes.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="favorite"
          checked={form.favorite}
          onChange={handleChange}
          className="mr-2"
        />
        <label>Favorite</label>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </form>
  );
}