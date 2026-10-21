import mongoose, { Document, Model, Schema } from "mongoose";

export interface IShippingRateDocument extends Document {
  country: string;          // e.g. "GH", "US", "NG"
  countryName: string;      // e.g. "Ghana", "United States"
  state?: string | null;    // e.g. "Greater Accra" (optional)
  stateCode?: string | null;
  fee: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const shippingRateSchema = new Schema<IShippingRateDocument>(
  {
    country: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    countryName: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      default: null,
      trim: true,
    },
    stateCode: {
      type: String,
      default: null,
      trim: true,
    },
    fee: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate: same country + same state
shippingRateSchema.index(
  { country: 1, state: 1 },
  { unique: true, sparse: true }
);

const ShippingRate: Model<IShippingRateDocument> =
  mongoose.models.ShippingRate ||
  mongoose.model<IShippingRateDocument>("ShippingRate", shippingRateSchema);

export default ShippingRate;