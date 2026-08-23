import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICollectionDocument extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new Schema<ICollectionDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Collection: Model<ICollectionDocument> =
  mongoose.models.Collection ||
  mongoose.model<ICollectionDocument>("Collection", collectionSchema);

export default Collection;