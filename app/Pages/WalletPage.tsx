import React from "react";
import WalletPanel from "../components/WalletPanel";
import WalletForm from "../components/WalletForm";
import { Link } from "react-router";

export default function WalletPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center bg-gradient-to-tr from-blue-900 via-purple-800 to-pink-700 animate-gradient-x py-12 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] max-w-2xl blur-3xl opacity-40 bg-gradient-to-br from-blue-400 via-fuchsia-400 to-pink-400 rounded-full -z-10" />
      <div className="w-full max-w-2xl backdrop-blur bg-white/30 dark:bg-gray-900/40 rounded-2xl shadow-2xl border border-white/30 dark:border-gray-800/60 p-10 z-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 drop-shadow-lg animate-glow">
            Wallet
          </h1>
          <Link
            to="/"
            className="text-sm px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 text-white font-semibold shadow hover:scale-105 transition"
          >
            Home
          </Link>
        </div>
        <WalletPanel />
        <WalletForm />
      </div>
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
    </main>
  );
}