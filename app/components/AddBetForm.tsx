import React, { useState } from "react";
import type { Bet, BetType, BetOutcome } from "../types/Bet";
import { useAppState } from "../context/AppStateContext";
import { put } from "../utils/db";
import { useNavigate } from "react-router";

const betTypes: BetType[] = ["Winner", "Total", "Handicap", "Other"];
const outcomes: BetOutcome[] = ["Pending", "Won", "Lost", "Draw"];

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function AddBetForm() {
  const { dispatch } = useAppState();
  const navigate = useNavigate();
  const [form, setForm] = useState<Omit<Bet, "id" | "payout" | "profit">>({
    date: new Date().toISOString().slice(0, 16),
    type: "Winner",
    amount: 0,
    odds: 1,
    outcome: "Pending",
    notes: "",
    favorite: false,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const checked = type === "checkbox" && (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payout = form.outcome === "Won" ? form.amount * form.odds : 0;
    const profit =
      form.outcome === "Won"
        ? form.amount * (form.odds - 1)
        : form.outcome === "Lost"
        ? -form.amount
        : 0;

    const newBet: Bet = {
      ...form,
      id: generateId(),
      payout,
      profit,
    };

    dispatch({ type: "ADD_BET", bet: newBet });
    await put("bets", newBet);
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
        Add Bet
      </button>
    </form>
  );
}