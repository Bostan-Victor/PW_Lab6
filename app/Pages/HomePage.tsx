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
      <div
        style={{
          background: "var(--bg-card)",
          color: "var(--text-main)",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.08)",
          backdropFilter: "blur(4px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#3b82f6", fontSize: 28 }}>🎲</span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Total Bets</span>
        <span style={{ fontSize: 24, fontWeight: 700 }}>{totalBets}</span>
      </div>
      <div
        style={{
          background: "var(--bg-card)",
          color: "var(--text-main)",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.08)",
          backdropFilter: "blur(4px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#22c55e", fontSize: 28 }}>🏆</span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Won</span>
        <span style={{ fontSize: 24, fontWeight: 700, color: "#22c55e" }}>{totalWon}</span>
      </div>
      <div
        style={{
          background: "var(--bg-card)",
          color: "var(--text-main)",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.08)",
          backdropFilter: "blur(4px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#ef4444", fontSize: 28 }}>💔</span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Lost</span>
        <span style={{ fontSize: 24, fontWeight: 700, color: "#ef4444" }}>{totalLost}</span>
      </div>
      <div
        style={{
          background: "var(--bg-card)",
          color: "var(--text-main)",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.08)",
          backdropFilter: "blur(4px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#fde68a", fontSize: 28 }}>💰</span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Profit</span>
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
      <div className="col-span-2 sm:col-span-4 flex justify-center mt-2">
        <span
          style={{
            color: "var(--text-main)",
            fontSize: 12,
            fontWeight: 600,
            marginRight: 8,
          }}
        >
          Win Rate
        </span>
        <span style={{ color: "var(--text-main)", fontSize: 18, fontWeight: 600 }}>{winRate}%</span>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { state } = useAppState();
  const wallet = state.wallet;

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-via), var(--gradient-to))",
        transition: "background 0.3s",
      }}
    >
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] max-w-4xl blur-3xl opacity-40 rounded-full -z-10"
        style={{
          background: "linear-gradient(120deg, var(--gradient-from), var(--gradient-via), var(--gradient-to))",
        }}
      />
      <div className="absolute top-8 right-8 z-40">
        <Link
          to="/wallet"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 999,
            background: "var(--bg-card)",
            color: "var(--text-main)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.08)",
            fontWeight: 600,
            textDecoration: "none",
            transition: "background 0.3s, color 0.3s",
          }}
          title="View Wallet"
        >
          <span style={{ fontSize: 24, color: "#fde047" }}>👛</span>
          <span style={{ fontWeight: 700, fontSize: 18 }}>
            ${wallet ? wallet.balance.toFixed(2) : "0.00"}
          </span>
        </Link>
      </div>
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between mb-12">
          <div className="flex flex-col items-center sm:items-start">
            <h1
              className="text-5xl sm:text-6xl font-extrabold tracking-tight"
              style={{
                color: "var(--text-main)",
                marginBottom: 0,
              }}
            >
              Bet Tracker
            </h1>
            <p
              className="mt-4 text-lg text-center sm:text-left max-w-2xl"
              style={{ color: "var(--text-main)" }}
            >
              Track your bets, analyze your performance, and manage your wallet with style. <br />
              <span style={{ color: "var(--accent)" }}>Stay on top of your game!</span>
            </p>
          </div>
          <Link
            to="/dashboard"
            style={{
              marginTop: 24,
              padding: "8px 16px",
              borderRadius: 999,
              background: "var(--accent)",
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              transition: "background 0.3s, color 0.3s",
            }}
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
          <div
            style={{
              background: "var(--bg-card)",
              color: "var(--text-main)",
              borderRadius: 16,
              boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.08)",
              backdropFilter: "blur(4px)",
              padding: 32,
              marginTop: 32,
              transition: "background 0.3s, color 0.3s",
            }}
          >
            <h2
              className="text-2xl font-bold mb-6 tracking-tight"
              style={{ color: "var(--text-main)" }}
            >
              Your Bets
            </h2>
            <BetList />
          </div>
        </section>
      </main>
      <Link
        to="/add-bet"
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "var(--accent)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 32,
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          border: "4px solid rgba(255,255,255,0.3)",
          transition: "background 0.3s, color 0.3s",
        }}
        title="Add Bet"
      >
        +
      </Link>
    </div>
  );
}