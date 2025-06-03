import { useAppState } from "../context/AppStateContext";
import { Link } from "react-router";
import React, { useState } from "react";

const outcomeOptions = ["All", "Won", "Lost", "Draw", "Pending"];
const typeOptions = ["All", "Winner", "Total", "Handicap", "Other"];

export default function BetList() {
  const { state, deleteBet } = useAppState();
  const [feedback, setFeedback] = useState<string | null>(null);

  const [outcomeFilter, setOutcomeFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [search, setSearch] = useState("");

  async function handleDelete(id: string) {
    if (window.confirm("Are you sure you want to delete this bet?")) {
      await deleteBet(id);
      setFeedback("Bet deleted.");
      setTimeout(() => setFeedback(null), 1200);
    }
  }

  const filteredBets = state.bets.filter((bet) => {
    if (favoritesOnly && !bet.favorite) return false;
    if (outcomeFilter !== "All" && bet.outcome !== outcomeFilter) return false;
    if (typeFilter !== "All" && bet.type !== typeFilter) return false;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      if (
        !(bet.notes?.toLowerCase().includes(s) ||
          bet.type.toLowerCase().includes(s) ||
          bet.outcome.toLowerCase().includes(s) ||
          bet.amount.toString().includes(s) ||
          bet.odds.toString().includes(s))
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <label className="flex items-center gap-2">
          <span className="font-semibold text-sm">Outcome:</span>
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            style={{
              borderRadius: 8,
              padding: "4px 8px",
              border: "1px solid #ccc",
              background: "var(--bg-main)",
              color: "var(--text-main)",
              transition: "background 0.3s, color 0.3s",
            }}
          >
            {outcomeOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="font-semibold text-sm">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              borderRadius: 8,
              padding: "4px 8px",
              border: "1px solid #ccc",
              background: "var(--bg-main)",
              color: "var(--text-main)",
              transition: "background 0.3s, color 0.3s",
            }}
          >
            {typeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(e) => setFavoritesOnly(e.target.checked)}
            style={{ accentColor: "var(--accent)" }}
          />
          <span className="font-semibold text-sm">Favorites only</span>
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bets..."
          style={{
            borderRadius: 8,
            padding: "8px 12px",
            border: "1px solid #ccc",
            background: "var(--bg-main)",
            color: "var(--text-main)",
            minWidth: 180,
            transition: "background 0.3s, color 0.3s",
          }}
        />
      </div>
      {feedback && (
        <div style={{
          padding: 8,
          borderRadius: 8,
          fontSize: 14,
          marginBottom: 16,
          background: "#bbf7d0",
          color: "#166534",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>{feedback}</div>
      )}
      {filteredBets.length === 0 ? (
        <div style={{
          textAlign: "center",
          color: "var(--text-muted)",
          padding: "32px 0",
        }}>
          No bets match your filters. <Link to="/add-bet" style={{ color: "var(--accent)", textDecoration: "underline" }}>Add a bet</Link>!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBets.map((bet) => (
            <div
              key={bet.id}
              style={{
                position: "relative",
                background: "var(--bg-card)",
                color: "var(--text-main)",
                borderRadius: 16,
                boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.08)",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                transition: "background 0.3s, color 0.3s, transform 0.2s",
                minHeight: 220,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "2px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  background:
                    bet.outcome === "Won"
                      ? "#bbf7d0"
                      : bet.outcome === "Lost"
                      ? "#fecaca"
                      : bet.outcome === "Draw"
                      ? "#e5e7eb"
                      : "#fef9c3",
                  color:
                    bet.outcome === "Won"
                      ? "#166534"
                      : bet.outcome === "Lost"
                      ? "#991b1b"
                      : bet.outcome === "Draw"
                      ? "#374151"
                      : "#a16207",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  zIndex: 20,
                  marginBottom: 8,
                }}
              >
                {bet.outcome}
              </span>
              <div style={{ marginTop: 28, marginBottom: 8, fontWeight: 700, fontSize: 18 }}>
                {bet.type}
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                <span style={{ color: "#3b82f6", fontSize: 14 }}>💵 {Number(bet.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                <span style={{ color: "#a21caf", fontSize: 14 }}>🎯 {Number(bet.odds).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                <span style={{ color: "#fde68a", fontSize: 14 }}>💸 {Number(bet.payout).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Profit: </span>
                <span
                  style={{
                    color: bet.profit > 0 ? "#22c55e" : bet.profit < 0 ? "#ef4444" : "var(--text-main)",
                    fontWeight: 700,
                  }}
                >
                  {Number(bet.profit).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              {bet.notes && (
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic", marginBottom: 8 }}>
                  "{bet.notes}"
                </div>
              )}
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>{bet.date}</div>
              <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
                <Link
                  to={`/edit-bet/${bet.id}`}
                  style={{
                    background: "var(--accent)",
                    color: "#fff",
                    padding: "6px 18px",
                    borderRadius: 999,
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(bet.id)}
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    padding: "6px 18px",
                    borderRadius: 999,
                    fontWeight: 600,
                    fontSize: 14,
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                  }}
                  title="Delete bet"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}