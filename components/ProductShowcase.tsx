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

  const selectImage = (index: number) => {
    const total = product.images.length;
    setImageIndex((index + total) % total);
  };

  useEffect(() => {
    if (!zoomed) return;
    previousFocus.current = document.activeElement as HTMLElement;
    closeButton.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(false);
      if (event.key === "ArrowLeft") selectImage(imageIndex - 1);
      if (event.key === "ArrowRight") selectImage(imageIndex + 1);
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
  }, [imageIndex, zoomed]);

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)] lg:gap-12 xl:gap-14">
      <div className="min-w-0 lg:grid lg:grid-cols-[88px_minmax(0,1fr)] lg:gap-4 xl:grid-cols-[104px_minmax(0,1fr)]">
        <div className="order-2 mt-3 flex snap-x gap-3 overflow-x-auto pb-2 lg:order-1 lg:mt-0 lg:flex-col lg:overflow-visible lg:pb-0" aria-label="Product image gallery">
          {product.images.map((image, index) => (
            <button key={image.src} style={{ aspectRatio: `${image.width ?? 4}/${image.height ?? 3}` }} type="button" onClick={() => selectImage(index)} aria-label={`Show view ${index + 1} of ${product.name}`} aria-current={index === imageIndex ? "true" : undefined} className={`group relative h-[72px] w-auto shrink-0 snap-start overflow-hidden rounded-2xl border-2 bg-[#17130f] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:h-20 lg:h-auto lg:w-full dark:focus-visible:ring-offset-ink ${index === imageIndex ? "border-gold shadow-[0_8px_28px_rgba(181,138,70,.2)]" : "border-transparent opacity-70 hover:border-gold/45 hover:opacity-100"}`}>
              <Image src={image.src} alt="" fill sizes="(max-width: 1023px) 110px, 104px" className="object-contain transition duration-300 group-hover:scale-[1.02]" />
              <span className={`absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-gold transition-opacity ${index === imageIndex ? "opacity-100" : "opacity-0"}`} />
            </button>
          ))}
        </div>

        <button style={{ aspectRatio: `${activeImage.width ?? 4}/${activeImage.height ?? 3}` }} type="button" onClick={() => setZoomed(true)} className="group relative order-1 mx-auto block w-full max-w-[680px] overflow-hidden rounded-3xl bg-[#17130f] text-left shadow-[0_24px_70px_rgba(33,24,13,.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:rounded-[2rem] lg:order-2" aria-label={`Open larger view of ${activeImage.alt}`}>
          <Image key={activeImage.src} src={activeImage.src} alt={activeImage.alt} fill priority={imageIndex === 0} sizes="(max-width: 1023px) calc(100vw - 32px), 48vw" className="gallery-image-enter object-contain" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[.06] dark:ring-white/10" />
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 text-[11px] font-semibold text-ink shadow-sm backdrop-blur transition group-hover:-translate-y-0.5"><span aria-hidden="true" className="text-base leading-none">⌕</span> View larger</span>
          <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-champagne backdrop-blur">{imageIndex + 1} / {product.images.length}</span>
        </button>
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

      {zoomed && <div ref={dialog} className="fixed inset-0 z-[90] grid place-items-center bg-black/90 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label={`Enlarged image of ${product.name}`} onMouseDown={(event) => { if (event.currentTarget === event.target) setZoomed(false); }}><div className="relative h-[88vh] w-full max-w-6xl"><Image key={activeImage.src} src={activeImage.src} alt={activeImage.alt} fill sizes="100vw" className="gallery-image-enter object-contain" /><button ref={closeButton} type="button" onClick={() => setZoomed(false)} className="absolute right-1 top-1 grid size-12 place-items-center rounded-full bg-white text-2xl text-ink shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" aria-label="Close enlarged image">×</button>{product.images.length > 1 && <><button type="button" onClick={() => selectImage(imageIndex - 1)} className="absolute left-1 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl text-ink shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:left-3" aria-label="Show previous image">‹</button><button type="button" onClick={() => selectImage(imageIndex + 1)} className="absolute right-1 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl text-ink shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:right-3" aria-label="Show next image">›</button></>}<p className="absolute inset-x-0 bottom-2 text-center text-xs font-semibold tracking-wide text-white/75">View {imageIndex + 1} of {product.images.length}</p></div></div>}
    </div>
  );
}
