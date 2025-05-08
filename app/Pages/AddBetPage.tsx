import React from "react";
import AddBetForm from "../components/AddBetForm";

export default function AddBetPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Bet</h1>
      <AddBetForm />
    </main>
  );
}