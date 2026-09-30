import type { Metadata } from "next";
import styles from "../content-page.module.css";

export const metadata: Metadata = { title: "Contact Us | Backstage Drop" };

export default function ContactPage() {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Contact Us</h1>
      <p>
        Got a question about an order, an artist's drop, or Backstage Drop itself? We're happy to help.
      </p>
      <h2>General support</h2>
      <p>
        Email us at <a href="mailto:support@backstagedrop.dk">support@backstagedrop.dk</a> and we'll get back to you within 1–2 business days.
      </p>
      <h2>Order or delivery issues</h2>
      <p>
        For anything, reach out to us directly.
      </p>
    </div>
  );
}
