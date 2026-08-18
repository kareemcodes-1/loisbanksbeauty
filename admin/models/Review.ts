import {
  Schema,
  model,
  models,
  InferSchemaType,
  Model,
  Types,
} from "mongoose";

const reviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    isVerifiedPurchase: {
      type: Boolean,
      default: false,
      index: true,
    },

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

reviewSchema.index(
  {
    productId: 1,
    userId: 1,
  },
  {
    unique: true,
  }
);

export type ReviewDocument = InferSchemaType<typeof reviewSchema> & {
  _id: Types.ObjectId;
};

export type PopulatedReview = Omit<
  ReviewDocument,
  "userId" | "productId"
> & {
  userId: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };

  productId: {
    _id: Types.ObjectId;
    name: string;
    slug: string;
  };
};

const Review: Model<ReviewDocument> =
  models.Review ||
  model<ReviewDocument>("Review", reviewSchema);

export default Review;