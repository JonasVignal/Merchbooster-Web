// Prototype product catalog. Real per-drop products would come from
// MerchPackage.items, but that isn't wired to real inventory yet, so the
// storefront, basket, and checkout all share this fixed list.
export const PRODUCTS = [
  { id: "hoodie", name: "Exclusive Hoodie", price: 650 },
  { id: "tshirt", name: "Classic T-Shirt", price: 300 },
] as const;

export type ProductId = (typeof PRODUCTS)[number]["id"];

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}
