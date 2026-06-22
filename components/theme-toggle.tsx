"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const themeKey = "foodmood.theme";
type ThemeMode = "light" | "dark";

function getPreferredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(themeKey);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const preferred = getPreferredTheme();
    setTheme(preferred);
    applyTheme(preferred);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem(themeKey, next);
    applyTheme(next);
  }

  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      className="grid size-12 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground)] shadow-sm"
      onClick={toggleTheme}
      type="button"
    >
      <Icon size={20} />
    </button>
  );
}
