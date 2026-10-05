"use client";

import { useState } from "react";
import { PRODUCTS } from "../../lib/products";
import { addToCart } from "../../lib/cart";
import styles from "./page.module.css";

export function ProductsSection({ slug }: { slug: string }) {
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const handleAdd = (product: (typeof PRODUCTS)[number]) => {
    addToCart(slug, product);
    setJustAdded(product.id);
    setTimeout(() => setJustAdded(null), 1200);
  };

  return (
    <div className={styles.productsGrid}>
      {PRODUCTS.map((product) => (
        <div key={product.id} className={styles.productCard}>
          <div className={styles.productImagePlaceholder}>{product.name}</div>
          <div className={styles.productInfo}>
            <h3>{product.name}</h3>
            <p>{product.price} DKK</p>
            <button className={styles.buyBtn} onClick={() => handleAdd(product)}>
              {justAdded === product.id ? "Added!" : "Drop in Basket"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
