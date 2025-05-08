import { useAppState } from "../context/AppStateContext";
import { Link } from "react-router";
import { deleteById } from "../utils/db";

export default function BetList() {
  const { state, dispatch } = useAppState();

  async function handleDelete(id: string) {
    if (window.confirm("Are you sure you want to delete this bet?")) {
      dispatch({ type: "DELETE_BET", id });
      await deleteById("bets", id);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Your Bets</h2>
      <ul>
        {state.bets.map((bet) => (
          <li key={bet.id} className="mb-2 border-b pb-2 flex items-center justify-between">
            <div>
              <strong>{bet.type}</strong> | {bet.amount} @ {bet.odds} | {bet.outcome}
              <div className="text-xs text-gray-500">{bet.date}</div>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/edit-bet/${bet.id}`}
                className="text-blue-600 underline text-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(bet.id)}
                className="text-red-600 underline text-sm"
                title="Delete bet"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}