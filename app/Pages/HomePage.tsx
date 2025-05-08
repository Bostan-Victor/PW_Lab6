import React from "react";
import { Link } from "react-router";
import BetList from "../components/BetList";

export default function HomePage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bet Tracker Dashboard</h1>
      <p>Welcome to your Bet Tracking App!</p>
      <Link
        to="/add-bet"
        className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add New Bet
      </Link>
      <BetList />
    </main>
  );
}