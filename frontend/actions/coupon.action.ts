"use server";

import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import type { Coupon as CouponType } from "@/types";

function formatCoupon(coupon: any): CouponType {
  return {
    _id: coupon._id.toString(),
    title: coupon.title,
    description: coupon.description,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    minimumAmount: coupon.minimumAmount,
    maxDiscount: coupon.maxDiscount,
    usageLimit: coupon.usageLimit,
    usedCount: coupon.usedCount,
    expiresAt: new Date(coupon.expiresAt).toISOString(),
    isActive: coupon.isActive,
    createdAt: new Date(coupon.createdAt).toISOString(),
    updatedAt: new Date(coupon.updatedAt).toISOString(),
  };
}

/**
 * Get all active & non-expired coupons
 */
export async function getActiveCoupons() {
  try {
    await connectDB();

    const now = new Date();

    const coupons = await Coupon.find({
      isActive: true,
      expiresAt: { $gt: now },
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      coupons: coupons.map(formatCoupon),
      error: null,
    };
  } catch (error) {
    console.error("getActiveCoupons error:", error);
    return {
      coupons: [] as CouponType[],
      error: "Failed to fetch coupons",
    };
  }
}