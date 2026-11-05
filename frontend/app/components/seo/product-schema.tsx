import Script from "next/script";

type Props = {
  name: string;
  slug: string;
  description: string;
  images: string[];
  price: number; // the final selling price in NGN, same as shown on the page
  inStock: boolean;
  averageRating?: number;
  reviewCount?: number;
};

const BASE = "https://loisbanksbeauty.com";

export default function ProductSchema({
  name,
  slug,
  description,
  images,
  price,
  inStock,
  averageRating = 0,
  reviewCount = 0,
}: Props) {
  const url = `${BASE}/shop/p/${slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: images,
    sku: slug,
    brand: { "@type": "Brand", name: "LoisBanks Beauty" },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "NGN",
      price: price.toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    // Only include ratings that come from real customer reviews
    ...(reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.toFixed(1),
            reviewCount,
          },
        }
      : {}),
  };

  return (
    <Script
      id={`product-schema-${slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}