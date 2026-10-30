import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { CheckoutForm } from "@/components/CheckoutForm";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = { title: "Order Emerald Classic", description: "Order the HIMA Watches Emerald Classic for NPR 3,999 with Cash on Delivery across Nepal." };

export default function CheckoutPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_20%_0%,rgba(212,180,119,.16),transparent_32%)] py-3 sm:py-6 lg:py-8">
      <header className="shell flex min-h-20 items-center justify-between gap-3 py-2"><BrandLogo className="h-14 w-auto sm:h-16" priority /><div className="flex shrink-0 items-center gap-2 sm:gap-4"><Link href="/#product" className="flex min-h-11 items-center rounded-lg px-2 text-sm text-black/55 transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold dark:text-white/55"><span aria-hidden="true">←</span><span className="ml-1 sm:hidden">Back</span><span className="ml-1 hidden sm:inline">Back to Emerald Classic</span></Link><ThemeToggle /></div></header>
      <div className="shell py-5 sm:py-8 lg:py-10"><Suspense fallback={<div className="glass min-h-[480px] animate-pulse rounded-3xl sm:rounded-[2rem]" />}><CheckoutForm /></Suspense></div>
    </main>
  );
}
