// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/lib/mongodb";
import ChatConversation from "@/models/ChatConversation";
import { chatModel } from "@/lib/gemini";
import { SALES_SYSTEM_PROMPT } from "@/lib/chat-system-prompt";
import {
  searchProducts,
  listAvailableProducts,
  findProductForCart,
  listCollections,
  listActiveDiscounts,
  getUserOrders,
  getBrandInfo,
  getStorePolicies,
  getAdminInstructions,
  getProductsByCollection,
} from "@/lib/chat-tools";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Intent =
  | "collections"
  | "collection_products"
  | "discounts"
  | "add_to_cart"
  | "orders"
  | "policies"
  | "brand"
  | "products_available"
  | "product_search"
  | "general";

function detectIntent(lower: string): Intent {
  // List all collections
  if (
    lower.includes("what collection") ||
    lower.includes("which collection") ||
    lower.includes("list collection") ||
    lower.includes("collections are available") ||
    lower.includes("available collections") ||
    lower === "collections"
  ) {
    return "collections";
  }

  // Products inside a specific collection
  // e.g. "Beauty Essentials", "show Luxury Wigs", "products in Athleisure"
  if (
    lower.includes("essentials") ||
    lower.includes("luxury wig") ||
    lower.includes("athleisure") ||
    (lower.includes("collection") &&
      (lower.includes("in ") ||
        lower.includes("from ") ||
        lower.includes("show") ||
        lower.includes("see") ||
        lower.includes("browse") ||
        lower.includes("products")))
  ) {
    return "collection_products";
  }

  // If they only say a known collection name after being asked
  // (short messages like "Beauty Essentials")
  if (
    lower.includes("beauty essential") ||
    lower.includes("luxury") ||
    lower.includes("athleisure")
  ) {
    return "collection_products";
  }

  if (
  lower.includes("coupon") ||
  lower.includes("discount") ||
  lower.includes("promo") ||
  lower.includes("offer")
) {
  return "discounts";
}

  if (
    lower.includes("add") &&
    (lower.includes("cart") || lower.includes("basket"))
  ) {
    return "add_to_cart";
  }

  if (
    lower.includes("my order") ||
    lower.includes("orders") ||
    lower.includes("order status")
  ) {
    return "orders";
  }

  if (
    lower.includes("ship") ||
    lower.includes("deliver") ||
    lower.includes("return") ||
    lower.includes("refund") ||
    lower.includes("payment") ||
    lower.includes("paystack") ||
    lower.includes("track order") ||
    lower.includes("how to order") ||
    lower.includes("human hair")
  ) {
    return "policies";
  }

  if (
    lower.includes("owner") ||
    lower.includes("contact") ||
    lower.includes("whatsapp") ||
    lower.includes("phone") ||
    lower.includes("email") ||
    lower.includes("location") ||
    lower.includes("store address") ||
    lower.includes("about the business") ||
    lower.includes("about this business")
  ) {
    return "brand";
  }

  if (
    lower.includes("what products") ||
    lower.includes("list product") ||
    lower.includes("show product") ||
    lower.includes("products available") ||
    lower.includes("available products") ||
    (lower.includes("in stock") && lower.includes("product")) ||
    (lower.includes("available") && lower.includes("product"))
  ) {
    return "products_available";
  }

  if (
    lower.includes("price") ||
    lower.includes("recommend") ||
    lower.includes("size") ||
    lower.includes("tell me about")
  ) {
    return "product_search";
  }

  return "general";
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { messages } = body as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { message: "Messages are required" },
        { status: 400 }
      );
    }

    const lastUser = [...messages].reverse().find((m) => m.role === "user");

    if (!lastUser?.content?.trim()) {
      return NextResponse.json(
        { message: "No user message found" },
        { status: 400 }
      );
    }

    const lower = lastUser.content.toLowerCase();
    const intent = detectIntent(lower);

    let toolContext = "";
    const actions: any[] = [];
    let productsToShow: any[] = [];

    switch (intent) {
      case "collections": {
        const collections = await listCollections();
        toolContext = `\nCollections:\n${JSON.stringify(collections)}`;
        break;
      }

      case "collection_products": {
        const query = lastUser.content
          .replace(
            /(show|me|the|products|in|from|collection|browse|see|please|items|of)/gi,
            " "
          )
          .trim();

        const result = await getProductsByCollection(
          query || lastUser.content,
          12
        );

        toolContext = `\nCollection products lookup:\n${JSON.stringify(result)}`;

        if (result.found && result.products.length > 0) {
          productsToShow = result.products;
        }
        break;
      }

      case "discounts": {
  const discounts = await listActiveDiscounts();
  toolContext = `\nActive discounts:\n${JSON.stringify(discounts)}`;
  break;
}
      case "add_to_cart": {
  const query = lastUser.content
    .replace(
      /\b(add|to|my|the|a|an|cart|basket|please|can you|could you|for me|i want|i'd like)\b/gi,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();


  if (query.length > 1) {
    const product = await findProductForCart(query);
    toolContext = `\nAdd to cart lookup:\n${JSON.stringify(product)}`;

    if (product && !("error" in product)) {
      actions.push({
        type: "add_to_cart",
        product,
      });
    }
  } else {
    toolContext =
      "\nAdd to cart lookup failed: could not extract product name from message.";
  }
  break;
}

      case "orders": {
        if (!session?.user?.id) {
          toolContext =
            "\nUser is NOT logged in. Politely ask them to log in to view orders.";
        } else {
          const orders = await getUserOrders(session.user.id);
          toolContext = `\nUser orders:\n${JSON.stringify(orders)}`;
        }
        break;
      }

      case "policies": {
  const policies = await getStorePolicies();
  toolContext = `\nPolicies & FAQ:\n${JSON.stringify(policies)}`;
  break;
}

case "brand": {
  const brand = await getBrandInfo();
  toolContext = `\nBrand info:\n${JSON.stringify(brand)}`;
  break;
}

      case "products_available": {
        const available = await listAvailableProducts(15);
        productsToShow = available.products || [];
        toolContext = `\nAvailable products:\n${JSON.stringify(available)}`;
        break;
      }

      case "product_search": {
        const query = lastUser.content
          .replace(
            /(what|is|the|a|an|about|tell me|price of|recommend|size of)/gi,
            " "
          )
          .trim();

        if (query.length > 1) {
          const products = await searchProducts(query, 6);
          if (products.length) productsToShow = products;
          toolContext = `\nMatching products:\n${JSON.stringify(products)}`;
        }
        break;
      }

      case "general":
      default:
        toolContext = "";
        break;
    }

    const userName = session?.user?.name || null;

    const historyText = messages
      .slice(-10)
      .map(
        (m) =>
          `${m.role === "user" ? "Customer" : "Assistant"}: ${m.content}`
      )
      .join("\n");

    const hasProductCards = productsToShow.length > 0;

const adminNotes = await getAdminInstructions();

const prompt = `
${SALES_SYSTEM_PROMPT}

${adminNotes ? `Admin notes (follow these):\n${adminNotes}\n` : ""}

User logged in: ${session?.user ? "yes" : "no"}
User name: ${userName || "Guest"}
Detected intent: ${intent}

Conversation:
${historyText}

Tool data:
${toolContext || "None"}

Response rules:
- Do not welcome the user again unless they just said hi/hello and there is almost no prior chat
- Keep answers short and natural
- ONLY use products/collections from Tool data — never invent products
- Prices are in Nigerian Naira (NGN) unless told otherwise
- If collection products is empty, say there are no products in that collection right now
- If collection was not found, say you couldn't find that collection
- ${
  hasProductCards
    ? `Product cards are shown in the UI. Reply with one short line only, e.g. "Here are the products in this collection:"`
    : `You may use clean Markdown for structure.`
}

Respond as the LoisBanks Beauty sales assistant.
`.trim();

    const result = await chatModel.generateContent(prompt);
    const reply = result.response.text();

    if (session?.user?.id) {
      try {
        await connectDB();

        await ChatConversation.findOneAndUpdate(
          { userId: session.user.id },
          {
            $push: {
              messages: {
                $each: [
                  { role: "user", content: lastUser.content },
                  { role: "assistant", content: reply },
                ],
              },
            },
          },
          { upsert: true, new: true }
        );
      } catch (saveError) {
        console.error("Failed to save chat:", saveError);
      }
    }

    return NextResponse.json({
      message: reply,
      actions,
      products: productsToShow,
      userName,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        message: "Sorry, I’m having trouble right now. Please try again.",
      },
      { status: 500 }
    );
  }
}