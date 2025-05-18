import React from "react";
import WalletPanel from "../components/WalletPanel";
import WalletForm from "../components/WalletForm";
import { Link } from "react-router";

export default function WalletPage() {
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
        className="w-full max-w-2xl backdrop-blur rounded-2xl shadow-2xl border p-10 z-10"
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
            Wallet
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
        <WalletPanel />
        <WalletForm />
      </div>
    </main>
  );
}