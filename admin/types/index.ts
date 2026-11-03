export type HeroBannerMediaType = "image" | "video";

export interface HeroBanner {
  _id: string;
  title: string;
  description: string;
  media: string;
  mediaType: HeroBannerMediaType;
  buttonText: string;
  buttonLink: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  _id: string;
  name: string;
  slug: string;
  image: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "user" | "admin";

export interface Address {
  _id: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: UserRole;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export type ProductMediaType = "image" | "video";

export interface ProductMedia {
  _id: string;
  url: string;
  type: ProductMediaType;
}


export interface Product {
  _id: string;
  name: string;
  slug: string;
  collectionId: Collection;
  description: string;
  price: number;

  media: ProductMedia[];
  order?: number;

  featured: boolean;
  inStock: boolean;
  discount?: {
    discountType: "percentage" | "fixed";
    discountValue: number;
    title?: string;
  } | null;

  sizes: string[];

  averageRating: number;
  reviewCount: number;

  createdAt: string;
  updatedAt: string;
}



export type DiscountType = "percentage" | "fixed";

export interface Discount {
  _id: string;
  title: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  productIds: string[] | { _id: string; name: string; slug?: string }[];
  startsAt: string | Date;
  expiresAt: string | Date;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type OrderMediaType = "image" | "video";

export interface OrderMedia {
  _id: string;
  url: string;
  type: OrderMediaType;
}


export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}


export type PaymentProvider = "bachs";

export type PaymentChannel =
  | "card"
  | "bank_transfer"
  | "mobile_money"
  | "crypto"
  | "unknown";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface PaymentInfo {
  paymentProvider: PaymentProvider;
  paymentChannel: PaymentChannel | null;
  paymentChannelLabel: string | null;
  paymentStatus: PaymentStatus;
  transactionReference: string | null;
  bachsCheckoutId: string | null;
  paymentMethodDetails?: Record<string, unknown> | null;
  amountPaid?: string | null;
  currencyPaid?: string | null;
  paidAt: string | null;
}

export interface OrderItem {
  _id: string;
  productId: string;
  name: string;
  media: OrderMedia[];
  price: number;
  originalPrice: number;
  discount: {
    title: string | null;
    discountType: "percentage" | "fixed";
    discountValue: number;
  } | null;
  quantity: number;
  size?: string | null;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type ShippingMethod = "pickup" | "delivery";

export interface Order {
  _id: string;

  // null = guest order that hasn't been linked to an account yet
  userId:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
        phone?: string;
      }
    | null;

  // Email the order was placed with (works for guests and members)
  contactEmail: string | null;

  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;

  orderStatus: OrderStatus;
  shippingMethod: ShippingMethod;
  trackingNumber: string | null;

  adminNote: string | null;

  subtotal: number;
  shippingFee: number;
   tax: number;
  subcharge: number;
  totalAmount: number;

  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  productId:
    | string
    | {
        _id: string;
        name: string;
        slug: string;
      };
  userId:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Subscriber {
  _id: string;
  email: string;
  isActive: boolean;
  source?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ShippingRate {
  _id: string;
  country: string;
  countryName: string;
  state?: string | null;
  stateCode?: string | null;
  fee: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}
