import EditBetPage from "../Pages/EditBetPage";

export function meta() {
  return [
    { title: "Edit Bet" },
    { name: "description", content: "Edit an existing bet" },
  ];
}

export default function EditBet() {
  return <EditBetPage />;
}