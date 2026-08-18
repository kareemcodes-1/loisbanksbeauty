// models/ChatConversation.ts
import mongoose, { Schema, Model } from "mongoose";

const chatMessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { _id: true, timestamps: true }
);

const chatConversationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    messages: {
      type: [chatMessageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const ChatConversation: Model<any> =
  mongoose.models.ChatConversation ||
  mongoose.model("ChatConversation", chatConversationSchema);

export default ChatConversation;