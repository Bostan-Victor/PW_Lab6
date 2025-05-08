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
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

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
        Add Bet
      </button>
    </form>
  );
}