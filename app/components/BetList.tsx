import { useAppState } from "../context/AppStateContext";
import { Link } from "react-router";
import { deleteById } from "../utils/db";
import React, { useState } from "react";

export default function BetList() {
  const { state, dispatch } = useAppState();
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (window.confirm("Are you sure you want to delete this bet?")) {
      dispatch({ type: "DELETE_BET", id });
      await deleteById("bets", id);
      setFeedback("Bet deleted.");
      setTimeout(() => setFeedback(null), 1200);
    }
  }

  if (state.bets.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No bets yet. <Link to="/add-bet" className="text-blue-600 underline">Add your first bet</Link>!
      </div>
    );
  }

  return (
    <div>
      {feedback && (
        <div className="p-2 rounded text-sm mb-4 bg-green-100 text-green-800 text-center">{feedback}</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.bets.map((bet) => (
          <div
            key={bet.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow hover:shadow-lg transition flex flex-col p-5 relative"
          >
            {bet.favorite && (
              <span
                title="Favorite"
                className="absolute top-3 right-3 text-yellow-400 text-xl"
              >
                ★
              </span>
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-lg">{bet.type}</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  bet.outcome === "Won"
                    ? "bg-green-100 text-green-700"
                    : bet.outcome === "Lost"
                    ? "bg-red-100 text-red-700"
                    : bet.outcome === "Draw"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {bet.outcome}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Amount:</span> {bet.amount}
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Odds:</span> {bet.odds}
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Payout:</span> {bet.payout}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Profit: </span>
              <span
                className={
                  bet.profit > 0
                    ? "text-green-600 font-semibold"
                    : bet.profit < 0
                    ? "text-red-600 font-semibold"
                    : "text-gray-700 dark:text-gray-300"
                }
              >
                {bet.profit}
              </span>
            </div>
            {bet.notes && (
              <div className="text-xs text-gray-500 italic mb-2">"{bet.notes}"</div>
            )}
            <div className="text-xs text-gray-400 mb-4">{bet.date}</div>
            <div className="flex gap-3 mt-auto">
              <Link
                to={`/edit-bet/${bet.id}`}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded hover:bg-blue-100 text-sm font-medium transition"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(bet.id)}
                className="bg-red-50 text-red-700 px-3 py-1 rounded hover:bg-red-100 text-sm font-medium transition"
                title="Delete bet"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}