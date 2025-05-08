import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("add-bet", "routes/add-bet.tsx"),
] satisfies RouteConfig;
