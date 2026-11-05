import type { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

const BASE = "https://loisbanksbeauty.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: BASE },
    { url: `${BASE}/shop` },
    { url: `${BASE}/about` },
    { url: `${BASE}/contact` },
  ];

  try {
    await connectDB();

    const products = await Product.find({})
      .select("slug updatedAt")
      .lean<{ slug: string; updatedAt: Date }[]>();

    for (const product of products) {
      pages.push({
        url: `${BASE}/shop/p/${product.slug}`,
        lastModified: product.updatedAt,
      });
    }
  } catch (error) {
    console.error("Sitemap: failed to load products", error);
  }

  return pages;
}