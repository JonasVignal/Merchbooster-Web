"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartItem, getCart, cartTotal, clearCart } from "../../../lib/cart";
import styles from "./page.module.css";

export function CheckoutForm({ slug, dropId }: { slug: string; dropId: string }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    setItems(getCart(slug));
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dropId,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress: { addressLine, city, postalCode, country },
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart(slug);
        setOrderId(data.orderId);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <div className={styles.confirmation}>
        <h2>Order placed!</h2>
        <p>Your order (#{orderId.slice(0, 8)}) has been received. A confirmation email is on its way to {customerEmail}. The artist will be in touch about payment and shipping.</p>
        <Link href={`/${slug}`} className={styles.submitBtn}>Back to shop</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Your basket is empty.</p>
        <Link href={`/${slug}`} className={styles.submitBtn}>Browse the drop</Link>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div className={styles.orderSummary}>
        <h2>Order Summary</h2>
        {items.map((item) => (
          <div key={item.id} className={styles.summaryRow}>
            <span>{item.name} × {item.quantity}</span>
            <span>{item.price * item.quantity} DKK</span>
          </div>
        ))}
        <div className={styles.summaryTotal}>
          <span>Total</span>
          <span>{cartTotal(items)} DKK</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Your Details</h2>
        <input
          type="text"
          placeholder="Full name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          required
        />
        <div className={styles.formRow}>
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
