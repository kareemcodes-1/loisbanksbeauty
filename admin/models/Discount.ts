import mongoose, { Document, Model, Schema } from "mongoose";

export type DiscountType = "percentage" | "fixed";

export interface IDiscountDocument extends Document {
  title: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  productIds: mongoose.Types.ObjectId[];
  minimumAmount: number;
  maxDiscount: number;
  startsAt: Date;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const discountSchema = new Schema<IDiscountDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    productIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    minimumAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    startsAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Discount: Model<IDiscountDocument> =
  mongoose.models.Discount ||
  mongoose.model<IDiscountDocument>("Discount", discountSchema);

export default Discount;