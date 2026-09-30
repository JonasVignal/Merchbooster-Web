import type { Metadata } from "next";
import styles from "../content-page.module.css";

export const metadata: Metadata = { title: "Track Your Order | Backstage Drop" };

export default function TrackOrderPage() {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Track Your Order</h1>
      <p>
        Since every order is placed on the artist's own storefront, order tracking is managed by that artist
        directly rather than through Backstage Drop.
      </p>
      <h2>How to find your tracking info</h2>
      <ul>
        <li>Check the confirmation email you received right after checkout.</li>
        <li>Once your order ships, the artist will send a follow-up email with a tracking link.</li>
        <li>If you can't find it, contact the artist directly — their storefront page usually has a contact option.</li>
      </ul>
    </div>
  );
}
