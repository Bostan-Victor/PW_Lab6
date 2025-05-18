import React from "react";
import { useAppState } from "../context/AppStateContext";

export default function WalletPanel() {
  const { state } = useAppState();
  const wallet = state.wallet;

  if (!wallet) return null;

  return (
    <div
      style={{
        marginBottom: 32,
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        background: "var(--bg-card)",
        color: "var(--text-main)",
        border: "1px solid rgba(0,0,0,0.08)",
        backdropFilter: "blur(4px)",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-main)" }}>Wallet</h2>
        <span style={{ fontSize: 24, fontWeight: 800, color: "#22c55e" }}>
          ${Number(wallet.balance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </div>
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: 8, color: "var(--text-muted)" }}>Transactions</h3>
        {wallet.transactions.length === 0 ? (
          <div style={{ color: "#a1a1aa", fontSize: 14 }}>No transactions yet.</div>
        ) : (
          <ul style={{ maxHeight: 192, overflowY: "auto", borderTop: "1px solid #eee" }}>
            {wallet.transactions.map((tx) => (
              <li
                key={tx.id}
                style={{
                  padding: "8px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 14,
                  borderBottom: "1px solid #eee",
                }}
              >
                <span>
                  {tx.type === "deposit" && <span style={{ color: "#22c55e" }}>Deposit</span>}
                  {tx.type === "withdrawal" && <span style={{ color: "#ef4444" }}>Withdrawal</span>}
                  {tx.type === "bet" && <span style={{ color: "#2563eb" }}>Bet</span>}
                  {tx.type === "payout" && <span style={{ color: "#eab308" }}>Payout</span>}
                  <span style={{ marginLeft: 8, color: "var(--text-muted)" }}>{new Date(tx.date).toLocaleString()}</span>
                </span>
                <span
                  style={{
                    color:
                      tx.type === "deposit" || tx.type === "payout"
                        ? "#22c55e"
                        : "#ef4444",
                    fontWeight: 600,
                  }}
                >
                  {tx.type === "deposit" || tx.type === "payout" ? "+" : "-"}${Number(tx.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}