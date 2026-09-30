import type { Metadata } from "next";
import styles from "../content-page.module.css";

export const metadata: Metadata = { title: "Payment Methods | Backstage Drop" };

export default function PaymentMethodsPage() {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Payment Methods</h1>
      <p>
        Checkout happens directly on each artist's own Merchbooster storefront, so accepted payment methods are
        set by that artist's shop.
      </p>
      <h2>What's typically accepted</h2>
      <ul>
        <li>Major debit and credit cards</li>
        <li>Common regional payment methods, where enabled by the artist</li>
      </ul>
      <p>
        If you're unsure which payment methods a specific drop accepts, check the checkout step on that artist's
        storefront page.
      </p>
    </div>
  );
}
