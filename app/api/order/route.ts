import { createHash } from "node:crypto";
import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import { DELIVERY_FEES, getProductBySlug } from "@/data/products";
import { businessEmail, customerEmail } from "@/lib/email-templates";
import { createOrderReference } from "@/lib/order-reference";
import { saveOrder, updateNotificationStatus } from "@/lib/order-store";
import { orderSchema } from "@/lib/order-schema";

export const runtime = "nodejs";

function allowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowed = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_SITE_URL;
  return !origin || !allowed || origin === new URL(allowed).origin;
}

export async function POST(request: NextRequest) {
  try {
    if (!allowedOrigin(request)) return NextResponse.json({ error: "This order request is not allowed." }, { status: 403 });
    const parsed = orderSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Please check the order details and try again.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    const order = parsed.data;
    const catalogProduct = getProductBySlug(order.productSlug);
    if (!catalogProduct || catalogProduct.price === null || catalogProduct.name !== order.productName) return NextResponse.json({ error: "The selected product is not available for ordering." }, { status: 400 });
    const expectedDelivery = DELIVERY_FEES[order.deliveryArea];
    const expectedTotal = catalogProduct.price * order.quantity + expectedDelivery;
    if (order.pricePerPiece !== catalogProduct.price || order.deliveryFee !== expectedDelivery || order.totalPrice !== expectedTotal) return NextResponse.json({ error: "The order total changed. Please refresh and try again." }, { status: 400 });

    const orderId = `HIMA-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${createHash("sha256").update(order.clientRequestId).digest("hex").slice(0, 8).toUpperCase()}`;
    const dateTime = new Intl.DateTimeFormat("en-NP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kathmandu" }).format(new Date());
    const saved = await saveOrder(orderId, dateTime, order);

    const successfulEmailStatus = "Business and customer emails sent";
    let notificationStatus = saved.notificationStatus;
    const emailReady = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "BUSINESS_EMAIL", "EMAIL_FROM"].every((name) => Boolean(process.env[name]));
    if (notificationStatus !== successfulEmailStatus && !emailReady) {
      notificationStatus = "Email notifications not configured";
      await updateNotificationStatus(saved.rowNumber, notificationStatus);
      return NextResponse.json({ error: "Your order was saved, but email notifications are not configured. Please contact HIMA Watches." }, { status: 503 });
    }
    if (notificationStatus !== successfulEmailStatus) {
      const brand = process.env.BRAND_NAME || "HIMA Watches";
      const port = Number(process.env.SMTP_PORT);
      const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
      const from = process.env.EMAIL_FROM!;
      const support = process.env.BUSINESS_EMAIL!;
      const messages = [
        transporter.sendMail({ from, to: support, replyTo: order.email, subject: `New Product Order Received - ${orderId}`, html: businessEmail(order, orderId, dateTime, brand) }),
        transporter.sendMail({ from, to: order.email, replyTo: support, subject: `Your Order Has Been Received - ${brand}`, html: customerEmail(order, orderId, brand, support) }),
      ];
      const results = await Promise.allSettled(messages);
      const sent = results.filter((result) => result.status === "fulfilled").length;
      notificationStatus = sent === messages.length ? successfulEmailStatus : `${sent} of ${messages.length} emails sent`;
      await updateNotificationStatus(saved.rowNumber, notificationStatus);
      if (notificationStatus !== successfulEmailStatus) return NextResponse.json({ error: "Your order was saved, but one or more confirmation emails could not be delivered. Please verify your email address or contact HIMA Watches." }, { status: 502 });
    }

    const response = NextResponse.json({ success: true, orderId, emailSent: true });
    response.cookies.set("hima_order_ref", createOrderReference(orderId), { httpOnly: true, sameSite: "lax", path: "/thank-you", maxAge: 60 * 60, secure: Boolean(process.env.FRONTEND_URL?.startsWith("https://")) });
    return response;
  } catch (error) {
    console.error("Order submission failed", error);
    const configurationError = error instanceof Error && error.message.startsWith("Server configuration is incomplete");
    return NextResponse.json({ error: configurationError ? "Ordering is not configured yet. Please contact HIMA Watches directly." : "We could not complete your order. No confirmation has been issued. Please try again or contact support." }, { status: configurationError ? 503 : 500 });
  }
}
