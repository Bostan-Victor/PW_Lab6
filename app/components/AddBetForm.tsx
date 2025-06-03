import React, { useState } from "react";
import type { Bet, BetType, BetOutcome } from "../types/Bet";
import { useAppState } from "../context/AppStateContext";
import { useNavigate } from "react-router";

const betTypes: BetType[] = ["Winner", "Total", "Handicap", "Other"];
const outcomes: BetOutcome[] = ["Pending", "Won", "Lost", "Draw"];

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function AddBetForm() {
  const { addBet, state } = useAppState();
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

      await addBet(newBet);
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
    <form
      className="space-y-6"
      onSubmit={handleSubmit}
      style={{
        background: "var(--bg-card)",
        color: "var(--text-main)",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      {feedback && (
        <div
          style={{
            background: feedback.type === "success" ? "#bbf7d0" : "#fecaca",
            color: feedback.type === "success" ? "#166534" : "#991b1b",
            borderRadius: 8,
            padding: "8px 0",
            textAlign: "center",
            marginBottom: 8,
          }}
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
          style={{
            background: "var(--bg-main)",
            color: "var(--text-main)",
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "8px 12px",
            width: "100%",
            marginBottom: 8,
          }}
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Bet Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={{
            background: "var(--bg-main)",
            color: "var(--text-main)",
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "8px 12px",
            width: "100%",
            marginBottom: 8,
          }}
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
            style={{
              background: "var(--bg-main)",
              color: "var(--text-main)",
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: "8px 12px",
              width: "100%",
              marginBottom: 8,
            }}
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
            style={{
              background: "var(--bg-main)",
              color: "var(--text-main)",
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: "8px 12px",
              width: "100%",
              marginBottom: 8,
            }}
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
          style={{
            background: "var(--bg-main)",
            color: "var(--text-main)",
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "8px 12px",
            width: "100%",
            marginBottom: 8,
          }}
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
          style={{
            background: "var(--bg-main)",
            color: "var(--text-main)",
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "8px 12px",
            width: "100%",
            marginBottom: 8,
          }}
          rows={2}
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="favorite"
          checked={form.favorite}
          onChange={handleChange}
          style={{
            accentColor: "var(--accent)",
            marginRight: 8,
          }}
        />
        <label className="font-semibold">Favorite</label>
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          style={{
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 0",
            width: "100%",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            transition: "background 0.2s",
          }}
        >
          Add Bet
        </button>
        <button
          type="button"
          onClick={handleCancel}
          style={{
            background: "#aaa",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 0",
            width: "100%",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            transition: "background 0.2s",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}