"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.theme = next ? "dark" : "light";
  }

  return (
    <button type="button" onClick={toggle} aria-label={`Switch to ${dark ? "light" : "dark"} theme`} className="grid size-11 shrink-0 place-items-center rounded-full border border-black/10 bg-white/60 text-lg transition hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold dark:border-white/15 dark:bg-white/5">
      <span aria-hidden="true">{dark ? "☀" : "☾"}</span>
    </button>
  );
}
