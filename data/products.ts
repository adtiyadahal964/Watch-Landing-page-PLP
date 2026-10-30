export type ProductImage = { src: string; alt: string };

export type Product = {
  slug: string;
  name: string;
  label: string;
  category: "Classic" | "Statement" | "Sport-inspired";
  price: number | null;
  images: ProductImage[];
  description: string;
  benefits: string[];
  specifications: Array<{ label: string; value: string }>;
  inventory: number | null;
};

export const DELIVERY_FEES = { "inside-kathmandu": 100, "outside-kathmandu": 150 } as const;

export const emeraldClassic: Product = {
  slug: "emerald-classic",
  name: "Emerald Classic",
  label: "HIMA Watches",
  category: "Classic",
  price: 3999,
  images: [
    { src: "/images/emerald-classic.webp", alt: "Emerald Classic watch with a green dial, gold-tone case and brown strap" },
    { src: "/images/emerald-classic-dial.webp", alt: "Close view of the Emerald Classic green dial and gold-tone details" },
    { src: "/images/emerald-classic-profile.webp", alt: "Full portrait view of the Emerald Classic watch and brown strap" },
  ],
  description: "A rich green dial, warm gold-tone details and a deep brown strap come together in an elegant watch designed to complement everyday and occasion dressing.",
  benefits: [
    "Elegant green, gold-tone and brown colour palette",
    "A versatile finishing touch for everyday and occasion outfits",
    "Clear pricing with Cash on Delivery across Nepal",
  ],
  specifications: [
    { label: "Colourway", value: "Emerald green, gold tone and brown" },
    { label: "Price", value: "NPR 3,999" },
    { label: "Technical details", value: "Additional verified specifications are available from HIMA Watches before ordering" },
  ],
  inventory: null,
};

// Retained for future catalogue use. These products and their image assets are
// intentionally excluded from the current single-product storefront.
export const archivedProducts: Product[] = [
  {
    slug: "midnight-black", name: "Midnight Black", label: "HIMA Watches", category: "Classic", price: 4599,
    images: [{ src: "/images/midnight-black.webp", alt: "Black watch with a black dial, silver accents and black strap" }],
    description: "A versatile black design with contrasting details, suited to understated everyday styling.",
    benefits: ["Refined dark colourway", "Easy to pair with casual and smart outfits", "Cash on Delivery across Nepal"],
    specifications: [{ label: "Colourway", value: "Black with silver-tone accents" }, { label: "Product information", value: "Additional technical details available from HIMA Watches" }], inventory: null,
  },
  {
    slug: "forest-steel", name: "Forest Steel", label: "HIMA Watches", category: "Sport-inspired", price: 4299,
    images: [{ src: "/images/forest-steel.webp", alt: "Green and silver-tone sport-inspired watch with a green strap" }],
    description: "A green and silver-tone statement watch with a bold, technical-looking dial and an easy-to-style green strap.",
    benefits: ["Distinctive green colourway", "Bold multi-display appearance", "Cash on Delivery across Nepal"],
    specifications: [{ label: "Colourway", value: "Green and silver tone" }, { label: "Product information", value: "Additional technical details available from HIMA Watches" }], inventory: null,
  },
  {
    slug: "forest-gold", name: "Forest Gold", label: "HIMA Watches", category: "Sport-inspired", price: 4785,
    images: [{ src: "/images/forest-gold.webp", alt: "Green and gold-tone sport-inspired watch with a green strap" }],
    description: "A green and gold-tone statement watch designed to bring a warmer, bolder accent to everyday outfits.",
    benefits: ["Green and gold-tone styling", "Bold multi-display appearance", "Cash on Delivery across Nepal"],
    specifications: [{ label: "Colourway", value: "Green and gold tone" }, { label: "Product information", value: "Additional technical details available from HIMA Watches" }], inventory: null,
  },
  {
    slug: "noir-silver-chronograph", name: "Noir Silver Chronograph", label: "HIMA Watches", category: "Statement", price: 5239,
    images: [{ src: "/images/noir-silver-chronograph.webp", alt: "Black bracelet watch with a silver-tone multi-dial face" }],
    description: "A monochrome black and silver-tone watch with a polished bracelet profile and a confident multi-dial look.",
    benefits: ["Monochrome statement styling", "Black bracelet presentation", "Cash on Delivery across Nepal"],
    specifications: [{ label: "Colourway", value: "Black and silver tone" }, { label: "Product information", value: "Additional technical details available from HIMA Watches" }], inventory: null,
  },
  {
    slug: "olive-grid-chronograph", name: "Olive Grid Chronograph", label: "HIMA Watches", category: "Sport-inspired", price: 4475,
    images: [{ src: "/images/olive-grid-chronograph.webp", alt: "Olive strap watch with a silver-tone angular case and dark multi-dial face" }],
    description: "An olive and silver-tone angular watch with a rugged visual character and a distinctive woven strap.",
    benefits: ["Olive statement colourway", "Angular case presentation", "Cash on Delivery across Nepal"],
    specifications: [{ label: "Colourway", value: "Olive, silver tone and black" }, { label: "Product information", value: "Additional technical details available from HIMA Watches" }], inventory: null,
  },
  {
    slug: "crimson-grid-chronograph", name: "Crimson Grid Chronograph", label: "HIMA Watches", category: "Sport-inspired", price: 4969,
    images: [{ src: "/images/crimson-grid-chronograph.webp", alt: "Red strap watch with a black angular case and dark multi-dial face" }],
    description: "A red and black angular watch created for customers who prefer a sharp, high-contrast statement piece.",
    benefits: ["High-contrast red colourway", "Angular case presentation", "Cash on Delivery across Nepal"],
    specifications: [{ label: "Colourway", value: "Red and black" }, { label: "Product information", value: "Additional technical details available from HIMA Watches" }], inventory: null,
  },
  {
    slug: "gold-ivory-chronograph", name: "Gold Ivory Chronograph", label: "HIMA Watches", category: "Statement", price: 5699,
    images: [{ src: "/images/gold-ivory-chronograph.webp", alt: "Gold-tone bracelet watch with an ivory multi-dial face" }],
    description: "A gold-tone and ivory statement watch with a bright bracelet finish and a refined multi-dial appearance.",
    benefits: ["Warm gold-tone presentation", "Ivory multi-dial appearance", "Cash on Delivery across Nepal"],
    specifications: [{ label: "Colourway", value: "Gold tone and ivory" }, { label: "Product information", value: "Additional technical details available from HIMA Watches" }], inventory: null,
  },
];

export const products: Product[] = [emeraldClassic];
export const getProductBySlug = (slug: string | null | undefined) => products.find((product) => product.slug === slug);
export const isOrderable = (product: Product) => product.price !== null;
export const formatNpr = (amount: number) => `NPR ${amount.toLocaleString("en-NP")}`;
