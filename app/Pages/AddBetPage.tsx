import React from "react";
import AddBetForm from "../components/AddBetForm";

export default function AddBetPage() {
  return (
    <main
      className="relative min-h-screen flex items-center justify-center py-8 overflow-hidden"
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
        className="w-full max-w-lg backdrop-blur rounded-2xl shadow-2xl border p-10"
        style={{
          background: "var(--bg-card)",
          color: "var(--text-main)",
          borderColor: "rgba(0,0,0,0.08)",
          transition: "background 0.3s, color 0.3s",
        }}
      >
        <h1
          className="text-3xl font-extrabold mb-8 text-center tracking-tight"
          style={{
            background: "linear-gradient(90deg, var(--gradient-from), var(--accent), var(--gradient-to))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Add New Bet
        </h1>
        <AddBetForm />
      </div>
    </main>
  );
}