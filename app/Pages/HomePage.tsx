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
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center border border-gray-200 dark:border-gray-800">
        <span className="text-gray-500 text-xs">Total Bets</span>
        <span className="text-2xl font-bold">{totalBets}</span>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center border border-gray-200 dark:border-gray-800">
        <span className="text-gray-500 text-xs">Won</span>
        <span className="text-2xl font-bold text-green-600">{totalWon}</span>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center border border-gray-200 dark:border-gray-800">
        <span className="text-gray-500 text-xs">Lost</span>
        <span className="text-2xl font-bold text-red-600">{totalLost}</span>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center border border-gray-200 dark:border-gray-800">
        <span className="text-gray-500 text-xs">Profit</span>
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
    <main className="max-w-5xl mx-auto p-4">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Bet Tracker Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your bets, analyze your performance, and manage your wallet.
          </p>
        </div>
        <Link
          to="/add-bet"
          className="mt-4 sm:mt-0 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition font-semibold"
        >
          + Add New Bet
        </Link>
      </header>
      <DashboardSummary />
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Bets</h2>
        <BetList />
      </section>
    </main>
  );
}