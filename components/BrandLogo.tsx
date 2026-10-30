import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className = "h-16 w-auto", priority = false }: BrandLogoProps) {
  return (
    <Link href="/" aria-label="HIMA Watches home" className="inline-flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
      <Image
        src="/brand/hima-logo-light.webp"
        alt="HIMA Watches"
        width={600}
        height={481}
        priority={priority}
        className={`${className} object-contain dark:hidden`}
      />
      <Image
        src="/brand/hima-logo-dark.webp"
        alt="HIMA Watches"
        width={600}
        height={471}
        priority={priority}
        className={`${className} hidden object-contain dark:block`}
      />
    </Link>
  );
}
