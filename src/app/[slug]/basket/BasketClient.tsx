"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartItem, getCart, updateQuantity, cartTotal } from "../../../lib/cart";
import styles from "./page.module.css";

export function BasketClient({ slug, isDropActive }: { slug: string; isDropActive: boolean }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart(slug));
    const onUpdate = () => setItems(getCart(slug));
    window.addEventListener("cart-updated", onUpdate);
    return () => window.removeEventListener("cart-updated", onUpdate);
  }, [slug]);

  const handleQuantity = (id: string, quantity: number) => {
    setItems(updateQuantity(slug, id, quantity));
  };

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Your basket is empty.</p>
        <Link href={`/${slug}`} className={styles.checkoutBtn}>Browse the drop</Link>
      </div>
    );
  }

  return (
    <>
      <div className={styles.itemList}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <div>
              <p className={styles.itemName}>{item.name}</p>
              <p className={styles.itemPrice}>{item.price} DKK</p>
            </div>
            <div className={styles.quantityControls}>
              <button type="button" onClick={() => handleQuantity(item.id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => handleQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <p className={styles.itemSubtotal}>{item.price * item.quantity} DKK</p>
            <button type="button" className={styles.removeBtn} onClick={() => handleQuantity(item.id, 0)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <p className={styles.total}>Total: {cartTotal(items)} DKK</p>
        {isDropActive ? (
          <Link href={`/${slug}/checkout`} className={styles.checkoutBtn}>
            Proceed to Checkout
          </Link>
        ) : (
          <p className={styles.closedNotice}>This drop isn&apos;t live right now, so checkout is unavailable.</p>
        )}
      </div>
    </>
  );
}
