import { useAppState } from "../context/AppStateContext";
import { Link } from "react-router";

export default function BetList() {
  const { state } = useAppState();
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Your Bets</h2>
      <ul>
        {state.bets.map((bet) => (
          <li key={bet.id} className="mb-2 border-b pb-2">
            <div>
              <strong>{bet.type}</strong> | {bet.amount} @ {bet.odds} | {bet.outcome}
            </div>
            <div className="text-xs text-gray-500">{bet.date}</div>
            <Link
              to={`/edit-bet/${bet.id}`}
              className="text-blue-600 underline text-sm"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}