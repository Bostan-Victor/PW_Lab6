import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";

export default function WalletForm() {
  const { dispatch, state } = useAppState();
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"deposit" | "withdrawal">("deposit");
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setFeedback("Enter a valid amount.");
      return;
    }
    if (type === "withdrawal" && state.wallet && num > state.wallet.balance) {
      setFeedback("Insufficient funds.");
      return;
    }
    dispatch({ type: type === "deposit" ? "DEPOSIT" : "WITHDRAW", amount: num });
    setFeedback(type === "deposit" ? "Deposit successful!" : "Withdrawal successful!");
    setAmount("");
    setTimeout(() => setFeedback(null), 1200);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: 32,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
      }}
    >
      <select
        value={type}
        onChange={(e) => setType(e.target.value as "deposit" | "withdrawal")}
        style={{
          borderRadius: 8,
          padding: "8px 12px",
          border: "1px solid #ccc",
          background: "var(--bg-main)",
          color: "var(--text-main)",
          transition: "background 0.3s, color 0.3s",
        }}
      >
        <option value="deposit">Deposit</option>
        <option value="withdrawal">Withdraw</option>
      </select>
      <input
        type="number"
        min={0}
        step={0.01}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        style={{
          borderRadius: 8,
          padding: "8px 12px",
          border: "1px solid #ccc",
          background: "var(--bg-main)",
          color: "var(--text-main)",
          transition: "background 0.3s, color 0.3s",
        }}
      />
      <button
        type="submit"
        style={{
          background: "var(--accent)",
          color: "#fff",
          padding: "8px 20px",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 16,
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
      >
        {type === "deposit" ? "Deposit" : "Withdraw"}
      </button>
      {feedback && (
        <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 500, color: "#22c55e" }}>{feedback}</span>
      )}
    </form>
  );
}