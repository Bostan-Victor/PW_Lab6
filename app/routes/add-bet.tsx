import AddBetPage from "../Pages/AddBetPage";

export function meta({}: any) {
  return [
    { title: "Add Bet" },
    { name: "description", content: "Add a new bet" },
  ];
}

export default function AddBet() {
  return <AddBetPage />;
}