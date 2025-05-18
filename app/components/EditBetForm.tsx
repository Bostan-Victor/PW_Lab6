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
    const { name, value, type } = e.target;
    const checked = type === "checkbox" && (e.target as HTMLInputElement).checked;
    setForm((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : name === "amount" || name === "odds"
            ? Number(value)
            : value,
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form || !bet) return;

    const amountDiff = form.amount - bet.amount;
    if (state.wallet && amountDiff > state.wallet.balance) {
      setFeedback({ type: "error", message: "Insufficient wallet balance to increase this bet." });
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
        Save Changes
      </button>
    </form>
  );
}