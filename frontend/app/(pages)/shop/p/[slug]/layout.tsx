import type { Metadata } from "next";
import { cache } from "react";

import { getProductBySlug } from "@/actions/product.actions";
import ProductSchema from "@/app/components/seo/product-schema";

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

// The layout and generateMetadata both need the product.
// cache() makes sure it's only loaded once per request.
const getProduct = cache(getProductBySlug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const image = product.media.find((item) => item.type === "image")?.url;

  // Search results cut descriptions off at about 155 characters
  const description = product.description.replace(/\s+/g, " ").trim().slice(0, 155);

  return {
    title: product.name,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      url: `/shop/${product.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductLayout({
  children,
  params,
}: ProductLayoutProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return <>{children}</>;
  }

  // Use the price customers actually pay, so it matches the page
  let price = product.price;

  if (product.discount) {
    price =
      product.discount.discountType === "percentage"
        ? price - (price * product.discount.discountValue) / 100
        : price - product.discount.discountValue;

    price = Math.max(0, price);
  }

  const images = product.media
    .filter((item) => item.type === "image")
    .map((item) => item.url);

  return (
    <>
      {children}

      <ProductSchema
        name={product.name}
        slug={product.slug}
        description={product.description}
        images={images}
        price={price}
        inStock={product.inStock}
        averageRating={product.averageRating}
        reviewCount={product.reviewCount}
      />
    </>
  );
}