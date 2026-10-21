import mongoose, { Document, Model, Schema } from "mongoose";

const orderMediaSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
  },
  {
    _id: true,
  }
);

const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    media: {
      type: [orderMediaSchema],
      default: [],
    },

    // What the customer actually paid (per unit)
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Full price before discount (per unit)
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // Snapshot of discount at time of order (null if none)
    discount: {
      type: {
        title: { type: String, default: null },
        discountType: {
          type: String,
          enum: ["percentage", "fixed"],
        },
        discountValue: { type: Number, min: 0 },
      },
      default: null,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    size: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    _id: true,
  }
);
const shippingAddressSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    apartment: {
      type: String,
      default: "",
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
  },
  {
    _id: false,
  }
);


const paymentInfoSchema = new Schema(
  {
    // Platform that collected the money
    paymentProvider: {
      type: String,
      enum: ["bachs"],
      required: true,
      default: "bachs",
    },

    // What the customer actually used on Bachs
    // Filled by webhook after payment (null until then)
    paymentChannel: {
      type: String,
      enum: [
        "card",
        "bank_transfer",
        "mobile_money",
        "crypto",
        "unknown",
      ],
      default: null,
    },

    // Human-readable for admin UI, e.g. "Bank transfer", "Card"
    paymentChannelLabel: {
      type: String,
      default: null,
      trim: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      required: true,
      default: "pending",
    },

    // Bachs charge_id
    transactionReference: {
      type: String,
      default: null,
      trim: true,
    },

    bachsCheckoutId: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },

    // Optional extra detail from Bachs (bank name, last4, etc.)
    paymentMethodDetails: {
      type: Schema.Types.Mixed,
      default: null,
    },

    // What Bachs reported was paid
    amountPaid: {
      type: String, // e.g. "16000.00" — keep as string like Bachs
      default: null,
    },

    currencyPaid: {
      type: String, // e.g. "NGN"
      default: null,
      uppercase: true,
      trim: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type ShippingMethod = "pickup" | "delivery";

export interface IOrderDocument extends Document {
  userId: mongoose.Types.ObjectId;

  items: {
  _id: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  name: string;
  media: {
    _id: mongoose.Types.ObjectId;
    url: string;
    type: "image" | "video";
  }[];
  price: number;          // paid per unit
  originalPrice: number;  // full price per unit
  discount: {
    title: string | null;
    discountType: "percentage" | "fixed";
    discountValue: number;
  } | null;
  quantity: number;
  size?: string | null;
}[];

  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

 paymentInfo: {
  paymentProvider: "bachs";
  paymentChannel:
    | "card"
    | "bank_transfer"
    | "mobile_money"
    | "crypto"
    | "unknown"
    | null;
  paymentChannelLabel: string | null;
  paymentStatus: "pending" | "paid" | "failed";
  transactionReference: string | null;
  bachsCheckoutId: string | null;
  paymentMethodDetails: Record<string, unknown> | null;
  amountPaid: string | null;
  currencyPaid: string | null;
  paidAt: Date | null;
};

  orderStatus: OrderStatus;
  shippingMethod: ShippingMethod;
  trackingNumber: string | null;

  // NEW
  adminNote: string | null;

  subtotal: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;

  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrderDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: unknown[]) => items.length > 0,
        message: "An order must contain at least one item",
      },
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    paymentInfo: {
      type: paymentInfoSchema,
      required: true,
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "out_for_delivery",
        "ready_for_pickup",
        "delivered",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    shippingMethod: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
    },

    trackingNumber: {
      type: String,
      default: null,
      trim: true,
    },

    // NEW
    adminNote: {
      type: String,
      default: null,
      trim: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrderDocument> =
  mongoose.models.Order ||
  mongoose.model<IOrderDocument>("Order", orderSchema);

export default Order;