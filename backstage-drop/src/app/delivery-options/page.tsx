import type { Metadata } from "next";
import styles from "../content-page.module.css";

export const metadata: Metadata = { title: "Delivery Options | Backstage Drop" };

export default function DeliveryOptionsPage() {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Delivery Options</h1>
      <p>
        Delivery is handled by each individual artist, so available shipping options depend on the drop you're
        buying from.
      </p>
      <h2>Standard shipping</h2>
      <p>
        Most artists offer standard domestic and international shipping. Exact rates and delivery windows are
        shown at checkout on the artist's storefront.
      </p>
      <h2>Local pickup</h2>
      <p>
        Some artists offer local pickup for select drops — if available, this option will appear during checkout.
      </p>
    </div>
  );
}
