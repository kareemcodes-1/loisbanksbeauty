import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

function normalizeAddress(body: Record<string, unknown>) {
  return {
    firstName: String(body.firstName ?? "").trim(),
    lastName: String(body.lastName ?? "").trim(),
    address: String(body.address ?? "").trim(),
    apartment: String(body.apartment ?? "").trim(),
    city: String(body.city ?? "").trim(),
    state: String(body.state ?? "").trim(),
    postalCode: String(body.postalCode ?? "").trim(),
    country: String(body.country ?? "").trim().toUpperCase(),
    isDefault: Boolean(body.isDefault),
  };
}

function validateAddress(a: ReturnType<typeof normalizeAddress>) {
  if (!a.firstName || !a.lastName || !a.address || !a.city || !a.state || !a.postalCode || !a.country) {
    return "Please fill in all required address fields.";
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const address = normalizeAddress(body);
    const error = validateAddress(address);
    if (error) {
      return NextResponse.json({ message: error }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (address.isDefault || user.addresses.length === 0) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
      address.isDefault = true;
    }

    user.addresses.push(address);
    await user.save();

    const created = user.addresses[user.addresses.length - 1];

    return NextResponse.json(
      {
        message: "Address added.",
        address: {
          _id: String(created._id),
          ...address,
          isDefault: created.isDefault,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/profile/addresses", error);
    return NextResponse.json(
      { message: "Failed to add address." },
      { status: 500 },
    );
  }
}