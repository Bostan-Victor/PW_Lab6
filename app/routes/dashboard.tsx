import DashboardPage from "../Pages/DashboardPage";

export function meta() {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Bet statistics and analytics" },
  ];
}

export default function Dashboard() {
  return <DashboardPage />;
}