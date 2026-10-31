import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Emerald Classic | HIMA Watches", template: "%s | HIMA Watches" },
  description: "Discover the HIMA Watches Emerald Classic, available for NPR 3,999 with Cash on Delivery across Nepal.",
  keywords: ["Emerald Classic watch", "HIMA Watches", "watch in Nepal", "Cash on Delivery watch"],
  openGraph: { type: "website", siteName: "HIMA Watches", title: "Emerald Classic | HIMA Watches", description: "A green-dial classic with gold-tone details and a brown strap, available for NPR 3,999.", images: [{ url: "/images/emerald-classic-gallery/emerald-classic-front.png", alt: "HIMA Watches Emerald Classic" }] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-ivory text-ink antialiased dark:bg-[#11110f] dark:text-[#f7f2e8]">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.theme==='dark'||(!('theme' in localStorage)&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
