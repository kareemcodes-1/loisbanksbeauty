import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISubscriberDocument extends Document {
  email: string;
  isActive: boolean;
  source?: string; // e.g. "cta", "footer", "popup"
  createdAt: Date;
  updatedAt: Date;
}

const subscriberSchema = new Schema<ISubscriberDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      default: "cta",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subscriber: Model<ISubscriberDocument> =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriberDocument>("Subscriber", subscriberSchema);

export default Subscriber;