"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatNpr, isOrderable, type Product } from "@/data/products";

const WISHLIST_KEY = "hima-watch-wishlist";

export function ProductCollection({ products }: { products: Product[] }) {
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
      if (Array.isArray(stored)) setWishlist(stored.filter((slug): slug is string => typeof slug === "string"));
    } catch { /* Ignore unavailable guest storage. */ }
  }, []);

  useEffect(() => {
    if (!quickView) return;
    previousFocus.current = document.activeElement as HTMLElement;
    closeButton.current?.focus();
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setQuickView(null);
      if (event.key === "Tab" && dialog.current) {
        const focusable = [...dialog.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),select,input,textarea,[tabindex]:not([tabindex="-1"])')];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previousFocus.current?.focus();
    };
  }, [quickView]);

  function toggleWishlist(slug: string) {
    setWishlist((current) => {
      const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
      try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(next)); } catch { /* Storage is optional. */ }
      return next;
    });
  }

  function openQuickView(product: Product) {
    setQuantity(1);
    setQuickView(product);
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const saved = wishlist.includes(product.slug);
          return (
            <article key={product.slug} className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-black/10 bg-white/55 transition hover:-translate-y-1 hover:shadow-glow dark:border-white/10 dark:bg-white/[.04]">
              <div className="relative aspect-square overflow-hidden bg-[#ece9e2] dark:bg-[#1b1b18]">
                <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) 50vw, 25vw" className="object-contain p-3 transition duration-500 group-hover:scale-[1.025]" />
                <button type="button" onClick={() => toggleWishlist(product.slug)} aria-pressed={saved} aria-label={`${saved ? "Remove" : "Save"} ${product.name} ${saved ? "from" : "to"} wishlist`} className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-white/90 text-lg text-ink shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                  <span aria-hidden="true">{saved ? "♥" : "♡"}</span>
                </button>
                {product.price === null && <span className="absolute bottom-3 left-3 rounded-full bg-ink/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[.14em] text-white">Price pending</span>}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-gold">{product.category}</p>
                <h3 className="mt-2 break-words font-serif text-2xl font-semibold">{product.name}</h3>
                <p className="mt-3 text-sm leading-6 text-black/55 dark:text-white/55">{product.price === null ? "Price awaiting confirmation" : formatNpr(product.price)}</p>
                <div className="mt-auto flex items-center gap-3 pt-5">
                  <button type="button" onClick={() => openQuickView(product)} className="grid size-12 place-items-center rounded-full border border-black/15 transition hover:border-gold hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold dark:border-white/20" aria-label={`Quick view ${product.name}`} title="Quick view">
                    <EyeIcon />
                  </button>
                  <Link href={`/watches/${product.slug}`} className="grid size-12 place-items-center rounded-full bg-ink text-white transition hover:bg-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 dark:bg-champagne dark:text-ink" aria-label={`View full details for ${product.name}`} title="View product details">
                    <ArrowIcon />
                  </Link>
                  <span className="ml-auto text-xs font-semibold uppercase tracking-[.12em] text-black/40 dark:text-white/40">Explore</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {quickView && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setQuickView(null); }}>
          <section ref={dialog} role="dialog" aria-modal="true" aria-labelledby="quick-view-title" className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-ivory p-5 text-ink shadow-2xl sm:max-w-4xl sm:rounded-[2rem] sm:p-7 dark:bg-[#171713] dark:text-white">
            <div className="flex items-center justify-between gap-4"><p className="eyebrow">Quick view</p><button ref={closeButton} type="button" onClick={() => setQuickView(null)} className="grid size-11 place-items-center rounded-full border border-black/15 text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold dark:border-white/15" aria-label="Close quick view">×</button></div>
            <div className="mt-4 grid gap-6 md:grid-cols-2 md:items-center">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#ece9e2] dark:bg-[#1f1f1b]"><Image src={quickView.images[0].src} alt={quickView.images[0].alt} fill sizes="(max-width: 767px) calc(100vw - 40px), 420px" className="object-contain p-3" /></div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">{quickView.category}</p>
                <h2 id="quick-view-title" className="mt-3 break-words font-serif text-3xl font-semibold sm:text-4xl">{quickView.name}</h2>
                <p className="mt-4 text-sm leading-6 text-black/60 dark:text-white/60">{quickView.description}</p>
                <p className="mt-5 font-serif text-2xl font-semibold">{quickView.price === null ? "Price awaiting confirmation" : formatNpr(quickView.price)}</p>
                <p className="mt-2 text-xs text-black/45 dark:text-white/45">Inventory is not connected to a live stock source.</p>
                {isOrderable(quickView) && (
                  <div className="mt-5 flex items-center justify-between gap-4"><span className="text-sm font-semibold">Quantity</span><div className="flex items-center rounded-full border border-black/15 p-1 dark:border-white/15"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid size-11 place-items-center rounded-full" aria-label="Decrease quantity">−</button><span className="w-9 text-center text-sm font-semibold" aria-live="polite">{quantity}</span><button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))} className="grid size-11 place-items-center rounded-full" aria-label="Increase quantity">+</button></div></div>
                )}
                <div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href={`/watches/${quickView.slug}`} className="btn-secondary">Full details</Link>{isOrderable(quickView) ? <Link href={`/checkout?product=${quickView.slug}&quantity=${quantity}`} className="btn-primary">Order now</Link> : <a href="mailto:adtiyadahal964@gmail.com?subject=HIMA%20Watches%20product%20price" className="btn-primary">Ask for price</a>}</div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function EyeIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="1.8"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/></svg>; }
function ArrowIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="1.8"><path d="M7 17 17 7M8 7h9v9"/></svg>; }
