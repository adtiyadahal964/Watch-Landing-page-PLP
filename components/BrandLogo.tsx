import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className = "h-16 w-auto", priority = false }: BrandLogoProps) {
  return (
    <Link href="/" aria-label="HIMA Watches home" className="inline-flex shrink-0 items-center rounded-xl bg-[#f4ecdf] px-2 py-1.5 shadow-[0_8px_24px_rgba(21,20,17,.08)] ring-1 ring-black/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
      <Image
        src="/brand/hima-logo-official.png"
        alt="HIMA Watches"
        width={608}
        height={572}
        priority={priority}
        className={`${className} object-contain`}
      />
    </Link>
  );
}
