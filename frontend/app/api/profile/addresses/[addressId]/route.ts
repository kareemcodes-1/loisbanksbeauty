import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

type Ctx = { params: Promise<{ addressId: string }> };

function normalizeAddress(body: Record<string, unknown>) {
  return {
    firstName: String(body.firstName ?? "").trim(),
    lastName: String(body.lastName ?? "").trim(),
    address: String(body.address ?? "").trim(),
    apartment: String(body.apartment ?? "").trim(),
    city: String(body.city ?? "").trim(),
    state: String(body.state ?? "").trim(),
    postalCode: String(body.postalCode ?? "").trim(),
    country: String(body.country ?? "")
      .trim()
      .toUpperCase(),
    isDefault: Boolean(body.isDefault),
  };
}

export async function PATCH(request: NextRequest, context: Ctx) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { addressId } = await context.params;
    if (!Types.ObjectId.isValid(addressId)) {
      return NextResponse.json(
        { message: "Invalid address id" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const updates = normalizeAddress(body);

    if (
      !updates.firstName ||
      !updates.lastName ||
      !updates.address ||
      !updates.city ||
      !updates.state ||
      !updates.postalCode ||
      !updates.country
    ) {
      return NextResponse.json(
        { message: "Please fill in all required address fields." },
        { status: 400 },
      );
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const addr = user.addresses.find(
      (address) => address._id?.toString() === addressId,
    );
    if (!addr) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 },
      );
    }

    if (updates.isDefault) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    addr.firstName = updates.firstName;
    addr.lastName = updates.lastName;
    addr.address = updates.address;
    addr.apartment = updates.apartment;
    addr.city = updates.city;
    addr.state = updates.state;
    addr.postalCode = updates.postalCode;
    addr.country = updates.country;
    addr.isDefault = updates.isDefault;

    // Keep at least one default if possible
    if (!user.addresses.some((a) => a.isDefault) && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return NextResponse.json({
      message: "Address updated.",
      address: {
        _id: String(addr._id),
        firstName: addr.firstName,
        lastName: addr.lastName,
        address: addr.address,
        apartment: addr.apartment ?? "",
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
        isDefault: addr.isDefault,
      },
    });
  } catch (error) {
    console.error("PATCH /api/profile/addresses/[id]", error);
    return NextResponse.json(
      { message: "Failed to update address." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: Ctx) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { addressId } = await context.params;
    if (!Types.ObjectId.isValid(addressId)) {
      return NextResponse.json(
        { message: "Invalid address id" },
        { status: 400 },
      );
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const addressIndex = user.addresses.findIndex(
      (address) => address._id?.toString() === addressId,
    );

    if (addressIndex === -1) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 },
      );
    }

    const wasDefault = user.addresses[addressIndex].isDefault;

    user.addresses.splice(addressIndex, 1);

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return NextResponse.json({ message: "Address deleted." });
  } catch (error) {
    console.error("DELETE /api/profile/addresses/[id]", error);
    return NextResponse.json(
      { message: "Failed to delete address." },
      { status: 500 },
    );
  }
}
