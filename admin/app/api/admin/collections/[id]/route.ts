import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Collection from "@/models/Collection";


// GET — Get one collection
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid collection ID",
        },
        {
          status: 400,
        }
      );
    }

    const collection = await Collection.findById(id).lean();

    if (!collection) {
      return NextResponse.json(
        {
          message: "Collection not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(collection, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/collections/[id] error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch collection",
      },
      {
        status: 500,
      }
    );
  }
}


// PUT — Update collection
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid collection ID",
        },
        {
          status: 400,
        }
      );
    }

    const collection = await Collection.findById(id);

    if (!collection) {
      return NextResponse.json(
        {
          message: "Collection not found",
        },
        {
          status: 404,
        }
      );
    }

    const body = await request.json();

    const {
      name,
      slug,
      image,
      featured,
    } = body;

    if (!name || !slug || !image) {
      return NextResponse.json(
        {
          message:
            "Name, slug, and image are required",
        },
        {
          status: 400,
        }
      );
    }

    const existingCollection = await Collection.findOne({
      slug,
      _id: { $ne: id },
    });

    if (existingCollection) {
      return NextResponse.json(
        {
          message: "A collection with this slug already exists",
        },
        {
          status: 409,
        }
      );
    }

    collection.name = name;
    collection.slug = slug;
    collection.image = image;
    collection.featured = featured ?? false;

    await collection.save();

    return NextResponse.json(
      {
        message: "Collection updated successfully",
        collection,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PUT /api/admin/collections/[id] error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to update collection",
      },
      {
        status: 500,
      }
    );
  }
}


// DELETE — Delete collection
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid collection ID",
        },
        {
          status: 400,
        }
      );
    }

    const collection = await Collection.findById(id);

    if (!collection) {
      return NextResponse.json(
        {
          message: "Collection not found",
        },
        {
          status: 404,
        }
      );
    }

    await Collection.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: "Collection deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE /api/admin/collections/[id] error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to delete collection",
      },
      {
        status: 500,
      }
    );
  }
}