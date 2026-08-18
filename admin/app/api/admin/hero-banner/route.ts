import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import HeroBanner from "@/models/HeroBanner";


// GET
// Get the current hero banner
export async function GET() {
  try {
    await connectDB();

    const heroBanner = await HeroBanner.findOne().lean();

    if (!heroBanner) {
      return NextResponse.json(
        {
          message: "Hero banner not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(heroBanner, {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/admin/hero-banner error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch hero banner",
      },
      {
        status: 500,
      }
    );
  }
}


// POST
// Create the hero banner
// Only ONE hero banner is allowed
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const existingHeroBanner = await HeroBanner.findOne();

    if (existingHeroBanner) {
      return NextResponse.json(
        {
          message: "A hero banner already exists. Update the existing banner instead.",
        },
        {
          status: 409,
        }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      media,
      mediaType,
      buttonText,
      buttonLink,
    } = body;

    // Basic validation
    if (
      !title ||
      !description ||
      !media ||
      !mediaType ||
      !buttonText ||
      !buttonLink
    ) {
      return NextResponse.json(
        {
          message: "All hero banner fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    // Validate media type
    if (!["image", "video"].includes(mediaType)) {
      return NextResponse.json(
        {
          message: 'mediaType must be either "image" or "video".',
        },
        {
          status: 400,
        }
      );
    }

    const heroBanner = await HeroBanner.create({
      title,
      description,
      media,
      mediaType,
      buttonText,
      buttonLink,
    });

    return NextResponse.json(
      {
        message: "Hero banner created successfully.",
        heroBanner,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/admin/hero-banner error:", error);

    return NextResponse.json(
      {
        message: "Failed to create hero banner.",
      },
      {
        status: 500,
      }
    );
  }
}


// PUT
// Update the existing hero banner
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const heroBanner = await HeroBanner.findOne();

    if (!heroBanner) {
      return NextResponse.json(
        {
          message: "Hero banner not found.",
        },
        {
          status: 404,
        }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      media,
      mediaType,
      buttonText,
      buttonLink,
    } = body;

    // Basic validation
    if (
      !title ||
      !description ||
      !media ||
      !mediaType ||
      !buttonText ||
      !buttonLink
    ) {
      return NextResponse.json(
        {
          message: "All hero banner fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    // Validate media type
    if (!["image", "video"].includes(mediaType)) {
      return NextResponse.json(
        {
          message: 'mediaType must be either "image" or "video".',
        },
        {
          status: 400,
        }
      );
    }

    heroBanner.title = title;
    heroBanner.description = description;
    heroBanner.media = media;
    heroBanner.mediaType = mediaType;
    heroBanner.buttonText = buttonText;
    heroBanner.buttonLink = buttonLink;

    await heroBanner.save();

    return NextResponse.json(
      {
        message: "Hero banner updated successfully.",
        heroBanner,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("PUT /api/admin/hero-banner error:", error);

    return NextResponse.json(
      {
        message: "Failed to update hero banner.",
      },
      {
        status: 500,
      }
    );
  }
}


// DELETE
// Delete the existing hero banner
export async function DELETE() {
  try {
    await connectDB();

    const heroBanner = await HeroBanner.findOne();

    if (!heroBanner) {
      return NextResponse.json(
        {
          message: "Hero banner not found.",
        },
        {
          status: 404,
        }
      );
    }

    await HeroBanner.deleteOne({
      _id: heroBanner._id,
    });

    return NextResponse.json(
      {
        message: "Hero banner deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("DELETE /api/admin/hero-banner error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete hero banner.",
      },
      {
        status: 500,
      }
    );
  }
}