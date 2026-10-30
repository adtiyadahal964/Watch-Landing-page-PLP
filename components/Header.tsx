"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  { href: "/#product", label: "The Watch" },
  { href: "/#details", label: "Details" },
  { href: "/#why-hima", label: "Why HIMA" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-[60] border-b border-black/5 bg-ivory/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#11110f]/90">
      <div className="shell flex h-20 items-center justify-between gap-3">
        <BrandLogo className="h-14 w-auto sm:h-16" priority />

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex lg:gap-8" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-1 py-2 transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link href="/checkout?product=emerald-classic&quantity=1" className="btn-primary hidden sm:inline-flex">Order now</Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-black/10 bg-white/60 transition hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold dark:border-white/15 dark:bg-white/5 md:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" className="text-xl leading-none">{menuOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className={`${menuOpen ? "grid" : "hidden"} shell gap-1 border-t border-black/5 bg-ivory py-4 shadow-lg dark:border-white/10 dark:bg-[#11110f] md:hidden`}
      >
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className="flex min-h-12 items-center rounded-xl px-4 text-sm font-semibold transition hover:bg-black/5 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold dark:hover:bg-white/5"
          >
            {item.label}
          </Link>
        ))}
        <Link href="/checkout?product=emerald-classic&quantity=1" onClick={() => setMenuOpen(false)} className="btn-primary mt-2 sm:hidden">Order Emerald Classic</Link>
      </nav>
    </header>
  );
}
