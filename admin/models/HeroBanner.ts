import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHeroBanner extends Document {
  title: string;
  description: string;
  media: string;
  mediaType: "image" | "video";
  buttonText: string;
  buttonLink: string;
  createdAt: Date;
  updatedAt: Date;
}

const heroBannerSchema = new Schema<IHeroBanner>(
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

    media: {
      type: String,
      required: true,
      trim: true,
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    buttonText: {
      type: String,
      required: true,
      trim: true,
    },

    buttonLink: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const HeroBanner: Model<IHeroBanner> =
  mongoose.models.HeroBanner ||
  mongoose.model<IHeroBanner>("HeroBanner", heroBannerSchema);

export default HeroBanner;