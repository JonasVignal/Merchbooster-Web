import type { Metadata } from "next";
import styles from "../content-page.module.css";

export const metadata: Metadata = { title: "Returns & Refunds | Backstage Drop" };

export default function ReturnsPage() {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Returns & Refunds</h1>
      <p>
        Because most drops are limited, made-to-order runs, return policies are set individually by each artist.
        Check the artist's storefront or the confirmation email from your order for their specific policy.
      </p>
      <h2>Damaged or incorrect items</h2>
      <p>
        If an item arrives damaged or isn't what you ordered, contact the artist directly with your order details
        and a photo of the issue — most artists will happily replace or refund it.
      </p>
      <h2>Changed your mind?</h2>
      <p>
        Since drops are time-limited and produced in small batches, many artists are unable to accept returns for
        a simple change of mind. Always check the artist's return policy before buying.
      </p>
    </div>
  );
}
