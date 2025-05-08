import React from "react";
import { useAppState } from "../context/AppStateContext";

export default function WalletPanel() {
  const { state } = useAppState();
  const wallet = state.wallet;

  if (!wallet) return null;

  return (
    <div className="mb-8 p-6 rounded-2xl shadow-lg bg-white/40 dark:bg-gray-900/60 border border-white/30 dark:border-gray-800/60 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Wallet</h2>
        <span className="text-2xl font-extrabold text-green-600 dark:text-green-400">
          ${wallet.balance.toFixed(2)}
        </span>
      </div>
      <div>
        <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Transactions</h3>
        {wallet.transactions.length === 0 ? (
          <div className="text-gray-400 text-sm">No transactions yet.</div>
        ) : (
          <ul className="max-h-48 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-800">
            {wallet.transactions.map((tx) => (
              <li key={tx.id} className="py-2 flex items-center justify-between text-sm">
                <span>
                  {tx.type === "deposit" && <span className="text-green-600">Deposit</span>}
                  {tx.type === "withdrawal" && <span className="text-red-600">Withdrawal</span>}
                  {tx.type === "bet" && <span className="text-blue-600">Bet</span>}
                  {tx.type === "payout" && <span className="text-yellow-600">Payout</span>}
                  <span className="ml-2 text-gray-500">{new Date(tx.date).toLocaleString()}</span>
                </span>
                <span
                  className={
                    tx.type === "deposit" || tx.type === "payout"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {tx.type === "deposit" || tx.type === "payout" ? "+" : "-"}${tx.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}