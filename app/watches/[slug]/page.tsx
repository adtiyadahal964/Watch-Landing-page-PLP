import { notFound, redirect } from "next/navigation";
import { products } from "@/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function WatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== "emerald-classic") notFound();
  redirect("/#product");
}
