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
      <div className="text-center text-gray-300 py-8">
        No bets yet. <Link to="/add-bet" className="text-fuchsia-400 underline hover:text-pink-400 transition">Add your first bet</Link>!
      </div>
    );
  }

  return (
    <div>
      {feedback && (
        <div className="p-2 rounded text-sm mb-4 bg-green-100 text-green-800 text-center shadow-lg">{feedback}</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {state.bets.map((bet) => (
          <div
            key={bet.id}
            className="relative group bg-white/30 dark:bg-gray-900/40 border border-white/30 dark:border-gray-800/60 rounded-2xl shadow-2xl p-6 flex flex-col transition-transform duration-300 hover:scale-[1.03] hover:shadow-fuchsia-400/30 backdrop-blur-lg overflow-hidden"
          >
            <div className="absolute -inset-1 z-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-full h-full bg-gradient-to-tr from-blue-400 via-fuchsia-400 to-pink-400 blur-2xl opacity-40 animate-gradient-x rounded-2xl"></div>
            </div>
            {/* Favorite Star */}
            {bet.favorite && (
              <span
                title="Favorite"
                className="absolute top-4 right-4 text-yellow-400 text-2xl drop-shadow-lg z-10"
              >
                ★
              </span>
            )}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg text-gray-900 dark:text-gray-100 tracking-wide drop-shadow">
                  {bet.type}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow ${
                    bet.outcome === "Won"
                      ? "bg-green-200 text-green-800"
                      : bet.outcome === "Lost"
                      ? "bg-red-200 text-red-800"
                      : bet.outcome === "Draw"
                      ? "bg-gray-300 text-gray-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {bet.outcome}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 mb-2">
                <span className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                  💵 {bet.amount}
                </span>
                <span className="text-sm text-fuchsia-900 dark:text-fuchsia-200 font-medium">
                  🎯 {bet.odds}
                </span>
                <span className="text-sm text-yellow-900 dark:text-yellow-200 font-medium">
                  💸 {bet.payout}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">Profit: </span>
                <span
                  className={
                    bet.profit > 0
                      ? "text-green-500 font-bold"
                      : bet.profit < 0
                      ? "text-red-500 font-bold"
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
                  className="bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500 text-white px-4 py-1 rounded-full font-semibold text-sm shadow hover:scale-105 transition-transform"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(bet.id)}
                  className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white px-4 py-1 rounded-full font-semibold text-sm shadow hover:scale-105 transition-transform"
                  title="Delete bet"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>
        {`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease-in-out infinite;
        }
        `}
      </style>
    </div>
  );
}