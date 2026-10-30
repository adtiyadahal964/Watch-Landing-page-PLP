"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatNpr, isOrderable, type Product } from "@/data/products";

export function ProductShowcase({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const activeImage = product.images[imageIndex] ?? product.images[0];
  const checkout = `/checkout?product=${encodeURIComponent(product.slug)}&quantity=${quantity}`;

  useEffect(() => {
    if (!zoomed) return;
    previousFocus.current = document.activeElement as HTMLElement;
    closeButton.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(false);
      if (event.key === "Tab" && dialog.current) {
        const focusable = [...dialog.current.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handleKeyDown); document.body.style.overflow = ""; previousFocus.current?.focus(); };
  }, [zoomed]);

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)] lg:gap-12 xl:gap-14">
      <div className="min-w-0">
        <button type="button" onClick={() => setZoomed(true)} className="relative mx-auto block aspect-square w-full max-w-[680px] overflow-hidden rounded-3xl bg-[#ece9e2] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:rounded-[2rem] dark:bg-[#1b1b18]" aria-label={`Enlarge image of ${product.name}`}>
          <Image src={activeImage.src} alt={activeImage.alt} fill priority sizes="(max-width: 1023px) calc(100vw - 32px), 52vw" className="object-contain p-2" />
          <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-2 text-[11px] font-semibold text-ink shadow-sm">View larger</span>
        </button>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2" aria-label="Product image gallery">
          {product.images.map((image, index) => <button key={image.src} type="button" onClick={() => setImageIndex(index)} aria-label={`View image ${index + 1} of ${product.name}`} aria-current={index === imageIndex} className={`relative size-20 shrink-0 overflow-hidden rounded-2xl border bg-[#ece9e2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold dark:bg-[#1b1b18] ${index === imageIndex ? "border-gold" : "border-black/10 dark:border-white/10"}`}><Image src={image.src} alt="" fill sizes="80px" className="object-contain p-1" /></button>)}
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center lg:py-6">
        <p className="eyebrow">{product.label} · {product.category}</p>
        <h3 className="mt-4 break-words font-serif text-[clamp(2.5rem,7vw,3.75rem)] font-semibold leading-none">{product.name}</h3>
        <p className="mt-5 max-w-lg text-base leading-7 text-black/60 sm:mt-6 dark:text-white/60">{product.description}</p>
        <ul className="mt-7 space-y-3 text-sm sm:mt-8 sm:space-y-4">{product.benefits.map((benefit) => <li key={benefit} className="flex items-start gap-3"><span aria-hidden="true" className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">✓</span><span>{benefit}</span></li>)}</ul>
        <div className="mt-8 border-y border-black/10 py-5 sm:mt-9 sm:py-6 dark:border-white/10">
          <div className="grid gap-4 min-[420px]:grid-cols-[minmax(0,1fr)_auto] min-[420px]:items-end"><div className="min-w-0"><p className="text-xs uppercase tracking-[.2em] text-black/45 dark:text-white/45">Price</p><p className="mt-1 break-words font-serif text-3xl font-semibold sm:text-4xl">{product.price === null ? "Awaiting confirmation" : formatNpr(product.price)}</p></div><p className="text-xs leading-5 text-black/50 min-[420px]:text-right dark:text-white/50">Delivery: NPR 100 inside valley<br />NPR 150 outside valley</p></div>
        </div>
        {isOrderable(product) ? <>
          <div className="mt-6 flex items-center justify-between gap-4 sm:mt-7"><span className="text-sm font-semibold">Quantity</span><div className="flex items-center rounded-full border border-black/15 p-1 dark:border-white/15"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid size-11 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" aria-label="Decrease quantity">−</button><span className="w-10 text-center text-sm font-semibold" aria-live="polite">{quantity}</span><button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))} className="grid size-11 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" aria-label="Increase quantity">+</button></div></div>
          <Link href={checkout} className="btn-primary mt-7 min-h-14 w-full break-words px-8 sm:w-auto">Order Emerald Classic · {formatNpr(product.price! * quantity)}</Link>
        </> : <div className="mt-7 rounded-2xl border border-gold/25 bg-gold/[.07] p-5"><p className="text-sm leading-6 text-black/60 dark:text-white/60">This watch is visible for review, but ordering is disabled until HIMA Watches confirms its price and product details.</p><a href={`mailto:adtiyadahal964@gmail.com?subject=${encodeURIComponent(`Price request: ${product.name}`)}`} className="btn-primary mt-4 w-full sm:w-auto">Ask HIMA Watches</a></div>}
        <dl className="mt-7 divide-y divide-black/10 border-y border-black/10 text-sm dark:divide-white/10 dark:border-white/10">{product.specifications.map((item) => <div key={item.label} className="grid gap-1 py-4 sm:grid-cols-[140px_1fr]"><dt className="text-black/45 dark:text-white/45">{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
      </div>

      {zoomed && <div ref={dialog} className="fixed inset-0 z-[90] grid place-items-center bg-black/85 p-4" role="dialog" aria-modal="true" aria-label={`Enlarged image of ${product.name}`} onMouseDown={(event) => { if (event.currentTarget === event.target) setZoomed(false); }}><div className="relative h-[85vh] w-full max-w-5xl"><Image src={activeImage.src} alt={activeImage.alt} fill sizes="100vw" className="object-contain" /><button ref={closeButton} type="button" onClick={() => setZoomed(false)} className="absolute right-0 top-0 grid size-12 place-items-center rounded-full bg-white text-2xl text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" aria-label="Close enlarged image">×</button></div></div>}
    </div>
  );
}
