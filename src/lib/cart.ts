export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

function cartKey(artistSlug: string) {
  return `merchbooster_cart_${artistSlug}`;
}

export function getCart(artistSlug: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(cartKey(artistSlug));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(artistSlug: string, items: CartItem[]) {
  window.localStorage.setItem(cartKey(artistSlug), JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(artistSlug: string, item: { id: string; name: string; price: number }) {
  const items = getCart(artistSlug);
  const existing = items.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ ...item, quantity: 1 });
  }
  saveCart(artistSlug, items);
  return items;
}

export function updateQuantity(artistSlug: string, id: string, quantity: number) {
  let items = getCart(artistSlug);
  if (quantity <= 0) {
    items = items.filter((i) => i.id !== id);
  } else {
    const existing = items.find((i) => i.id === id);
    if (existing) existing.quantity = quantity;
  }
  saveCart(artistSlug, items);
  return items;
}

export function removeFromCart(artistSlug: string, id: string) {
  return updateQuantity(artistSlug, id, 0);
}

export function clearCart(artistSlug: string) {
  saveCart(artistSlug, []);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
