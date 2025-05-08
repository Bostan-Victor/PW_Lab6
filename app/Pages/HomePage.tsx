import React from "react";
import { Link } from "react-router";
import BetList from "../components/BetList";
import { useAppState } from "../context/AppStateContext";
import WalletPanel from "../components/WalletPanel";
import WalletForm from "../components/WalletForm";

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
          {Number(totalProfit).toLocaleString(undefined, { maximumFractionDigits: 2 })}
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
  const { state } = useAppState();
  const wallet = state.wallet;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-blue-900 via-purple-800 to-pink-700 animate-gradient-x" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] max-w-4xl blur-3xl opacity-40 bg-gradient-to-br from-blue-400 via-fuchsia-400 to-pink-400 rounded-full -z-10" />
      <div className="absolute top-8 right-8 z-40">
        <Link
          to="/wallet"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-gray-900/80 shadow-lg border border-white/40 dark:border-gray-800/60 hover:scale-105 transition-all"
          title="View Wallet"
        >
          <span className="text-2xl text-yellow-500">👛</span>
          <span className="font-bold text-gray-800 dark:text-gray-100 text-lg">
            ${wallet ? wallet.balance.toFixed(2) : "0.00"}
          </span>
        </Link>
      </div>
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between mb-12">
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 drop-shadow-lg animate-glow">
              Bet Tracker
            </h1>
            <p className="mt-4 text-lg text-gray-200/90 dark:text-gray-300/90 text-center sm:text-left max-w-2xl">
              Track your bets, analyze your performance, and manage your wallet with style. <br />
              <span className="text-blue-200">Stay on top of your game!</span>
            </p>
          </div>
          <Link
            to="/dashboard"
            className="mt-6 sm:mt-0 px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 text-white font-semibold shadow hover:scale-105 transition"
          >
            Dashboard
          </Link>
        </header>
        {/* Dashboard Card */}
        <div className="mb-12">
          <DashboardSummary />
        </div>
        {/* Bet List Card */}
        <section className="relative">
          <div className="backdrop-blur bg-white/30 dark:bg-gray-900/40 rounded-2xl shadow-2xl border border-white/30 dark:border-gray-800/60 p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 tracking-tight">
              Your Bets
            </h2>
            <BetList />
          </div>
        </section>
      </main>
      <Link
        to="/add-bet"
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-fuchsia-500 to-pink-500 shadow-2xl hover:scale-110 transition-all duration-200 border-4 border-white/30 animate-fab-glow"
        title="Add Bet"
      >
        <span className="text-4xl text-white font-bold drop-shadow">+</span>
      </Link>
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
        @keyframes fab-glow {
          0%, 100% { box-shadow: 0 0 32px #f472b6, 0 0 8px #7f9cf5; }
          50% { box-shadow: 0 0 64px #fbbf24, 0 0 16px #818cf8; }
        }
        .animate-fab-glow {
          animation: fab-glow 2.5s ease-in-out infinite;
        }
        `}
      </style>
    </div>
  );
}