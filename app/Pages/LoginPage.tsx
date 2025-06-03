import React, { useState } from "react";
import { apiLogin } from "../utils/api";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [role, setRole] = useState<"USER" | "VISITOR">("VISITOR");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiLogin(role);
      onLogin();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-via), var(--gradient-to))",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "var(--bg-card)",
          color: "var(--text-main)",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          minWidth: 320,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Login</h2>
        <label>
          <span style={{ fontWeight: 600 }}>Role:</span>
          <select
            value={role}
            onChange={e => setRole(e.target.value as "USER" | "VISITOR")}
            style={{
              marginLeft: 8,
              borderRadius: 8,
              padding: "8px 12px",
              border: "1px solid #ccc",
              background: "var(--bg-main)",
              color: "var(--text-main)",
            }}
          >
            <option value="USER">USER</option>
            <option value="VISITOR">VISITOR</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 0",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && (
          <div style={{ color: "#ef4444", fontWeight: 500 }}>{error}</div>
        )}
      </form>
    </main>
  );
}