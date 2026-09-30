import type { Metadata } from "next";
import styles from "../content-page.module.css";

export const metadata: Metadata = { title: "Shipping Info | Backstage Drop" };

export default function ShippingInfoPage() {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Shipping Info</h1>
      <p>
        Every drop on Backstage Drop is shipped directly by the artist behind it, so exact shipping times and
        carriers can vary from artist to artist.
      </p>
      <h2>General shipping times</h2>
      <ul>
        <li>Domestic orders typically arrive within 3–7 business days after a drop closes.</li>
        <li>International orders typically arrive within 7–21 business days.</li>
        <li>Because merch is produced per drop, orders ship after the drop's sale window ends, not immediately at checkout.</li>
      </ul>
      <h2>Tracking your order</h2>
      <p>
        Once your order ships, the artist will email you a tracking link. You can also check{" "}
        <a href="/track-order">Track Your Order</a> for more details.
      </p>
    </div>
  );
}
