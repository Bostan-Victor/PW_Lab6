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
    <form onSubmit={handleSubmit} className="mb-8 flex flex-col sm:flex-row items-center gap-4">
      <select
        value={type}
        onChange={(e) => setType(e.target.value as "deposit" | "withdrawal")}
        className="rounded px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition"
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
        className="rounded px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200"
      >
        {type === "deposit" ? "Deposit" : "Withdraw"}
      </button>
      {feedback && (
        <span className="ml-2 text-sm font-medium text-green-600">{feedback}</span>
      )}
    </form>
  );
}