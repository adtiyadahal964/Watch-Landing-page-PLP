"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DELIVERY_FEES, formatNpr, getProductBySlug } from "@/data/products";

type Errors = Partial<Record<"name" | "phone" | "email" | "location" | "form", string>>;

export function CheckoutForm() {
  const search = useSearchParams();
  const router = useRouter();
  const product = getProductBySlug(search.get("product") || "emerald-classic");
  const initialQuantity = Math.min(10, Math.max(1, Number(search.get("quantity")) || 1));
  const [quantity, setQuantity] = useState(initialQuantity);
  const [deliveryArea, setDeliveryArea] = useState<keyof typeof DELIVERY_FEES>("inside-kathmandu");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const clientRequestId = useMemo(() => crypto.randomUUID(), []);

  if (!product || product.price === null) {
    return <section className="glass mx-auto max-w-2xl rounded-3xl p-6 text-center sm:p-10"><p className="eyebrow">Checkout unavailable</p><h1 className="mt-4 font-serif text-4xl font-semibold">This order link is no longer available.</h1><p className="mx-auto mt-5 max-w-md text-sm leading-6 text-black/55 dark:text-white/55">HIMA Watches is currently dedicated to the Emerald Classic. Return to the product page to review the confirmed price and continue.</p><Link href="/#product" className="btn-primary mt-7">View Emerald Classic</Link></section>;
  }

  const orderProduct = product;
  const unitPrice = product.price;
  const deliveryFee = DELIVERY_FEES[deliveryArea];
  const subtotal = unitPrice * quantity;
  const total = subtotal + deliveryFee;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = new FormData(event.currentTarget);
    const nextErrors: Errors = {};
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const location = String(form.get("location") ?? "").trim();
    if (name.length < 2) nextErrors.name = "Please enter your full name.";
    if (!/^[+0-9][0-9\s-]{6,18}$/.test(phone)) nextErrors.phone = "Please enter a valid phone number.";
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Please enter a valid email address for your order confirmation.";
    if (location.length < 5) nextErrors.location = "Please share a more exact delivery location.";
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);

    setSubmitting(true);
    setErrors({});
    try {
      const response = await fetch("/api/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, email, location, deliveryArea, productSlug: orderProduct.slug, productName: orderProduct.name, quantity, pricePerPiece: unitPrice, deliveryFee, totalPrice: total, clientRequestId }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not submit your order. Please try again.");
      router.push("/thank-you");
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "We could not submit your order. Please try again." });
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,.92fr)] lg:items-start lg:gap-8 xl:gap-12" noValidate>
      <section className="glass min-w-0 rounded-3xl p-4 sm:rounded-[2rem] sm:p-7 lg:p-8 xl:p-9">
        <div className="flex flex-col gap-4 min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between"><div><p className="eyebrow">Delivery details</p><h1 className="mt-3 font-serif text-[clamp(2rem,8vw,3rem)] font-semibold leading-[1.02]">Complete your order</h1></div><span className="w-fit shrink-0 rounded-full bg-gold/10 px-4 py-2 text-xs font-semibold text-gold">Cash on Delivery</span></div>
        <div className="mt-7 grid gap-5 sm:mt-8 sm:grid-cols-2">
          <Field label="Full name" error={errors.name} id="name"><input id="name" name="name" type="text" required className="field" autoComplete="name" placeholder="Your full name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} /></Field>
          <Field label="Phone number" error={errors.phone} id="phone"><input id="phone" name="phone" className="field" type="tel" required inputMode="tel" autoComplete="tel" placeholder="98XXXXXXXX" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} /></Field>
          <Field label="Email address" error={errors.email} id="email"><input id="email" name="email" className="field" type="email" required inputMode="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} /><span className="mt-2 block text-xs text-black/45 dark:text-white/45">Your order confirmation will be sent here.</span></Field>
          <label className="min-w-0 sm:col-span-2"><span className="mb-2 block text-sm font-medium">Delivery area</span><select name="deliveryArea" value={deliveryArea} onChange={(event) => setDeliveryArea(event.target.value as keyof typeof DELIVERY_FEES)} className="field"><option value="inside-kathmandu">Inside Kathmandu Valley — NPR 100</option><option value="outside-kathmandu">Outside Kathmandu Valley — NPR 150</option></select></label>
          <Field label="Exact delivery address or landmark" error={errors.location} id="location" full><textarea id="location" name="location" required className="field min-h-28 resize-y" autoComplete="street-address" placeholder="Area, street and a useful landmark" aria-invalid={!!errors.location} aria-describedby={errors.location ? "location-error" : undefined} /></Field>
        </div>
        <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/[.07] p-4 text-sm leading-6 text-black/60 sm:mt-7 dark:text-white/60"><strong className="text-ink dark:text-white">Before you order:</strong> Cash on Delivery is the only configured payment method. A representative will call to confirm your order, address and delivery timing. <Link href="/policies" className="font-semibold text-gold underline underline-offset-2">Review delivery and return information</Link>.</div>
      </section>

      <aside className="h-fit min-w-0 rounded-3xl bg-ink p-4 text-white shadow-glow sm:rounded-[2rem] sm:p-7 lg:sticky lg:top-6 xl:p-8 dark:bg-[#e9e0d0] dark:text-ink">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-champagne dark:text-gold">Order summary</p>
        <div className="mt-6 flex min-w-0 items-center gap-4"><div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-white sm:size-24"><Image src={orderProduct.images[0].src} alt={orderProduct.images[0].alt} fill sizes="96px" className="object-contain" /></div><div className="min-w-0 flex-1"><h2 className="break-words font-serif text-xl font-semibold sm:text-2xl">{orderProduct.name}</h2><p className="mt-2 break-words text-sm text-white/55 dark:text-ink/55">{formatNpr(unitPrice)} per piece</p></div></div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-y border-white/15 py-4 dark:border-black/15"><span className="text-sm text-white/65 dark:text-ink/65">Quantity</span><div className="flex items-center rounded-full border border-white/20 p-1 dark:border-black/15"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid size-11 place-items-center rounded-full" aria-label="Decrease quantity">−</button><span className="w-9 text-center text-sm font-semibold" aria-live="polite">{quantity}</span><button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))} className="grid size-11 place-items-center rounded-full" aria-label="Increase quantity">+</button></div></div>
        <dl className="mt-6 space-y-4 text-sm"><SummaryRow label="Subtotal" value={formatNpr(subtotal)} /><SummaryRow label="Delivery" value={formatNpr(deliveryFee)} /><SummaryRow label="Payment" value="Cash on Delivery" /><div className="grid gap-2 border-t border-white/15 pt-5 min-[360px]:grid-cols-[auto_1fr] dark:border-black/15"><dt className="font-medium">Total</dt><dd className="break-words font-serif text-2xl font-semibold min-[360px]:text-right sm:text-3xl">{formatNpr(total)}</dd></div></dl>
        {errors.form && <div role="alert" className="mt-6 rounded-2xl border border-red-400/40 bg-red-400/10 p-4 text-sm leading-5 text-red-100 dark:text-red-800">{errors.form}</div>}
        <button type="submit" disabled={submitting} aria-busy={submitting} className="mt-7 flex min-h-14 w-full items-center justify-center rounded-full bg-champagne px-4 py-3 text-center text-sm font-semibold text-ink transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-65 dark:bg-ink dark:text-white">{submitting ? "Submitting order…" : `Order now · ${formatNpr(total)}`}</button>
        <p className="mt-4 text-center text-xs leading-5 text-white/45 dark:text-ink/45">By submitting, you consent to HIMA Watches using these details to process this order. Read the <Link href="/policies#privacy" className="underline hover:text-champagne dark:hover:text-gold">privacy notice</Link>.</p>
      </aside>
    </form>
  );
}

function Field({ label, error, id, full, children }: { label: string; error?: string; id: string; full?: boolean; children: React.ReactNode }) { return <label htmlFor={id} className={`min-w-0 ${full ? "sm:col-span-2" : ""}`}><span className="mb-2 block text-sm font-medium">{label}</span>{children}{error && <span id={`${id}-error`} role="alert" className="mt-2 block text-xs text-red-600 dark:text-red-300">{error}</span>}</label>; }
function SummaryRow({ label, value }: { label: string; value: string }) { return <div className="flex min-w-0 justify-between gap-4"><dt className="text-white/55 dark:text-ink/55">{label}</dt><dd className="break-words text-right font-medium">{value}</dd></div>; }
