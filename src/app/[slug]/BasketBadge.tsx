"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart, cartCount } from "../../lib/cart";
import styles from "./page.module.css";

export function BasketBadge({ slug }: { slug: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(cartCount(getCart(slug)));
    const onUpdate = () => setCount(cartCount(getCart(slug)));
    window.addEventListener("cart-updated", onUpdate);
    return () => window.removeEventListener("cart-updated", onUpdate);
  }, [slug]);

  return (
    <Link href={`/${slug}/basket`} className={styles.basketBadge}>
      🛒{count > 0 && <span className={styles.basketBadgeCount}>{count}</span>}
    </Link>
  );
}
