import type { Route } from "./+types/home";
import HomePage from "../Pages/HomePage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bet Tracker" },
    { name: "description", content: "Track your bets and manage your wallet!" },
  ];
}

export default function Home() {
  return <HomePage />;
}
