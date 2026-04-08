"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

type Theme = "light" | "dark";

const STORAGE_KEY = "learnzy-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme: Theme = savedTheme || (prefersDark ? "dark" : "light");

    applyTheme(initialTheme);
    setTheme(initialTheme);
    setIsReady(true);
  }, []);

  const applyTheme = (nextTheme: Theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", nextTheme === "dark");
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="btn-secondary inline-flex items-center gap-2"
      aria-label={
        isReady && theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={isReady && theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {isReady && theme === "dark" ? (
        <>
          <FiSun className="h-4 w-4" />
        </>
      ) : (
        <>
          <FiMoon className="h-4 w-4" />
        </>
      )}
    </button>
  );
}
