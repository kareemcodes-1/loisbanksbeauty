export const TAX_PERCENT = 7.5;
export const SUBCHARGE_PERCENT = 2;

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** All amounts in NGN, the same currency prices are stored in */
export function calculateCharges(subtotal: number, shippingFee = 0) {
  const tax = round2((subtotal * TAX_PERCENT) / 100);
  const subcharge = round2((subtotal * SUBCHARGE_PERCENT) / 100);
  const total = round2(subtotal + tax + subcharge + shippingFee);

  return { subtotal, tax, subcharge, shippingFee, total };
}