import Link from "next/link";
import { cookies } from "next/headers";
import { formatNpr } from "@/data/products";
import { verifyOrderReference } from "@/lib/order-reference";
import { findOrderById, type StoredOrder } from "@/lib/order-store";

export default async function ThankYouPage() {
  const reference = (await cookies()).get("hima_order_ref")?.value;
  const orderId = verifyOrderReference(reference);
  let order: StoredOrder | null = null;
  let lookupUnavailable = false;
  if (orderId) {
    try { order = await findOrderById(orderId); } catch { lookupUnavailable = true; }
  }

  const details = order ? [
    ["Order ID", order.orderId], ["Product ordered", order.productName], ["Quantity", String(order.quantity)], ["Subtotal", formatNpr(order.subtotal)], ["Delivery charge", formatNpr(order.deliveryFee)], ["Total price", formatNpr(order.totalPrice)], ["Payment method", order.paymentMethod], ["Order status", order.status], ["Notification status", order.notificationStatus],
  ] : [];

  return (
    <main className="grid min-h-screen place-items-center overflow-x-clip bg-[radial-gradient(circle_at_50%_20%,rgba(212,180,119,.24),transparent_34%)] px-4 py-8 sm:px-6 sm:py-12">
      <section className="glass w-full max-w-2xl rounded-3xl p-5 text-center shadow-glow sm:rounded-[2.5rem] sm:p-9 lg:p-12">
        <div className={`mx-auto grid size-14 place-items-center rounded-full text-2xl text-white sm:size-16 ${order ? "bg-gold" : "bg-black/40 dark:bg-white/20"}`} aria-hidden="true">{order ? "✓" : "i"}</div>
        <p className="eyebrow mt-6">{order ? "Order received" : "Order details unavailable"}</p>
        <h1 className="mx-auto mt-4 max-w-xl break-words font-serif text-[clamp(2.25rem,9vw,3.75rem)] font-semibold leading-[1.02]">{order ? "Thank you for your order!" : "No verified order was found."}</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-black/55 dark:text-white/55">{order ? "Your order was found in the HIMA Watches order record. A representative will call you to confirm it before dispatch." : lookupUnavailable ? "The order service is temporarily unavailable. Your checkout has not been presented as confirmed on this page. Please contact support if you already submitted an order." : "This page displays a confirmation only when a signed checkout reference matches a saved order record."}</p>
        {order && <div className="mt-7 overflow-hidden rounded-2xl border border-black/10 text-left sm:mt-9 sm:rounded-3xl dark:border-white/10"><dl className="divide-y divide-black/10 text-sm dark:divide-white/10">{details.map(([label,value])=><div key={label} className="grid min-w-0 gap-1 px-4 py-4 sm:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] sm:gap-5 sm:px-5"><dt className="text-black/50 dark:text-white/50">{label}</dt><dd className={`min-w-0 font-medium [overflow-wrap:anywhere] sm:text-right ${label === "Order ID" ? "font-mono text-xs sm:text-sm" : ""}`}>{value}</dd></div>)}</dl></div>}
        {order && <div className="mt-6 rounded-2xl bg-gold/[.08] p-4 text-left text-sm leading-6 text-black/60 dark:text-white/60"><strong className="text-ink dark:text-white">Next step:</strong> Keep your phone available for order confirmation. “Order received” does not mean the order has been dispatched.</div>}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/#product" className="btn-primary">Back to Emerald Classic</Link><a href="mailto:adtiyadahal964@gmail.com" className="btn-secondary">Contact support</a></div>
      </section>
    </main>
  );
}
