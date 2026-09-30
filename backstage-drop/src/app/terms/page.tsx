import type { Metadata } from "next";
import styles from "../content-page.module.css";

export const metadata: Metadata = { title: "Terms & Conditions | Backstage Drop" };

export default function TermsPage() {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Terms & Conditions</h1>
      <p>
        Backstage Drop is a discovery site for artist storefronts and merch drops built with Merchbooster.
        By using this site, you agree to the following.
      </p>
      <h2>What Backstage Drop does</h2>
      <p>
        Backstage Drop lists artists and drops so fans can discover them. We don't process payments, ship
        products, or hold inventory — every purchase happens directly on the artist's own storefront.
      </p>
      <h2>Artist responsibility</h2>
      <p>
        Each artist is responsible for their own storefront, product listings, pricing, shipping, and customer
        service. Backstage Drop is not a party to any transaction made on an artist's storefront.
      </p>
      <h2>Changes to these terms</h2>
      <p>
        These terms may be updated from time to time as Backstage Drop evolves. Continued use of the site after
        changes means you accept the updated terms.
      </p>
    </div>
  );
}
