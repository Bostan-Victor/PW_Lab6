import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import React from "react";
import type { Route } from "./+types/root";
import "./app.css";
import { AppStateProvider } from "./context/AppStateContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { getToken, clearToken } from "./utils/api";
import LoginPage from "./Pages/LoginPage";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        top: 24,
        left: 24,
        background: "var(--bg-card)",
        color: "var(--text-main)",
        border: "none",
        borderRadius: "50%",
        width: 48,
        height: 48,
        fontSize: 24,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        zIndex: 1000,
      }}
      title="Toggle theme"
    >
      {theme === "dark" ? "🌙" : "🌞"}
    </button>
  );
}

function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <button
      onClick={onLogout}
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        background: "var(--bg-card)",
        color: "var(--text-main)",
        border: "none",
        borderRadius: 12,
        padding: "12px 24px",
        fontWeight: 600,
        fontSize: 16,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        zIndex: 1000,
      }}
      title="Logout"
    >
      Logout
    </button>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = React.useState(() => !!getToken());

  React.useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  function handleLogout() {
    clearToken();
    setLoggedIn(false);
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          {!loggedIn ? (
            <LoginPage onLogin={() => setLoggedIn(true)} />
          ) : (
            <AppStateProvider onAuthError={handleLogout}>
              <ThemeToggle />
              {children}
              <LogoutButton onLogout={handleLogout} />
            </AppStateProvider>
          )}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}