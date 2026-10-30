import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="border-t border-black/10 pb-24 pt-8 sm:py-10 dark:border-white/10">
      <div className="shell grid gap-7 text-sm text-black/55 sm:grid-cols-2 sm:items-end lg:grid-cols-[1fr_auto_auto] dark:text-white/55">
        <div><BrandLogo className="h-20 w-auto sm:h-24" /><p className="mt-2 max-w-xs leading-6">The Emerald Classic, presented with clear pricing and straightforward ordering across Nepal.</p></div>
        <nav className="flex flex-wrap gap-x-2 gap-y-1" aria-label="Footer navigation"><Link className="flex min-h-11 items-center rounded-lg px-3 transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" href="/#product">The watch</Link><Link className="flex min-h-11 items-center rounded-lg px-3 transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" href="/#why-hima">Why HIMA</Link><Link className="flex min-h-11 items-center rounded-lg px-3 transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" href="/policies">Delivery & policies</Link><a className="flex min-h-11 items-center rounded-lg px-3 transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" href="mailto:adtiyadahal964@gmail.com">Customer care</a></nav>
        <p className="sm:text-right">© {new Date().getFullYear()} HIMA Watches</p>
      </div>
    </footer>
  );
}
