import React from "react";
import { Link } from "react-router";
import BetList from "../components/BetList";
import { useAppState } from "../context/AppStateContext";

function DashboardSummary() {
  const { state } = useAppState();
  const totalBets = state.bets.length;
  const totalWon = state.bets.filter((b) => b.outcome === "Won").length;
  const totalLost = state.bets.filter((b) => b.outcome === "Lost").length;
  const totalProfit = state.bets.reduce((sum, b) => sum + b.profit, 0);
  const winRate = totalBets > 0 ? Math.round((totalWon / totalBets) * 100) : 0;

  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
      <div className="backdrop-blur bg-white/30 dark:bg-gray-900/40 rounded-2xl shadow-lg p-6 flex flex-col items-center border border-white/30 dark:border-gray-800/60">
        <span className="text-blue-500 text-3xl mb-2">🎲</span>
        <span className="text-gray-700 dark:text-gray-200 text-xs">Total Bets</span>
        <span className="text-2xl font-bold">{totalBets}</span>
      </div>
      <div className="backdrop-blur bg-white/30 dark:bg-gray-900/40 rounded-2xl shadow-lg p-6 flex flex-col items-center border border-white/30 dark:border-gray-800/60">
        <span className="text-green-500 text-3xl mb-2">🏆</span>
        <span className="text-gray-700 dark:text-gray-200 text-xs">Won</span>
        <span className="text-2xl font-bold text-green-600">{totalWon}</span>
      </div>
      <div className="backdrop-blur bg-white/30 dark:bg-gray-900/40 rounded-2xl shadow-lg p-6 flex flex-col items-center border border-white/30 dark:border-gray-800/60">
        <span className="text-red-500 text-3xl mb-2">💔</span>
        <span className="text-gray-700 dark:text-gray-200 text-xs">Lost</span>
        <span className="text-2xl font-bold text-red-600">{totalLost}</span>
      </div>
      <div className="backdrop-blur bg-white/30 dark:bg-gray-900/40 rounded-2xl shadow-lg p-6 flex flex-col items-center border border-white/30 dark:border-gray-800/60">
        <span className="text-yellow-500 text-3xl mb-2">💰</span>
        <span className="text-gray-700 dark:text-gray-200 text-xs">Profit</span>
        <span className={`text-2xl font-bold ${totalProfit > 0 ? "text-green-600" : totalProfit < 0 ? "text-red-600" : ""}`}>
          {totalProfit}
        </span>
      </div>
      <div className="col-span-2 sm:col-span-4 flex justify-center mt-2">
        <span className="text-gray-500 text-xs">Win Rate</span>
        <span className="ml-2 text-lg font-semibold">{winRate}%</span>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-blue-900 via-purple-800 to-pink-700 animate-gradient-x" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] max-w-4xl blur-3xl opacity-40 bg-gradient-to-br from-blue-400 via-fuchsia-400 to-pink-400 rounded-full -z-10" />
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="flex flex-col items-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 drop-shadow-lg animate-glow">
            Bet Tracker
          </h1>
          <p className="mt-4 text-lg text-gray-200/90 dark:text-gray-300/90 text-center max-w-2xl">
            Track your bets, analyze your performance, and manage your wallet with style. <br />
            <span className="text-blue-200">Stay on top of your game!</span>
          </p>
        </header>
        {/* Dashboard Card */}
        <div className="mb-12">
          <DashboardSummary />
        </div>
        {/* Bet List Card */}
        <section className="relative">
          <div className="absolute -top-10 right-0 z-10">
            <Link
              to="/add-bet"
              className="inline-block bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 border-4 border-white/30"
            >
              + Add Bet
            </Link>
          </div>
          <div className="backdrop-blur bg-white/30 dark:bg-gray-900/40 rounded-2xl shadow-2xl border border-white/30 dark:border-gray-800/60 p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 tracking-tight">
              Your Bets
            </h2>
            <BetList />
          </div>
        </section>
      </main>
      <style>
        {`
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
    </div>
  );
}