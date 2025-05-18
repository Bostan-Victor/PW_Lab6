import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
const themes = {
  light: {
    "--bg-main": "#f8fafc",
    "--bg-card": "#fff",
    "--text-main": "#222",
    "--text-muted": "#555",
    "--accent": "#6366f1",
    "--gradient-from": "#dbeafe",
    "--gradient-via": "#f3e8ff",
    "--gradient-to": "#fce7f3",
  },
  dark: {
    "--bg-main": "#18181b",
    "--bg-card": "#232336",
    "--text-main": "#f3f4f6",
    "--text-muted": "#a1a1aa",
    "--accent": "#a78bfa",
    "--gradient-from": "#312e81",
    "--gradient-via": "#6d28d9",
    "--gradient-to": "#be185d",
  },
};

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const vars = themes[theme];
    Object.entries(vars).forEach(([key, value]) => {
      document.body.style.setProperty(key, value);
    });
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};