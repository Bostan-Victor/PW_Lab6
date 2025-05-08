import React from "react";
import { useAppState } from "../context/AppStateContext";
import { Link } from "react-router";

export default function DashboardPage() {
  const { state } = useAppState();
  const bets = state.bets;

  const totalBets = bets.length;
  const totalWon = bets.filter((b) => b.outcome === "Won").length;
  const totalLost = bets.filter((b) => b.outcome === "Lost").length;
  const totalDraw = bets.filter((b) => b.outcome === "Draw").length;
  const totalPending = bets.filter((b) => b.outcome === "Pending").length;
  const totalProfit = bets.reduce((sum, b) => sum + b.profit, 0);
  const winRate = totalBets > 0 ? ((totalWon / totalBets) * 100).toFixed(1) : "0";
  const avgBetAmount = totalBets > 0 ? (bets.reduce((sum, b) => sum + b.amount, 0) / totalBets).toFixed(2) : "0.00";
  const biggestWin = bets.reduce((max, b) => (b.profit > max ? b.profit : max), 0);
  const biggestLoss = bets.reduce((min, b) => (b.profit < min ? b.profit : min), 0);

  return (
    <main className="relative min-h-screen flex flex-col items-center bg-gradient-to-tr from-blue-900 via-purple-800 to-pink-700 animate-gradient-x py-12 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] max-w-2xl blur-3xl opacity-40 bg-gradient-to-br from-blue-400 via-fuchsia-400 to-pink-400 rounded-full -z-10" />
      <div className="w-full max-w-3xl backdrop-blur bg-white/30 dark:bg-gray-900/40 rounded-2xl shadow-2xl border border-white/30 dark:border-gray-800/60 p-10 z-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 drop-shadow-lg animate-glow">
            Dashboard
          </h1>
          <Link
            to="/"
            className="text-sm px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 text-white font-semibold shadow hover:scale-105 transition"
          >
            Home
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
          <div className="dashboard-card">
            <span className="text-blue-500 text-3xl mb-2">🎲</span>
            <span className="text-xs text-gray-200">Total Bets</span>
            <span className="text-2xl font-bold text-white tracking-widest">
              {totalBets}
            </span>
          </div>
          <div className="dashboard-card">
            <span className="text-green-400 text-3xl mb-2">🏆</span>
            <span className="text-xs text-gray-200">Won</span>
            <span className="text-2xl font-bold text-green-200 tracking-widest">
              {totalWon}
            </span>
          </div>
          <div className="dashboard-card">
            <span className="text-red-400 text-3xl mb-2">💔</span>
            <span className="text-xs text-gray-200">Lost</span>
            <span className="text-2xl font-bold text-red-200 tracking-widest">
              {totalLost}
            </span>
          </div>
          <div className="dashboard-card">
            <span className="text-gray-400 text-3xl mb-2">🤝</span>
            <span className="text-xs text-gray-200">Draw</span>
            <span className="text-2xl font-bold text-gray-200 tracking-widest">
              {totalDraw}
            </span>
          </div>
          <div className="dashboard-card">
            <span className="text-yellow-400 text-3xl mb-2">⏳</span>
            <span className="text-xs text-gray-200">Pending</span>
            <span className="text-2xl font-bold text-yellow-200 tracking-widest">
              {totalPending}
            </span>
          </div>
          <div className="dashboard-card">
            <span className="text-yellow-300 text-3xl mb-2">💰</span>
            <span className="text-xs text-gray-200">Total Profit</span>
            <span className={`text-2xl font-bold tracking-widest ${totalProfit > 0 ? "text-green-300" : totalProfit < 0 ? "text-red-300" : "text-white"}`}>
              {Number(totalProfit).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="dashboard-card">
            <span className="text-fuchsia-400 text-3xl mb-2">📈</span>
            <span className="text-xs text-gray-200">Win Rate</span>
            <span className="text-2xl font-bold text-fuchsia-200 tracking-widest">
              {winRate}%
            </span>
          </div>
          <div className="dashboard-card">
            <span className="text-blue-300 text-3xl mb-2">💵</span>
            <span className="text-xs text-gray-200">Avg Bet</span>
            <span className="text-2xl font-bold text-blue-200 tracking-widest">
              ${Number(avgBetAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="dashboard-card">
            <span className="text-green-400 text-2xl mb-2">🏅</span>
            <span className="text-xs text-gray-200">Biggest Win</span>
            <span className="text-xl font-bold text-green-200 tracking-widest">
              ${Number(biggestWin).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="dashboard-card">
            <span className="text-red-400 text-2xl mb-2">💣</span>
            <span className="text-xs text-gray-200">Biggest Loss</span>
            <span className="text-xl font-bold text-red-200 tracking-widest">
              ${Number(biggestLoss).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
      <style>
        {`
        .dashboard-card {
          @apply backdrop-blur bg-white/20 dark:bg-gray-900/40 rounded-2xl shadow-lg p-6 flex flex-col items-center border border-white/20 dark:border-gray-800/40 transition-transform duration-300 hover:scale-105 hover:shadow-fuchsia-400/30;
          box-shadow: 0 4px 32px 0 rgba(124,58,237,0.08), 0 1.5px 8px 0 rgba(236,72,153,0.08);
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 10s ease-in-out infinite;
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 32px #fff7, 0 0 8px #a5b4fc; }
          50% { text-shadow: 0 0 64px #f0abfc, 0 0 16px #818cf8; }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        `}
      </style>
    </main>
  );
}