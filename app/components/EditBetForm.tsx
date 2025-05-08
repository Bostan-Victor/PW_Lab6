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
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form || !bet) return;

    try {
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
      await put("bets", updatedBet);
      setFeedback({ type: "success", message: "Bet updated successfully!" });
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setFeedback({ type: "error", message: "Failed to update bet. Please try again." });
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {feedback && (
        <div
          className={`p-2 rounded text-sm mb-2 text-center ${
            feedback.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      )}
      <div>
        <label className="block font-semibold mb-1">Date & Time</label>
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Bet Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {betTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            min={0}
            step={0.01}
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">Odds</label>
          <input
            type="number"
            name="odds"
            value={form.odds}
            onChange={handleChange}
            min={1}
            step={0.01}
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-1">Outcome</label>
        <select
          name="outcome"
          value={form.outcome}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {outcomes.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={2}
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="favorite"
          checked={form.favorite}
          onChange={handleChange}
          className="mr-2 accent-blue-600"
        />
        <label className="font-semibold">Favorite</label>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Save Changes
      </button>
    </form>
  );
}