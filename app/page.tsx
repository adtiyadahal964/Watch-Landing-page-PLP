import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductShowcase } from "@/components/ProductShowcase";
import { emeraldClassic, formatNpr } from "@/data/products";

const faqs = [
  ["Is the Emerald Classic authentic?", "Please contact HIMA Watches before ordering for sourcing and authenticity information. We do not make an authenticity claim without seller verification."],
  ["What is the price?", "The confirmed price is NPR 3,999. There is no unverified discount or promotional price displayed."],
  ["How much does delivery cost?", "Delivery costs NPR 100 inside Kathmandu Valley and NPR 150 outside Kathmandu Valley. The applicable fee is shown in checkout before you submit."],
  ["How can I pay?", "The configured checkout currently supports Cash on Delivery only. No online payment details are collected."],
  ["Is there a warranty or return policy?", "Contact HIMA Watches within 24 hours if the wrong item arrives or you notice damage on delivery. Keep the watch unused with its packaging. Warranty applies only when confirmed in writing."],
];

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: emeraldClassic.name,
  image: emeraldClassic.images.map((image) => image.src),
  description: emeraldClassic.description,
  offers: {
    "@type": "Offer",
    priceCurrency: "NPR",
    price: emeraldClassic.price,
    seller: { "@type": "Organization", name: "HIMA Watches" },
  },
};

export default function Home() {
  const checkoutHref = "/checkout?product=emerald-classic&quantity=1";

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }} />
      <Header />

      <section className="grain relative isolate overflow-hidden bg-ink pb-14 pt-28 text-white sm:pb-20 sm:pt-32 lg:min-h-[820px] lg:pb-24">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_74%_42%,rgba(181,138,70,.28),transparent_31%),radial-gradient(circle_at_22%_18%,rgba(24,79,63,.35),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="shell grid items-center gap-10 lg:grid-cols-[minmax(0,.86fr)_minmax(460px,1.14fr)] lg:gap-12">
          <div className="relative z-10 max-w-2xl lg:py-16">
            <p className="eyebrow !text-champagne">The HIMA signature</p>
            <h1 className="mt-6 font-serif text-[clamp(3.25rem,9vw,6.9rem)] font-semibold leading-[.86] tracking-[-.055em]">
              Emerald<br /><span className="italic text-champagne">Classic.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/66 sm:text-lg sm:leading-8">A deep green dial framed by warm gold-tone details and a rich brown strap—an elegant finishing touch for the moments that matter and the days in between.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={checkoutHref} className="inline-flex min-h-14 items-center justify-center rounded-full bg-champagne px-7 py-3.5 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Order for {formatNpr(emeraldClassic.price!)}</Link>
              <Link href="#product" className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-champagne hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne">Explore the watch</Link>
            </div>
            <dl className="mt-10 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/12 text-sm sm:grid-cols-3">
              {[['Price', 'NPR 3,999'], ['Payment', 'Cash on Delivery'], ['Delivery', 'NPR 100 / 150']].map(([label, value]) => <div key={label} className="bg-ink/85 p-4"><dt className="text-[10px] font-semibold uppercase tracking-[.16em] text-white/42">{label}</dt><dd className="mt-2 font-semibold text-white/90">{value}</dd></div>)}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-[720px] py-5 sm:py-8 lg:py-12">
            <div className="absolute left-1/2 top-1/2 aspect-square w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-champagne/18" />
            <div className="absolute left-1/2 top-1/2 aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-champagne/20" />
            <div className="absolute left-1/2 top-1/2 aspect-square w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-3xl" />
            <div style={{ aspectRatio: `${emeraldClassic.images[0].width}/${emeraldClassic.images[0].height}` }} className="relative ml-auto w-[96%] rotate-[1.2deg] overflow-hidden rounded-[2rem] bg-[#17130f] shadow-[0_45px_120px_rgba(0,0,0,.5)] ring-1 ring-white/15 transition-transform duration-500 hover:rotate-[.4deg] sm:w-[94%] sm:rounded-[3rem]">
              <Image src={emeraldClassic.images[0].src} alt={emeraldClassic.images[0].alt} fill priority sizes="(max-width: 1023px) calc(100vw - 40px), 55vw" className="object-contain" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/15" />
            </div>
            <p className="absolute bottom-2 left-2 rounded-full bg-ink/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-champagne backdrop-blur sm:bottom-5 sm:left-5">One watch. One considered choice.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#ece4d6] py-5 text-ink dark:border-white/10 dark:bg-[#d8c9ae]">
        <div className="shell grid gap-3 text-center text-[11px] font-bold uppercase tracking-[.16em] sm:grid-cols-3 sm:text-left">
          <p>Confirmed price · NPR 3,999</p><p className="sm:text-center">Cash on Delivery</p><p className="sm:text-right">Delivery across Nepal</p>
        </div>
      </section>

      <section id="story" className="py-20 sm:py-28 lg:py-36">
        <div className="shell grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:items-end lg:gap-20">
          <div><p className="eyebrow">A study in contrast</p><h2 className="section-title mt-5 max-w-md">An emerald note.<br /><span className="italic text-gold">A timeless counterpoint.</span></h2></div>
          <div className="grid gap-7 sm:grid-cols-2"><p className="text-lg leading-8 text-black/65 dark:text-white/65">Emerald Classic is built around colour: a confident green dial balanced by warm gold-tone details and grounded by a deep brown strap.</p><p className="text-sm leading-7 text-black/50 dark:text-white/50">The result is expressive without being difficult to style—equally at home with daily dressing, a dinner look or a more formal occasion.</p></div>
        </div>
      </section>

      <section id="product" className="bg-black/[.035] py-20 sm:py-28 lg:py-36 dark:bg-white/[.025]">
        <div className="shell">
          <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="eyebrow">The watch, up close</p><h2 className="section-title mt-4">Every angle considered.</h2></div>
            <p className="max-w-md text-sm leading-6 text-black/55 dark:text-white/55">Select a view, open it full-screen and review the confirmed product information before ordering.</p>
          </div>
          <ProductShowcase product={emeraldClassic} />
        </div>
      </section>

      <section id="details" className="grain relative overflow-hidden bg-[#123b31] py-20 text-white sm:py-28 lg:py-36">
        <div className="pointer-events-none absolute -right-32 top-12 size-[520px] rounded-full border border-champagne/15"><div className="absolute inset-[18%] rounded-full border border-champagne/15" /><div className="absolute inset-[36%] rounded-full border border-champagne/15" /></div>
        <div className="shell relative">
          <div className="grid gap-10 lg:grid-cols-[.86fr_1.14fr] lg:items-center lg:gap-16">
            <div style={{ aspectRatio: `${emeraldClassic.images[2].width}/${emeraldClassic.images[2].height}` }} className="relative overflow-hidden rounded-[2rem] bg-[#17130f] shadow-2xl sm:rounded-[3rem]"><Image src={emeraldClassic.images[2].src} alt={emeraldClassic.images[2].alt} fill sizes="(max-width: 1023px) calc(100vw - 32px), 42vw" className="object-contain" /></div>
            <div><p className="eyebrow !text-champagne">Visual details</p><h2 className="section-title mt-5 max-w-xl">Three tones.<br />One distinct presence.</h2><div className="mt-10 divide-y divide-white/15 border-y border-white/15">{[["01","Emerald dial","The rich green face creates the watch’s defining visual character."],["02","Warm contrast","Gold-tone details give the green dial a refined, luminous counterpoint."],["03","Grounded finish","The deep brown strap brings warmth and makes the palette easy to coordinate."]].map(([number,title,body])=><article key={number} className="grid gap-4 py-6 sm:grid-cols-[56px_1fr] sm:py-7"><span className="font-serif text-2xl text-champagne">{number}</span><div><h3 className="font-serif text-2xl font-semibold">{title}</h3><p className="mt-2 max-w-lg text-sm leading-6 text-white/58">{body}</p></div></article>)}</div></div>
          </div>
        </div>
      </section>

      <section id="why-hima" className="py-20 sm:py-28 lg:py-36">
        <div className="shell">
          <div className="max-w-2xl"><p className="eyebrow">Why HIMA</p><h2 className="section-title mt-5">Luxury in the presentation.<br />Clarity in the purchase.</h2></div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[2rem] border border-black/10 bg-black/10 sm:grid-cols-3 dark:border-white/10 dark:bg-white/10">
            {[["01","One considered watch","No catalogue noise—just the Emerald Classic and the information needed to decide."],["02","A clear total","The product price and delivery fee remain visible before order submission."],["03","A human confirmation","Submit with Cash on Delivery, then confirm the order details by phone before dispatch."]].map(([number,title,body])=><article key={number} className="bg-ivory p-7 sm:p-8 lg:p-10 dark:bg-[#11110f]"><span className="font-serif text-2xl text-gold">{number}</span><h3 className="mt-10 font-serif text-2xl font-semibold">{title}</h3><p className="mt-4 text-sm leading-7 text-black/55 dark:text-white/55">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section id="delivery" className="bg-[#ebe2d2] py-20 text-ink dark:bg-[#d8c9ae] sm:py-28">
        <div className="shell grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-start lg:gap-20">
          <div><p className="eyebrow">Delivery, made clear</p><h2 className="section-title mt-5">Know the total<br />before you order.</h2><p className="mt-5 max-w-md text-sm leading-7 text-ink/60">Choose your delivery area at checkout. The applicable charge is added to the confirmed watch price before submission.</p></div>
          <div className="overflow-hidden rounded-[2rem] bg-ink text-white"><div className="grid gap-px bg-white/15 sm:grid-cols-2"><div className="bg-ink p-7 sm:p-9"><p className="text-xs uppercase tracking-[.18em] text-white/45">Inside Kathmandu Valley</p><p className="mt-5 font-serif text-4xl font-semibold text-champagne">NPR 100</p></div><div className="bg-ink p-7 sm:p-9"><p className="text-xs uppercase tracking-[.18em] text-white/45">Outside Kathmandu Valley</p><p className="mt-5 font-serif text-4xl font-semibold text-champagne">NPR 150</p></div></div><div className="p-7 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-9"><div><p className="font-semibold">Cash on Delivery</p><p className="mt-2 text-sm leading-6 text-white/55">A representative will call to confirm your order, address and delivery timing.</p></div><Link href={checkoutHref} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-champagne px-6 py-3 text-sm font-bold text-ink sm:mt-0">Continue to checkout</Link></div></div>
        </div>
      </section>

      <section id="faq" className="py-20 sm:py-28 lg:py-36">
        <div className="shell grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <div><p className="eyebrow">Good to know</p><h2 className="section-title mt-5">Your questions,<br />answered clearly.</h2><p className="mt-5 max-w-sm text-sm leading-7 text-black/55 dark:text-white/55">Where information has not been verified, we tell you directly rather than making a promise.</p></div>
          <div className="divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">{faqs.map(([question,answer])=><details key={question} className="group"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"><span>{question}</span><span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full border border-black/15 text-xl transition group-open:rotate-45 dark:border-white/15">+</span></summary><p className="max-w-2xl pb-6 pr-4 text-sm leading-7 text-black/55 dark:text-white/55">{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="pb-24 sm:pb-28 lg:pb-36">
        <div className="shell"><div className="grain relative overflow-hidden rounded-[2rem] bg-ink px-5 py-14 text-center text-white sm:rounded-[3rem] sm:px-10 sm:py-20"><div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-champagne/12" /><p className="eyebrow relative !text-champagne">Emerald Classic</p><h2 className="relative mx-auto mt-5 max-w-4xl font-serif text-[clamp(2.6rem,7vw,5.25rem)] font-semibold leading-[.95] tracking-[-.04em]">A considered choice,<br /><span className="italic text-champagne">beautifully simple.</span></h2><p className="relative mx-auto mt-6 max-w-lg text-sm leading-7 text-white/55">NPR 3,999 · Cash on Delivery · Delivery charges shown before confirmation</p><Link href={checkoutHref} className="relative mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-champagne px-8 py-3.5 text-sm font-bold text-ink transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto">Order Emerald Classic</Link></div></div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-ivory/95 p-3 shadow-[0_-12px_30px_rgba(0,0,0,.12)] backdrop-blur md:hidden dark:border-white/10 dark:bg-[#11110f]/95"><div className="mx-auto flex max-w-lg items-center gap-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">Emerald Classic</p><p className="text-xs text-black/50 dark:text-white/50">NPR 3,999</p></div><Link href={checkoutHref} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-ink px-5 text-sm font-bold text-white dark:bg-champagne dark:text-ink">Order now</Link></div></div>
      <Footer />
    </main>
  );
}
