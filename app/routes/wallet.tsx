import WalletPage from "../Pages/WalletPage";

export function meta() {
  return [
    { title: "Wallet" },
    { name: "description", content: "View and manage your wallet" },
  ];
}

export default function Wallet() {
  return <WalletPage />;
}