import type { Metadata } from "next";
import styles from "../content-page.module.css";

export const metadata: Metadata = { title: "FAQ | Backstage Drop" };

const FAQS = [
  {
    q: "What is Backstage Drop?",
    a: "Backstage Drop is where every artist storefront and merch drop built with Merchbooster gets discovered by fans. Browse featured artists and see which drops are closing soon.",
  },
  {
    q: "Do I need an account to buy merch?",
    a: "No — you can browse and shop directly from an artist's storefront. Checkout happens on that artist's Merchbooster page.",
  },
  {
    q: "How do timed drops work?",
    a: "Artists schedule a launch time and a sale window (24–96 hours). Once the window closes, the shop locks until the next drop.",
  },
  {
    q: "I'm an artist — how do I get listed here?",
    a: "Sign up on Merchbooster, complete your storefront setup, and your shop will automatically appear on Backstage Drop once it's live.",
  },
];

export default function FaqPage() {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Frequently Asked Questions</h1>
      {FAQS.map((item) => (
        <div key={item.q}>
          <h2>{item.q}</h2>
          <p>{item.a}</p>
        </div>
      ))}
    </div>
  );
}
