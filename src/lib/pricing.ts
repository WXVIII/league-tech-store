export const UNIT_PRICE_NGN = 30000;
export const SHIPPING_FEE_NGN = 4500;
export const TRANSACTION_FEE_RATE = 0.015;
export const TRANSACTION_FEE_FIXED_NGN = 100;
export const MIN_QTY = 1;
export const MAX_QTY = 50;

export function shippingFor(quantity: number) {
  return quantity > 0 ? SHIPPING_FEE_NGN : 0;
}

export function pricingFor(quantity: number, discount = 0) {
  const subtotal = quantity * UNIT_PRICE_NGN;
  const cappedDiscount = Math.min(Math.max(0, Math.round(discount)), subtotal);
  const discountedSubtotal = subtotal - cappedDiscount;
  const shipping = shippingFor(quantity);
  const transactionFee = Math.round((discountedSubtotal + shipping) * TRANSACTION_FEE_RATE) + TRANSACTION_FEE_FIXED_NGN;
  return { subtotal, discount: cappedDiscount, shipping, transactionFee, total: discountedSubtotal + shipping + transactionFee };
}

export type Pricing = ReturnType<typeof pricingFor>;

export function totalFor(quantity: number, discount = 0) {
  return pricingFor(quantity, discount).total;
}

export function naira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara",
] as const;
