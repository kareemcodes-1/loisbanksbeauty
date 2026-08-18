import {
  Schema,
  model,
  models,
  InferSchemaType,
  Model,
} from "mongoose";

const reviewSchema = new Schema(
  {
    /**
     * Product being reviewed
     */
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    /**
     * User who submitted the review
     */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /**
     * Rating from 1 to 5
     */
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    /**
     * Optional review title
     */
    title: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    /**
     * Review content
     */
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    /**
     * Whether the customer actually purchased
     * the product being reviewed.
     */
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
      index: true,
    },

    /**
     * Admin moderation
     *
     * A review must be approved before it
     * can appear publicly.
     */
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Prevent the same user from reviewing
 * the same product more than once.
 */
reviewSchema.index(
  {
    productId: 1,
    userId: 1,
  },
  {
    unique: true,
  }
);

export type ReviewDocument = InferSchemaType<typeof reviewSchema>;

const Review: Model<ReviewDocument> =
  models.Review ||
  model<ReviewDocument>("Review", reviewSchema);

export default Review;