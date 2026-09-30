import type { Metadata } from "next";
import { MERCHBOOSTER_URL } from "../../lib/site";
import styles from "../content-page.module.css";

export const metadata: Metadata = { title: "About Us | Backstage Drop" };

export default function AboutPage() {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>About Backstage Drop</h1>
      <p>
        Backstage Drop is the discovery home for every artist storefront and merch drop built with Merchbooster.
        Instead of fans having to know an artist's exact storefront link, Backstage Drop brings them all together
        in one place — so a limited drop can actually be found while it's still live.
      </p>
      <p>
        We built this because merch drops are exciting but easy to miss. Backstage Drop surfaces the artists people
        already love, and the drops that are about to close, so fans never show up too late.
      </p>
      <h2>Built on Merchbooster</h2>
      <p>
        Every storefront on Backstage Drop is powered by <a href={MERCHBOOSTER_URL}>Merchbooster</a>, the platform artists use to
        design their shop, schedule timed drops, and sell directly to fans.
      </p>
    </div>
  );
}
