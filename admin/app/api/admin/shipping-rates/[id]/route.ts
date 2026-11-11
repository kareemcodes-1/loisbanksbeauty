import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ShippingRate from "@/models/ShippingRate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const rate = await ShippingRate.findById(id).lean();

    if (!rate) {
      return NextResponse.json(
        { message: "Shipping rate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rate, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/shipping-rates/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch shipping rate" },
      { status: 500 }
    );
  }
}


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const {
      country,
      countryName,
      state,
      stateCode,
      area,
      fee,
      isActive,
    } = body;

    const existingRate = await ShippingRate.findById(id);

    if (!existingRate) {
      return NextResponse.json(
        { message: "Shipping rate not found" },
        { status: 404 }
      );
    }

    // Use the existing values when a field isn't included in the request.
    const nextCountry = country
      ? country.trim().toUpperCase()
      : existingRate.country;

    const nextState =
      state !== undefined
        ? state?.trim() || null
        : existingRate.state;

    const nextArea =
      area !== undefined
        ? nextState
          ? area?.trim() || null
          : null
        : nextState
          ? existingRate.area || null
          : null;

    const nextCountryName = countryName?.trim() || existingRate.countryName;

    // Check for another record with the same country, state, and area.
    const duplicate = await ShippingRate.findOne({
      country: nextCountry,
      state: nextState,
      area: nextArea,
      _id: { $ne: id },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          message: nextArea
            ? `A shipping rate for ${nextArea}, ${nextState}, ${nextCountryName} already exists`
            : nextState
              ? `A shipping rate for ${nextState}, ${nextCountryName} already exists`
              : `A country-wide shipping rate for ${nextCountryName} already exists`,
        },
        { status: 400 }
      );
    }

    const updatedRate = await ShippingRate.findByIdAndUpdate(
      id,
      {
        ...(country !== undefined && {
          country: nextCountry,
        }),
        ...(countryName !== undefined && {
          countryName: countryName.trim(),
        }),
        ...(state !== undefined && {
          state: nextState,
        }),
        ...(stateCode !== undefined && {
          stateCode: stateCode?.trim() || null,
        }),
        ...(area !== undefined && {
          area: nextArea,
        }),
        ...(fee !== undefined && {
          fee,
        }),
        ...(isActive !== undefined && {
          isActive,
        }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return NextResponse.json({
      message: "Shipping rate updated successfully",
      data: updatedRate,
    });
  } catch (error) {
    console.error("Update shipping rate error:", error);

    return NextResponse.json(
      { message: "Failed to update shipping rate" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const deletedRate = await ShippingRate.findByIdAndDelete(id);

    if (!deletedRate) {
      return NextResponse.json(
        { message: "Shipping rate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Shipping rate deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/admin/shipping-rates/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete shipping rate" },
      { status: 500 }
    );
  }
}