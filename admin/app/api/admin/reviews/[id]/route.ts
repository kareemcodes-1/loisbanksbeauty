import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import "@/models/User";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * Recalculate product review statistics
 *
 * Only approved reviews are included.
 */
async function updateProductReviewStats(
  productId: Types.ObjectId
) {
  const stats = await Review.aggregate([
    {
      $match: {
        productId,
        isApproved: true,
      },
    },
    {
      $group: {
        _id: "$productId",

        reviewCount: {
          $sum: 1,
        },

        averageRating: {
          $avg: "$rating",
        },
      },
    },
  ]);

  const reviewCount = stats[0]?.reviewCount ?? 0;

  const averageRating = stats[0]?.averageRating
    ? Math.round(stats[0].averageRating * 10) / 10
    : 0;

  await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        reviewCount,
        averageRating,
      },
    }
  );

  return {
    reviewCount,
    averageRating,
  };
}

/**
 * GET /api/admin/reviews/[id]
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid review ID",
        },
        {
          status: 400,
        }
      );
    }

    const review = await Review.findById(id)
      .populate("productId", "name slug")
      .populate("userId", "name email")
      .lean();

    if (!review) {
      return NextResponse.json(
        {
          message: "Review not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(review, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/reviews/[id] error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch review",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * PATCH /api/admin/reviews/[id]
 *
 * Approve / disapprove a review.
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid review ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    if (typeof body.isApproved !== "boolean") {
      return NextResponse.json(
        {
          message: "isApproved must be a boolean",
        },
        {
          status: 400,
        }
      );
    }

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        {
          message: "Review not found",
        },
        {
          status: 404,
        }
      );
    }

    review.isApproved = body.isApproved;

    await review.save();

    /**
     * Recalculate the product's rating after
     * approval/disapproval.
     */
    const stats = await updateProductReviewStats(
      review.productId
    );

    return NextResponse.json(
      {
        ...review.toObject(),

        productReviewStats: stats,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PATCH /api/admin/reviews/[id] error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to update review",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * DELETE /api/admin/reviews/[id]
 */
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid review ID",
        },
        {
          status: 400,
        }
      );
    }

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        {
          message: "Review not found",
        },
        {
          status: 404,
        }
      );
    }

    const productId = review.productId;

    await Review.findByIdAndDelete(id);

    /**
     * Recalculate because deleting an approved review
     * changes the product's rating statistics.
     */
    await updateProductReviewStats(productId);

    return NextResponse.json(
      {
        message: "Review deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE /api/admin/reviews/[id] error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to delete review",
      },
      {
        status: 500,
      }
    );
  }
}