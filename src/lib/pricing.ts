export const UNIT_PRICE_NGN = 30000;
export const SHIPPING_FEE_NGN = 3500;
export const FREE_SHIPPING_MIN_QTY = 5;
export const MIN_QTY = 1;
export const MAX_QTY = 50;

export function shippingFor(quantity: number) {
  return quantity >= FREE_SHIPPING_MIN_QTY ? 0 : SHIPPING_FEE_NGN;
}

export function totalFor(quantity: number) {
  return quantity * UNIT_PRICE_NGN + shippingFor(quantity);
}

export function naira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara",
] as const;
