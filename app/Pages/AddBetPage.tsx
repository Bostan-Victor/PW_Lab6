import React from "react";
import AddBetForm from "../components/AddBetForm";

export default function AddBetPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-950 py-8">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
        <h1 className="text-2xl font-extrabold mb-6 text-center tracking-tight">
          Add New Bet
        </h1>
        <AddBetForm />
      </div>
    </main>
  );
}