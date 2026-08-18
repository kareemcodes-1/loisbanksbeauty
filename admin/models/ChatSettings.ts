import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFaq {
  question: string;
  answer: string;
}

export interface IChatSettingsDocument extends Document {
  // Brand
  brandName: string;
  about: string;
  owner: string;
  yearsActive: string;

  // Contact
  email: string;
  phone: string;
  whatsapp: string;
  storeLocation: string;

  // Policies
  howToOrder: string;
  faqs: IFaq[];

  // Extra admin instructions for the AI (appended to system prompt)
  adminInstructions: string;

  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: true }
);

const chatSettingsSchema = new Schema<IChatSettingsDocument>(
  {
    brandName: {
      type: String,
      default: "LoisBanks Beauty",
      trim: true,
    },
    about: {
      type: String,
      default: "",
      trim: true,
    },
    owner: {
      type: String,
      default: "",
      trim: true,
    },
    yearsActive: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    whatsapp: {
      type: String,
      default: "",
      trim: true,
    },
    storeLocation: {
      type: String,
      default: "",
      trim: true,
    },
    howToOrder: {
      type: String,
      default: "",
      trim: true,
    },
    faqs: {
      type: [faqSchema],
      default: [],
    },
    adminInstructions: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const ChatSettings: Model<IChatSettingsDocument> =
  mongoose.models.ChatSettings ||
  mongoose.model<IChatSettingsDocument>("ChatSettings", chatSettingsSchema);

export default ChatSettings;