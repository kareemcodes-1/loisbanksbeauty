// lib/chat-tools.ts
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Collection from "@/models/Collection";
import Discount from "@/models/Discount";
import Order from "@/models/Order";
import ChatSettings from "@/models/ChatSettings";

async function getChatSettingsDoc() {
  await connectDB();

  let settings = await ChatSettings.findOne().lean();

  if (!settings) {
    const created = await ChatSettings.create({});
    settings = created.toObject();
  }

  return settings;
}

/** Search products */
export async function searchProducts(query: string, limit = 8) {
  await connectDB();

  const products = await Product.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
  })
    .select("name slug price inStock sizes media description")
    .limit(limit)
    .lean();

  return products.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    price: p.price,
    inStock: p.inStock ?? true,
    sizes: p.sizes || [],
    description: p.description,
    image:
      p.media?.find((m: any) => m.type === "image")?.url ||
      p.media?.[0]?.url ||
      null,
  }));
}

export async function listAvailableProducts(limit = 15) {
  await connectDB();

  const products = await Product.find({
    inStock: true,
  })
    .select("name slug price inStock sizes media")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return {
    availableCount: products.length,
    products: products.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      price: p.price,
      inStock: true,
      sizes: p.sizes || [],
      image:
        p.media?.find((m: any) => m.type === "image")?.url ||
        p.media?.[0]?.url ||
        null,
      media: p.media || [],
    })),
  };
}

export async function findProductForCart(query: string) {
  await connectDB();

  const cleaned = query.trim().replace(/\s+/g, " ");
  if (!cleaned) return null;

  const escaped = cleaned.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  let p = await Product.findOne({
    $or: [
      { name: { $regex: escaped, $options: "i" } },
      { slug: { $regex: escaped, $options: "i" } },
    ],
  })
    .select("name slug price inStock sizes media")
    .lean();

  if (!p) {
    const words = cleaned
      .split(" ")
      .map((w) => w.trim())
      .filter((w) => w.length > 1);

    if (words.length > 0) {
      p = await Product.findOne({
        $and: words.map((w) => ({
          name: {
            $regex: w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            $options: "i",
          },
        })),
      })
        .select("name slug price inStock sizes media")
        .lean();
    }
  }

  if (!p) {
    const main = cleaned.split(" ").slice(0, 3).join(" ");
    p = await Product.findOne({
      name: {
        $regex: main.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      },
    })
      .select("name slug price inStock sizes media")
      .lean();
  }

  if (!p) {
    return { error: "not_found", query: cleaned };
  }

  if (!p.inStock) {
    return {
      error: "out_of_stock",
      name: p.name,
      productId: p._id.toString(),
    };
  }

  return {
    productId: p._id.toString(),
    name: p.name,
    slug: p.slug,
    price: p.price,
    size: p.sizes?.[0] || null,
    media: p.media || [],
  };
}

export async function listCollections() {
  await connectDB();

  const collections = await Collection.find({})
    .select("name slug")
    .lean();

  return collections.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    slug: c.slug,
  }));
}

export async function listActiveDiscounts() {
  await connectDB();
  const now = new Date();

  const discounts = await Discount.find({
    isActive: true,
    startsAt: { $lte: now },
    expiresAt: { $gte: now },
  })
    .select("title description discountType discountValue productIds")
    .lean();

  return discounts.map((d) => ({
    title: d.title,
    description: d.description,
    discountType: d.discountType,
    discountValue: d.discountValue,
  }));
}

export async function getUserOrders(userId: string, limit = 5) {
  await connectDB();

  const orders = await Order.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return orders.map((o) => ({
    id: o._id.toString(),
    reference:
      o.paymentInfo?.transactionReference ||
      String(o._id).slice(-8).toUpperCase(),
    status: o.orderStatus,
    totalAmount: o.totalAmount,
    itemCount:
      o.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0,
    items: (o.items || []).map((i: any) => ({
      name: i.name,
      quantity: i.quantity,
    })),
    createdAt: o.createdAt,
  }));
}

/** From ChatSettings (admin) */
export async function getBrandInfo() {
  const s = await getChatSettingsDoc();

  return {
    name: s.brandName || "LoisBanks Beauty",
    about: s.about || "",
    owner: s.owner || "",
    yearsActive: s.yearsActive || "",
    contact: {
      email: s.email || "",
      phone: s.phone || "",
      whatsapp: s.whatsapp || "",
      storeLocation: s.storeLocation || "",
    },
  };
}

/** From ChatSettings (admin) */
export async function getStorePolicies() {
  const s = await getChatSettingsDoc();

  return {
    faqs: (s.faqs || []).map((f: any) => ({
      question: f.question,
      answer: f.answer,
    })),
    howToOrder: s.howToOrder || "",
  };
}

/** Extra admin notes for the AI */
export async function getAdminInstructions() {
  const s = await getChatSettingsDoc();
  return s.adminInstructions || "";
}

export async function getProductsByCollection(query: string, limit = 12) {
  await connectDB();

  const collection = await Collection.findOne({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { slug: { $regex: query, $options: "i" } },
    ],
  })
    .select("_id name slug")
    .lean();

  if (!collection) {
    return {
      found: false,
      collection: null,
      products: [],
      message: "Collection not found",
    };
  }

  const products = await Product.find({
    collectionId: collection._id,
    inStock: true,
  })
    .select("name slug price inStock sizes media description")
    .limit(limit)
    .lean();

  return {
    found: true,
    collection: {
      id: collection._id.toString(),
      name: collection.name,
      slug: collection.slug,
    },
    products: products.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      price: p.price,
      inStock: p.inStock ?? true,
      sizes: p.sizes || [],
      description: p.description,
      image:
        p.media?.find((m: any) => m.type === "image")?.url ||
        p.media?.[0]?.url ||
        null,
      media: p.media || [],
    })),
  };
}