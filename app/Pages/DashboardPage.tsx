import React from "react";
import { useAppState } from "../context/AppStateContext";
import { Link } from "react-router";
import ProfitOverTimeChart from "../components/ProfitOverTimeChart";

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
    <main
      className="relative min-h-screen flex flex-col items-center py-12 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-via), var(--gradient-to))",
        transition: "background 0.3s",
      }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] max-w-2xl blur-3xl opacity-40 rounded-full -z-10"
        style={{
          background: "linear-gradient(120deg, var(--gradient-from), var(--gradient-via), var(--gradient-to))",
        }}
      />
      <div
        className="w-full max-w-3xl backdrop-blur rounded-2xl shadow-2xl border p-10 z-10"
        style={{
          background: "var(--bg-card)",
          color: "var(--text-main)",
          borderColor: "rgba(0,0,0,0.08)",
          transition: "background 0.3s, color 0.3s",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-3xl font-extrabold tracking-tight text-center"
            style={{
              background: "linear-gradient(90deg, var(--gradient-from), var(--accent), var(--gradient-to))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Dashboard
          </h1>
          <Link
            to="/"
            style={{
              background: "var(--accent)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: 999,
              textDecoration: "none",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            Home
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
          <div className="dashboard-card">
            <span style={{ color: "#3b82f6", fontSize: 28 }}>🎲</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Total Bets</span>
            <span style={{ fontSize: 24, fontWeight: 700 }}>{totalBets}</span>
          </div>
          <div className="dashboard-card">
            <span style={{ color: "#22c55e", fontSize: 28 }}>🏆</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Won</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#22c55e" }}>{totalWon}</span>
          </div>
          <div className="dashboard-card">
            <span style={{ color: "#ef4444", fontSize: 28 }}>💔</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Lost</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#ef4444" }}>{totalLost}</span>
          </div>
          <div className="dashboard-card">
            <span style={{ color: "#a1a1aa", fontSize: 28 }}>🤝</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Draw</span>
            <span style={{ fontSize: 24, fontWeight: 700 }}>{totalDraw}</span>
          </div>
          <div className="dashboard-card">
            <span style={{ color: "#facc15", fontSize: 28 }}>⏳</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Pending</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#facc15" }}>{totalPending}</span>
          </div>
          <div className="dashboard-card">
            <span style={{ color: "#fde68a", fontSize: 28 }}>💰</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Total Profit</span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: totalProfit > 0 ? "#22c55e" : totalProfit < 0 ? "#ef4444" : "var(--text-main)",
              }}
            >
              {Number(totalProfit).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="dashboard-card">
            <span style={{ color: "#e879f9", fontSize: 28 }}>📈</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Win Rate</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#e879f9" }}>{winRate}%</span>
          </div>
          <div className="dashboard-card">
            <span style={{ color: "#60a5fa", fontSize: 28 }}>💵</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Avg Bet</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#60a5fa" }}>
              ${Number(avgBetAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="dashboard-card">
            <span style={{ color: "#22c55e", fontSize: 22 }}>🏅</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Biggest Win</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#22c55e" }}>
              ${Number(biggestWin).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="dashboard-card">
            <span style={{ color: "#ef4444", fontSize: 22 }}>💣</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Biggest Loss</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#ef4444" }}>
              ${Number(biggestLoss).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full max-w-3xl mt-12">
        <ProfitOverTimeChart bets={bets} />
      </div>
    </main>
  );
}