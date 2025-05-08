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
  const { dispatch, state } = useAppState();
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
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" && (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "amount" || name === "odds"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (state.wallet && form.amount > state.wallet.balance) {
      setFeedback({ type: "error", message: "Insufficient wallet balance to place this bet." });
      return;
    }

    try {
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
      setFeedback({ type: "success", message: "Bet added successfully!" });
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setFeedback({ type: "error", message: "Failed to add bet. Please try again." });
    }
  }

  function handleCancel(e: React.MouseEvent) {
    e.preventDefault();
    navigate("/");
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
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
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition"
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Bet Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition"
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
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition"
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
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition"
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
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition"
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
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition"
          rows={2}
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="favorite"
          checked={form.favorite}
          onChange={handleChange}
          className="mr-2 accent-fuchsia-600"
        />
        <label className="font-semibold">Favorite</label>
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
        >
          Add Bet
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="w-full bg-gradient-to-r from-gray-400 via-gray-500 to-gray-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}