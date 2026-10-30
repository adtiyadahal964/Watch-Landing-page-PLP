import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = { title: "Delivery, Returns & Privacy", description: "Read HIMA Watches information about Cash on Delivery, delivery charges, exchanges, warranty and order privacy." };

const sections = [
  { id: "orders", number: "01", title: "Orders & payment", body: "Cash on Delivery is currently the only payment option. After you submit an order, our team will call to confirm the watch, quantity, delivery address and payable total. An order is considered confirmed only after that call." },
  { id: "delivery", number: "02", title: "Delivery across Nepal", body: "Delivery costs NPR 100 inside Kathmandu Valley and NPR 150 outside the Valley. The applicable fee is shown before you order. Your delivery address is checked during confirmation, and the expected delivery timing is shared before dispatch." },
  { id: "returns", number: "03", title: "Returns & exchanges", body: "If you receive the wrong item or notice damage on arrival, contact us within 24 hours with clear photos. Keep the watch unused and retain its packaging. Our team will review the request and explain the available exchange or return steps before the item is sent back." },
  { id: "warranty", number: "04", title: "Warranty information", body: "Warranty applies only when it is stated on the selected product page or confirmed in writing by HIMA Watches. Normal wear, accidental damage and misuse are not automatically covered. Contact customer care with your order ID for an eligibility check." },
  { id: "privacy", number: "05", title: "Your information", body: "We collect only the details needed to process and deliver your order: name, phone number, email and delivery address. We use them for order communication and fulfilment, do not sell them, and keep order access limited to the services used to run HIMA Watches." },
];

export default function PoliciesPage() {
  return (
    <main>
      <Header />
      <section className="pt-28 pb-16 sm:pt-32 sm:pb-24">
        <div className="shell max-w-5xl">
          <p className="eyebrow">Shopping with HIMA</p>
          <h1 className="display mt-5 max-w-4xl">Clear policies.<br /><span className="italic text-gold">Confident choices.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-black/60 dark:text-white/60">The essentials of ordering, delivery and after-sales support—kept straightforward so you know what to expect.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">{sections.map((section, index)=><article id={section.id} key={section.id} className={`glass scroll-mt-28 rounded-3xl p-6 sm:p-8 ${index === sections.length - 1 ? "md:col-span-2" : ""}`}><div className="flex items-center justify-between gap-4"><span className="font-serif text-2xl text-gold">{section.number}</span><span className="h-px flex-1 bg-gradient-to-r from-gold/35 to-transparent" /></div><h2 className="mt-6 font-serif text-3xl font-semibold">{section.title}</h2><p className="mt-4 text-sm leading-7 text-black/60 dark:text-white/60">{section.body}</p></article>)}</div>
          <div className="mt-8 rounded-3xl bg-ink p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8 dark:bg-[#e8dfcf] dark:text-ink"><div><p className="eyebrow">Need help?</p><h2 className="mt-3 font-serif text-3xl font-semibold">Talk to customer care.</h2><p className="mt-3 text-sm leading-6 text-white/55 dark:text-ink/55">Include the watch name or order ID so we can help you faster.</p></div><a href="mailto:adtiyadahal964@gmail.com" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-champagne px-6 py-3 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:mt-0">Email HIMA Watches</a></div>
          <Link href="/#product" className="btn-secondary mt-8">← Back to Emerald Classic</Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
