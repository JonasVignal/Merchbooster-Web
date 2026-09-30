import Link from "next/link";
import { MERCHBOOSTER_URL } from "../lib/site";
import styles from "./layout.module.css";

export function SiteHeader() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.navLogo}>Backstage Drop</Link>
      <a href={MERCHBOOSTER_URL} className={styles.navCta}>
        Become an artist →
      </a>
    </nav>
  );
}
