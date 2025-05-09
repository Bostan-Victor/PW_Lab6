import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("add-bet", "routes/add-bet.tsx"),
  route("edit-bet/:id", "routes/edit-bet.tsx"),
  route("wallet", "routes/wallet.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
] satisfies RouteConfig;
